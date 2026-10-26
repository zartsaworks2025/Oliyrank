/** Search-box form of Uzbek text: lowercase, apostrophes dropped, so "oʻ", "o'" and "o‘" all match. */
export const normalizeSearch = (text: string) => text.toLocaleLowerCase("uz").replace(/[ʻʼ'`‘’]/g, "");
