import { auth } from "@/auth";

export async function ensureAdmin() {
  const session = await auth();
  if (
    !session?.user ||
    session.user.role !== "ADMIN" ||
    session.user.status === "INACTIVE"
  ) {
    return null;
  }
  return session;
}

export async function ensureUser() {
  const session = await auth();
  if (!session?.user || session.user.status === "INACTIVE") {
    return null;
  }
  return session;
}
