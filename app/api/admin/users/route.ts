import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";
import { ensureAdmin } from "@/app/lib/guards";

const allowedRoles = ["USER", "ADMIN", "ANALYST"] as const;
const allowedStatuses = ["ACTIVE", "INACTIVE"] as const;

type Role = (typeof allowedRoles)[number];
type Status = (typeof allowedStatuses)[number];

const toString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

export async function GET() {
  const session = await ensureAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          reviews: true,
          bookmarks: true,
        },
      },
    },
  });

  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const session = await ensureAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const name = toString(body.name);
  const email = toString(body.email).toLowerCase();
  const password = toString(body.password);
  const role = body.role;
  const status = body.status ?? "ACTIVE";

  if (!name || !email || password.length < 6) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!allowedRoles.includes(role as Role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  if (!allowedStatuses.includes(status as Status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already exists" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role as Role,
      status: status as Status,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ user }, { status: 201 });
}
