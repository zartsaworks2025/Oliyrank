import { getCurrentUser } from "@/lib/auth/dal";
import { db } from "@/lib/db";
import { BookmarkButton } from "./account-forms";

/** Save button with the visitor's current state. Reads the session, so render inside Suspense. */
export async function BookmarkSlot({ universityId, slug }: { universityId: number; slug: string }) {
  const user = await getCurrentUser();
  const saved = user
    ? Boolean(await db.bookmark.findUnique({ where: { userId_universityId: { userId: user.id, universityId } } }))
    : false;
  return <BookmarkButton universityId={universityId} initialSaved={saved} signedIn={Boolean(user)} returnTo={`/universities/${slug}`} />;
}
