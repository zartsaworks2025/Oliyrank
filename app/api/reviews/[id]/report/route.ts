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

  const body = (await request.json()) as { reason?: string; note?: string };
  const reason = typeof body.reason === "string" ? body.reason.trim() : "";
  const note = typeof body.note === "string" ? body.note.trim() : null;

  if (!reason) {
    return NextResponse.json({ error: "Reason required" }, { status: 400 });
  }

  await prisma.reviewReport.create({
    data: {
      reviewId,
      userId,
      reason,
      note: note && note.length > 0 ? note : null,
    },
  });

  await prisma.review.update({
    where: { id: reviewId },
    data: {
      isFlagged: true,
      flagReason: reason,
    },
  });

  return NextResponse.json({ success: true });
}
