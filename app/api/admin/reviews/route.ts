import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { ensureAdmin } from "@/app/lib/guards";

export async function GET(request: Request) {
  const session = await ensureAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status")?.toUpperCase();
  const allowedStatuses = ["PENDING", "APPROVED", "REJECTED"];

  const reviews = await prisma.review.findMany({
    where: allowedStatuses.includes(status ?? "")
      ? { status: status as "PENDING" | "APPROVED" | "REJECTED" }
      : undefined,
    include: {
      user: {
        select: { name: true, email: true },
      },
      institution: {
        select: { id: true, name: true },
      },
      _count: {
        select: { reports: true, votes: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ reviews });
}
