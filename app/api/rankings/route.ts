import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const periodIdParam = searchParams.get("periodId");

  const period = periodIdParam
    ? await prisma.rankingPeriod.findFirst({
        where: {
          id: Number(periodIdParam),
          status: "PUBLISHED",
        },
      })
    : await prisma.rankingPeriod.findFirst({
        where: { status: "PUBLISHED" },
        orderBy: { endDate: "desc" },
      });

  if (!period) {
    return NextResponse.json({ period: null, results: [] });
  }

  const results = await prisma.rankingResult.findMany({
    where: { periodId: period.id },
    include: {
      institution: true,
    },
    orderBy: { rank: "asc" },
  });

  return NextResponse.json({ period, results });
}
