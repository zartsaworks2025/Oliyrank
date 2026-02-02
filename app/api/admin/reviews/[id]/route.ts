import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { ensureAdmin } from "@/app/lib/guards";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await ensureAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reviewId = Number(params.id);
  if (Number.isNaN(reviewId)) {
    return NextResponse.json({ error: "Invalid review id" }, { status: 400 });
  }

  const body = (await request.json()) as { status?: string };
  const status = body.status?.toUpperCase();

  if (!status || !["PENDING", "APPROVED", "REJECTED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await prisma.review.update({
    where: { id: reviewId },
    data: {
      status: status as "PENDING" | "APPROVED" | "REJECTED",
      isFlagged: status === "APPROVED" ? false : undefined,
      flagReason: status === "APPROVED" ? null : undefined,
    },
  });

  return NextResponse.json({ review: updated });
}
