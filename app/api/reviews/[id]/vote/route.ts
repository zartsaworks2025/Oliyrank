import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { ensureUser } from "@/app/lib/guards";

const getUserId = async (email?: string | null) => {
  if (!email) return null;
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  return user?.id ?? null;
};

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await ensureUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = await getUserId(session.user?.email ?? null);
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  const reviewId = Number(params.id);
  if (Number.isNaN(reviewId)) {
    return NextResponse.json({ error: "Invalid review id" }, { status: 400 });
  }

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { status: true },
  });

  if (!review || review.status !== "APPROVED") {
    return NextResponse.json({ error: "Review not available" }, { status: 400 });
  }

  const body = (await request.json()) as { value?: number };
  const value = Number(body.value);

  if (![1, -1, 0].includes(value)) {
    return NextResponse.json({ error: "Invalid vote" }, { status: 400 });
  }

  if (value === 0) {
    await prisma.reviewVote.deleteMany({
      where: { reviewId, userId },
    });
  } else {
    await prisma.reviewVote.upsert({
      where: {
        userId_reviewId: { userId, reviewId },
      },
      update: { value },
      create: { reviewId, userId, value },
    });
  }

  return NextResponse.json({ success: true });
}
