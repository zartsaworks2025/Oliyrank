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

export async function GET() {
  const session = await ensureUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = await getUserId(session.user?.email ?? null);
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    include: {
      institution: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ bookmarks });
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

  const body = (await request.json()) as { institutionId?: number };
  const institutionId = Number(body.institutionId);

  if (Number.isNaN(institutionId)) {
    return NextResponse.json({ error: "Invalid institutionId" }, { status: 400 });
  }

  const bookmark = await prisma.bookmark.upsert({
    where: {
      userId_institutionId: { userId, institutionId },
    },
    update: {},
    create: { userId, institutionId },
  });

  return NextResponse.json({ bookmark });
}

export async function DELETE(request: Request) {
  const session = await ensureUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = await getUserId(session.user?.email ?? null);
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const institutionId = Number(searchParams.get("institutionId"));

  if (Number.isNaN(institutionId)) {
    return NextResponse.json({ error: "Invalid institutionId" }, { status: 400 });
  }

  await prisma.bookmark.deleteMany({
    where: { userId, institutionId },
  });

  return NextResponse.json({ success: true });
}
