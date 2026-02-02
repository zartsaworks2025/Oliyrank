import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const institutions = await prisma.institution.findMany({
    where: { status: "ACTIVE" },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ institutions });
}
