// Name normalisation and matching for Uzbek institution names across Uzbek (Latin)
// and English records.

const STOPWORDS = new Set(["va", "nomidagi", "the", "of", "in", "and", "named", "after", "respublikasi", "republic", "huzuridagi", "qoshidagi", "under"]);

// Uzbek stems (first 5 letters) mapped to the stem of their English equivalent, so
// "Qarshi davlat universiteti" and "Karshi State University" share every token.
const CANONICAL = {
  davla: "state", milli: "natio", xalqa: "inter", jahon: "world",
  tibbi: "medic", medit: "medic", pedag: "pedag", texni: "techn", texno: "techn", polit: "polyt", poltexn: "polyt",
  iqtis: "econo", axbor: "infor", tilla: "langu", tilla_: "langu", chet: "forei", xorij: "forei",
  qishl: "agric", agrar: "agrar", agrot: "agrot", arxit: "archi", quril: "const", farma: "pharm",
  sharq: "orien", yurid: "law", huquq: "law", konse: "conse", musiq: "music", sanat: "art", sanʼa: "art",
  madan: "cultu", jismo: "physi", kimyo: "chemi", muhan: "engin", konch: "minin", molia: "finan", moliy: "finan",
  islom: "islam", jurna: "journ", akade: "acade", veter: "veter", irrig: "irrig", transp: "trans",
  toshk: "tashk", buxor: "bukha", fargo: "ferga", qarsh: "karsh", qoqon: "kokan", qoraq: "karak",
  urgan: "urgen", termi: "terme", olmal: "almal", navoi: "navoi", chirc: "chirc",
};
const BRANCH = /filial|fakult|manzil|kampus|branch|faculty|campus/i;
// Institution kinds that must agree between two names for them to match.
const KINDS = ["medic", "pedag", "conse", "music", "art", "physi", "techn", "econo", "langu", "law", "infor"];

/** Lowercase, drop Uzbek apostrophes and punctuation, collapse whitespace. */
export function normalize(name) {
  return name
    .toLowerCase()
    .replace(/[ʻʼ'`‘’"“”«»]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/** Canonical stems: first 5 letters, translated to the English stem where known. */
export function stems(name) {
  return new Set(
    normalize(name)
      .split(" ")
      .filter((token) => token.length > 1 && !STOPWORDS.has(token))
      .map((token) => CANONICAL[token.slice(0, 5)] ?? token.slice(0, 5)),
  );
}

/** Builds a scorer whose token weights reflect how rare each stem is in `corpus`. */
export function createMatcher(corpus) {
  const df = new Map();
  for (const name of corpus) for (const stem of stems(name)) df.set(stem, (df.get(stem) ?? 0) + 1);
  const weight = (stem) => Math.log((corpus.length + 1) / ((df.get(stem) ?? 0) + 1)) + 0.1;

  /** Weighted Jaccard similarity 0–1, or 0 when branch status or institution kind differ. */
  return function score(a, b) {
    if (BRANCH.test(a) !== BRANCH.test(b)) return 0;
    const x = stems(a);
    const y = stems(b);
    if (KINDS.some((kind) => x.has(kind) !== y.has(kind))) return 0;
    let shared = 0;
    let total = 0;
    for (const stem of new Set([...x, ...y])) {
      const w = weight(stem);
      total += w;
      if (x.has(stem) && y.has(stem)) shared += w;
    }
    return total === 0 ? 0 : shared / total;
  };
}

export function slugify(name) {
  return normalize(name)
    .replace(/ /g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60)
    .replace(/-$/, "");
}
