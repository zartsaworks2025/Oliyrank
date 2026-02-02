import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { ensureAdmin } from "@/app/lib/guards";

const allowedTypes = ["UNIVERSITY", "LEARNING_CENTER"] as const;
const allowedStatuses = ["ACTIVE", "INACTIVE"] as const;

type InstitutionType = (typeof allowedTypes)[number];
type InstitutionStatus = (typeof allowedStatuses)[number];

type InstitutionPayload = {
  name: string;
  type: InstitutionType;
  status: InstitutionStatus;
  country: string | null;
  city: string | null;
  website: string | null;
};

const toString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const toOptional = (value: unknown) => {
  const trimmed = toString(value);
  return trimmed.length > 0 ? trimmed : null;
};

const parsePayload = (body: Record<string, unknown>): InstitutionPayload | null => {
  const name = toString(body.name);
  const type = body.type;
  const status = body.status ?? "ACTIVE";

  if (!name) return null;
  if (!allowedTypes.includes(type as InstitutionType)) return null;
  if (!allowedStatuses.includes(status as InstitutionStatus)) return null;

  return {
    name,
    type: type as InstitutionType,
    status: status as InstitutionStatus,
    country: toOptional(body.country),
    city: toOptional(body.city),
    website: toOptional(body.website),
  };
};

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await ensureAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const payload = parsePayload(body);

  if (!payload) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const updated = await prisma.institution.update({
    where: { id },
    data: payload,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await ensureAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await prisma.institution.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
