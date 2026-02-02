import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/auth";
import { ensureUser } from "@/app/lib/guards";

const MIN_BODY_LENGTH = 20;
const MAX_BODY_LENGTH = 1200;
const MAX_TITLE_LENGTH = 80;

const getUserId = async (email?: string | null) => {
  if (!email) return null;
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  return user?.id ?? null;
};

const detectSpam = (title: string, body: string) => {
  const linkMatches = body.match(/https?:\/\//gi) ?? [];
  if (linkMatches.length >= 2) {
    return "Too many links";
  }
  if (body.length < MIN_BODY_LENGTH) {
    return "Message too short";
  }
  if (/free money|crypto|casino|gambling|bet/i.test(body)) {
    return "Suspicious keywords";
  }
  if (/([A-Za-z0-9])\1{6,}/.test(body)) {
    return "Repeated characters";
  }
  return null;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const institutionId = Number(searchParams.get("institutionId"));

  if (Number.isNaN(institutionId)) {
    return NextResponse.json({ error: "Invalid institutionId" }, { status: 400 });
  }

  const session = await auth();
  const userId = await getUserId(session?.user?.email ?? null);

  const reviews = await prisma.review.findMany({
    where: {
      institutionId,
      status: "APPROVED",
    },
    include: {
      user: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const reviewIds = reviews.map((review) => review.id);

  const voteGroups = reviewIds.length
    ? await prisma.reviewVote.groupBy({
        by: ["reviewId", "value"],
        where: { reviewId: { in: reviewIds } },
        _count: { value: true },
      })
    : [];

  const myVotes = userId
    ? await prisma.reviewVote.findMany({
        where: { userId, reviewId: { in: reviewIds } },
      })
    : [];

  const voteMap = new Map<number, { up: number; down: number }>();
  for (const group of voteGroups) {
    const current = voteMap.get(group.reviewId) ?? { up: 0, down: 0 };
    if (group.value > 0) {
      current.up += group._count.value;
    } else if (group.value < 0) {
      current.down += group._count.value;
    }
    voteMap.set(group.reviewId, current);
  }

  const myVoteMap = new Map<number, number>();
  for (const vote of myVotes) {
    myVoteMap.set(vote.reviewId, vote.value);
  }

  const payload = reviews.map((review) => {
    const votes = voteMap.get(review.id) ?? { up: 0, down: 0 };
    return {
      id: review.id,
      rating: review.rating,
      title: review.title,
      body: review.body,
      createdAt: review.createdAt,
      user: {
        name: review.user.name ?? "Anonymous",
      },
      votes,
      myVote: myVoteMap.get(review.id) ?? 0,
    };
  });

  return NextResponse.json({ reviews: payload });
}

export async function POST(request: Request) {
  const session = await ensureUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = await getUserId(session.user?.email ?? null);
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const institutionId = Number(body.institutionId);
  const rating = Number(body.rating);
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const reviewBody = typeof body.body === "string" ? body.body.trim() : "";

  if (
    Number.isNaN(institutionId) ||
    Number.isNaN(rating) ||
    rating < 1 ||
    rating > 5 ||
    !title ||
    title.length > MAX_TITLE_LENGTH ||
    reviewBody.length < MIN_BODY_LENGTH ||
    reviewBody.length > MAX_BODY_LENGTH
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const institution = await prisma.institution.findUnique({
    where: { id: institutionId },
    select: { id: true },
  });

  if (!institution) {
    return NextResponse.json({ error: "Institution not found" }, { status: 404 });
  }

  const flagReason = detectSpam(title, reviewBody);

  const created = await prisma.review.create({
    data: {
      institutionId,
      userId,
      rating,
      title,
      body: reviewBody,
      isFlagged: Boolean(flagReason),
      flagReason: flagReason ?? null,
      status: "PENDING",
    },
  });

  return NextResponse.json({
    reviewId: created.id,
    status: created.status,
    flagged: created.isFlagged,
  });
}
