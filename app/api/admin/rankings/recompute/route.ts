import { NextResponse } from "next/server";
import { ensureAdmin } from "@/app/lib/guards";
import { recomputeRanking } from "@/app/lib/ranking";

export async function POST(request: Request) {
  const session = await ensureAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { periodId?: number };
  const periodId = Number(body.periodId);

  if (Number.isNaN(periodId)) {
    return NextResponse.json({ error: "Invalid periodId" }, { status: 400 });
  }

  const results = await recomputeRanking(periodId);

  return NextResponse.json({ count: results.length });
}