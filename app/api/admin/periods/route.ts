import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { ensureAdmin } from "@/app/lib/guards";

export async function GET() {
  const session = await ensureAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const periods = await prisma.rankingPeriod.findMany({
    orderBy: { endDate: "desc" },
    select: {
      id: true,
      name: true,
      status: true,
      startDate: true,
      endDate: true,
    },
  });

  return NextResponse.json({ periods });
}
