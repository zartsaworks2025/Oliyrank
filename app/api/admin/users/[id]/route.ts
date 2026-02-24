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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await ensureAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const name = toString(body.name);
  const role = body.role;
  const status = body.status;
  const password = toString(body.password);

  const data: { name?: string; role?: Role; status?: Status; password?: string } = {};

  if (name) data.name = name;
  if (role && allowedRoles.includes(role as Role)) data.role = role as Role;
  if (status && allowedStatuses.includes(status as Status)) {
    data.status = status as Status;
  }
  if (password) {
    if (password.length < 6) {
      return NextResponse.json({ error: "Password too short" }, { status: 400 });
    }
    data.password = await bcrypt.hash(password, 10);
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ user: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await ensureAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const self = session.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      })
    : null;

  if (self?.id === id) {
    return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
