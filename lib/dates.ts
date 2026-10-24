const MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];

/** "24-oktabr, 2026" — fixed Uzbek format, identical on server and client. */
export const formatArticleDate = (iso: string) => {
  const date = new Date(iso);
  return `${date.getUTCDate()}-${MONTHS[date.getUTCMonth()]}, ${date.getUTCFullYear()}`;
};
