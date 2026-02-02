import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { ensureAdmin } from "@/app/lib/guards";

export async function GET() {
  const session = await ensureAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [institutions, activeInstitutions, users, pendingReviews, reviews] =
    await Promise.all([
      prisma.institution.count(),
      prisma.institution.count({ where: { status: "ACTIVE" } }),
      prisma.user.count(),
      prisma.review.count({ where: { status: "PENDING" } }),
      prisma.review.count(),
    ]);

  const latestPeriod = await prisma.rankingPeriod.findFirst({
    orderBy: { endDate: "desc" },
    select: { name: true, status: true },
  });

  return NextResponse.json({
    institutions,
    activeInstitutions,
    users,
    pendingReviews,
    reviews,
    latestPeriod,
  });
}
