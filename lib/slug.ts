/** URL slug from Uzbek/English text: lowercase Latin letters, digits and dashes. */
export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[ʻʼ'`‘’"“”«»]/g, "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");
}
