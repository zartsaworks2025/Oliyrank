/** Public contact address, shown on the contact page, footer and legal pages. */
export const CONTACT_EMAIL = "zartsaworks@gmail.com";

export const mailto = (subject?: string) =>
  `mailto:${CONTACT_EMAIL}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;

/** Date the legal pages were last reviewed; update it whenever they change. */
export const LEGAL_UPDATED = "2026-yil 30-oktabr";
