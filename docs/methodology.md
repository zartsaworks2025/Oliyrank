# OliyRank Methodology v1.1

How OliyRank ranks universities in Uzbekistan, and why. The weights in this document
are implemented in [`lib/methodology.ts`](../lib/methodology.ts); if the two disagree,
the code is what runs and this document must be fixed.

Research date: 24 October 2026.

---

## 1. What the established rankings do

### Global rankings

| | QS World University Rankings 2027 | THE World University Rankings 2027 | ARWU (Shanghai) 2025 |
|---|---|---|---|
| Structure | 5 lenses, 9 indicators | 5 pillars, 17 indicators | 6 indicators |
| Reputation surveys | **45%** (academic 30, employer 15) | **33%** (teaching 15, research 18) | 0% |
| Research / citations | Citations per faculty 20% | Research quality 30% (citation impact 15) + research environment 29% | 100% (Nobel/Fields alumni & staff 30, highly cited researchers 20, *Nature/Science* 20, publications 20, per-capita 10) |
| Teaching resources | Faculty–student ratio 10% | Staff–student 4.5%, doctorates 7.5%, income 2.5% | — |
| Graduate outcomes | Employment outcomes 5% | — | — |
| International | 15% (faculty 5, students 5, research network 5) | 7.5% | — |
| Other | Sustainability 5% | Industry income & patents 4% | — |
| Normalization | Refined per-indicator normalization (2026) | Cumulative probability / z-scores; exponential for reputation | Top institution = 100, others as % of top |

**What this tells us:**
- QS and THE are dominated by **reputation surveys and citations**. ARWU only measures elite research.
  All three are built to compare global research universities.
- That is the wrong lens for Uzbekistan. In QS 2026 only **7** Uzbek universities were ranked at all,
  the best of them TIIAME at 469th. Reputation surveys of global academics would rank almost every
  Uzbek university at zero. They would tell an applicant in Namangan nothing.
- What does transfer well: **published weights**, **per-capita research measures** (so large universities
  don't win on size alone), **field-normalized citations**, and **eligibility rules** (THE excludes
  institutions with too little research to measure; QS requires three graduated classes).

Sources: [QS methodology](https://support.qs.com/hc/en-gb/articles/4405955370898-QS-World-University-Rankings),
[THE methodology 2027](https://www.timeshighereducation.com/world-university-rankings/methodology%C2%A0),
[ARWU methodology 2025](https://www.shanghairanking.com/methodology/arwu/2025).

### Uzbekistan's official national rating (2026)

The National Agency for Ensuring Quality in Education runs a new national rating under regulation
**No. 3783 (28 Feb 2026)**, in force since 2 March 2026. First results are due **1 November 2026**,
and from then on every 1 November. Source: [lex.uz/docs/8067678](https://www.lex.uz/uz/docs/8067678).

- **25 indicators in 4 blocks**, with weights that differ by university field:

  | Block | Applied sciences | Medical | Social-humanitarian | Creative & sport |
  |---|---|---|---|---|
  | I. Academic (staff degrees, staff age, foreign degrees, foreign staff, staff–student ratio, 3 surveys) | 30 | 30 | 30 | 30 |
  | II. Research (Scopus articles by quartile, citations, h-index, patents, funding, PhD output) | 25 | 25 | 20 | 10 |
  | III. International (reputation survey, foreign students, student & staff mobility, joint degrees) | 15 | 15 | 15 | 10 |
  | IV. Graduates & digitalization (employer survey, **employment 10–30**, time to job, **graduate pay vs. national average**, digitalization survey) | 30 | 30 | 35 | 50 |

- **Scoring:** the best institution on each indicator gets full points; the rest score in
  proportion to it. Ties are broken by the employment indicator.
- **Surveys count only if at least 20% of students and staff respond**; otherwise they score 0.
- **Eligibility:** at least 3 years old, with graduates. Military institutions are excluded.
- **Data:** ministry information systems, university submissions (signed off by the rector),
  Scopus, and national and international surveys.

**What this tells us:** the government already collects exactly the student-relevant data that global
rankings lack: employment, time to first job and graduate salary. It weights graduates highest
(30–50 points). An academic study of the system
([Zenodo 22209387](https://zenodo.org/records/22209387)) notes three gaps:
- no field-normalized citations,
- no international co-authorship,
- some indicators feed back from global rankings.

### Principles for good rankings

The **Berlin Principles** (IREG, 2006) and the IREG audit criteria behind the "IREG Approved" seal
ask rankings to:
- state their purpose and audience,
- recognize institutional diversity,
- prefer outcome indicators over input indicators,
- publish their methodology,
- use verifiable data,
- correct errors openly.

Source: [IREG Observatory](https://ireg-observatory.org/en/initiatives/ranking-seal-of-approval).

---

## 2. Design decisions

1. **Audience: applicants and their families**, not academics. Every indicator must answer a question
   an applicant would ask: *Will I learn well here? Will I get a job? Is it hard to get in?
   What do students say?*
2. **Outcomes weigh most (30%)**, in line with the national rating and the Berlin Principles. Reputation
   surveys of global academics are excluded, because nearly every Uzbek university would score zero.
3. **Every number is checkable.** Each indicator names its source. Wherever possible the sources are
   public datasets that anyone can re-download: OpenAlex research data and the national testing
   agency's admission scores.
4. **Research is measured per staff member and field-normalized**, so a large university does not win
   on size alone, and a medical or engineering university is not compared on raw citation counts.
   This fills the gaps the academic study found in the national rating.
5. **Missing data is never silently zero.** The national rating gives 0 for missing survey data, which
   punishes universities for things outside their control. OliyRank instead redistributes the weight
   within the pillar, shows "no data" on the profile, and does not rank a university at all when too
   much is missing (see §5).
6. **One overall table, with a profile filter.** Universities are tagged by profile (multidisciplinary,
   technical, medical, pedagogical, economics & law, languages, agriculture, arts & sport), and the
   ranking can be filtered to compare like with like. Arts & sport institutions are listed but not
   ranked in v1.0, because their outcomes do not fit the indicators below. The national rating also
   gives them very different weights.

---

## 3. Indicators and weights (v1.1)

Total: 100 points across 5 pillars and 15 indicators.

### Pillar 1 — Teaching & admission · 25

| Key | Indicator | Weight | Measured as | Source |
|---|---|---|---|---|
| `admission_score` | Admission selectivity | 10 | Median 2025 **contract** passing score across full-time bachelor programs with a standard test (0–189 scale; creative-exam programs excluded) | Knowledge and Skills Assessment Agency (my.uzbmb.uz), annual |
| `staff_degree_share` | Staff with a doctorate | 8 | % of academic staff holding PhD/DSc (or candidate/doctor of science) | National rating data; university disclosures |
| `student_staff_ratio` | Students per academic staff member | 7 | Full-time-equivalent students ÷ academic staff (**lower is better**) | National rating data; university disclosures |

*Why:* admission scores are the one public, nationally comparable signal of how strong a university's
intake is, and they reflect what thousands of applicants think. Staff qualifications and class size
appear in QS, THE and the national rating alike.

### Pillar 2 — Research · 25

All research indicators cover the last 5 complete calendar years.

| Key | Indicator | Weight | Measured as | Source |
|---|---|---|---|---|
| `citation_impact` | Field-weighted citation impact | 10 | **Median** field-weighted citation impact (FWCI) of articles and reviews, weighted by authorship share; 1.0 = world average | OpenAlex |
| `output_per_staff` | Research output per staff member | 7 | Articles and reviews in indexed journals ÷ academic staff | OpenAlex; staff count as above |
| `top10_share` | Research excellence | 4 | % of output in the world's top 10% most-cited for its field and year | OpenAlex (citation-normalized percentile) |
| `intl_coauthorship` | International collaboration | 4 | % of output with at least one co-author abroad | OpenAlex |

**Counting rules (v1.1):**
- **Core journals only.** Articles and reviews in CWTS core sources (OpenAlex `is_core`), which filters out
  repositories and journals without rigorous indexing.
- **Fractional counting** (the CWTS Leiden Ranking method). A paper counts towards a university by that
  university's share of its authors: each author counts 1/n, split equally across their affiliations. In
  testing, whole counting credited universities with foreign-led papers that had a single local co-author,
  often one listing a second affiliation. That pushed one university's average citation impact to 6.9 and
  another's international share to 97%.
- **Median, not mean, citation impact.** With a few dozen papers, a handful of extremely cited ones can
  carry a whole university. In testing, five papers in a single journal produced 56% of one university's
  citation impact, for an average FWCI of 11.2 against a median of 2.8.
- **Minimum sample.** Research indicators are computed only from at least 30 fractionally counted papers in
  the five years. Below that, research shows as "too few publications".

*Why:* quality (impact, excellence) outweighs quantity, and every indicator is per capita or a share.
OpenAlex is open and free, so anyone can reproduce these numbers. It already covers 126 Uzbek higher
education institutions. FWCI and international co-authorship are exactly the gaps the academic study
found in the national rating.

### Pillar 3 — Graduate outcomes · 30

| Key | Indicator | Weight | Measured as | Source |
|---|---|---|---|---|
| `employment_rate` | Graduate employment | 12 | % of last year's graduates employed or in further study within 12 months | National rating data (ministry / tax and pension records) |
| `graduate_salary` | Graduate earnings | 10 | Average graduate salary ÷ national average nominal wage | National rating data; Statistics Agency |
| `employer_rating` | Employer rating | 8 | Average employer rating of graduates (1–5 scale) | OliyRank employer survey; national employer survey |

*Why:* this is what applicants care about most, and Uzbekistan collects it officially. It is the
heaviest pillar, as in the national rating.

### Pillar 4 — Student voice · 10

| Key | Indicator | Weight | Measured as | Source |
|---|---|---|---|---|
| `student_satisfaction` | Overall satisfaction | 6 | Average rating (1–5) of teaching quality and overall experience | OliyRank verified student survey and reviews |
| `student_support` | Facilities & support | 4 | Average rating (1–5) of facilities, digital services and support | OliyRank verified student survey |

**Minimum sample:** a university's student-voice scores count only with at least 30 verified responses,
and from at least 2% of its students. Below that, the pillar shows "not enough responses" and its
weight is redistributed (see §5). Survey responses are tied to verified student accounts, one per
person per year.

### Pillar 5 — International · 10

| Key | Indicator | Weight | Measured as | Source |
|---|---|---|---|---|
| `intl_students` | International students | 4 | % of students who are foreign citizens | National rating data; university disclosures |
| `intl_staff` | International staff | 3 | % of academic staff who are foreign citizens or hold a degree from a top-1000 foreign university | National rating data; university disclosures |
| `mobility` | Exchange & joint programs | 3 | Outbound exchange students plus students on joint/double-degree programs, % of all students | National rating data; university disclosures |

*Why:* international exposure appears in every ranking. It is kept modest (10%), because a high share
of foreign students says little about teaching quality on its own.

---

## 4. Scoring

For each indicator, across all eligible universities:

1. **Transform.** Count-like, heavily skewed indicators (`output_per_staff`) are log-transformed
   (`ln(1 + x)`). This stops one outlier from flattening everyone else.
2. **Cap outliers.** Values are clipped to the 5th–95th percentile of that indicator (winsorizing),
   using nearest-rank percentiles. With only a few dozen universities, interpolated percentiles let a
   single extreme value drag the cap with it.
3. **Scale to 0–100.** `score = 100 × (x − min) / (max − min)`. For indicators where lower is better
   (`student_staff_ratio`), the scale is reversed. If every university has the same value, all get 100.
4. **Pillar score** = weighted average of its indicator scores.
5. **Overall score** = weighted average of all indicator scores, rounded to one decimal place.
6. **Rank** by overall score. Equal overall scores share a rank (shown as "=5"). Within a shared rank,
   universities are listed by Graduate outcomes score, the same tiebreak the national rating uses.

*Why min–max after winsorizing, rather than THE's z-scores?* An applicant can understand it: 100 means
"as good as the strongest universities in Uzbekistan on this measure", and 0 means "the weakest".
The outlier cap does most of the job that z-scores do.

## 5. Missing data and eligibility

**Eligible:** degree-awarding universities in Uzbekistan, including branches of foreign universities,
that are at least 3 years old and have graduated at least one bachelor class. Military institutions
are excluded, as in the national rating.

**Missing data:**
- If an indicator is missing, its weight is redistributed to the other indicators in the same pillar,
  provided at least half of that pillar's weight has data.
- Otherwise the whole pillar counts as missing, and its weight is redistributed across the remaining
  pillars.
- A university is **ranked only if indicators worth at least 70% of total weight have data**. Below
  that, it is listed as **"Unranked (insufficient data)"** with whatever scores it has. This follows
  THE's "reporter" approach, and avoids the national rating's rule of counting missing data as zero.

## 6. Publication and corrections

- **Annual edition** each December, after the national rating (1 November) and the
  admission results are out. Each edition is frozen with its methodology version.
- **Universities may review their data** for 14 days before publication and submit corrections
  with evidence.
- **Errors found after publication** are corrected openly, with a dated changelog on the
  methodology page.
- **Methodology changes** create a new version number. Editions are compared only within the same
  version, or with a note.

## 7. Data availability (as of October 2026)

| Status | Indicators | Note |
|---|---|---|
| ✅ In use | `citation_impact`, `top10_share`, `intl_coauthorship` | OpenAlex API, free. 107 universities linked; 28 meet the 30-paper minimum |
| ✅ In use | `admission_score` | my.uzbmb.uz publishes 2025 **contract** cutoffs per program; grant cutoffs show as 0 and are not used. 95 universities have a value |
| ⛔ Not available | `output_per_staff` | Needs academic staff counts, which are not published |
| ⏳ Expected from 1 Nov 2026 | `employment_rate`, `graduate_salary`, `staff_degree_share`, `student_staff_ratio`, `intl_*`, `mobility` | Depends on how much indicator-level data the Agency publishes. Fallback: request it from universities directly, or use their public reports |
| 🛠 OliyRank must build | `student_satisfaction`, `student_support`, `employer_rating` | Verified surveys on the site; needs accounts and a survey flow |

**2026 preview edition** (`PREVIEW_INDICATORS` in `lib/methodology.ts`): ranks on the four indicators
in use. They are worth 28 points, rescaled to 100, with the same 70% coverage rule applied within the
edition. A university therefore needs both admission data and research data to be ranked. The
first build ranked 21 of 166 universities.

**University list.** All institutions that admitted students through the national test in 2025
(my.uzbmb.uz: 138 with 2025 programs), plus private universities and foreign branches that run their own
admissions, taken from ROR (28, hand-reviewed in `data/curation/extra-ror.json`). State institutions
missing from the 2025 admission list were merged in the 2025 consolidation and are excluded. Matches
between the admission list and ROR/OpenAlex are reviewed in `data/curation/`. A branch is never credited
with its parent's research.

## 8. Changelog

- **v1.0** (24 Oct 2026): first methodology, replacing the placeholder demo methodology.
- **v1.1** (24 Oct 2026), changes from testing on real data:
  - admission uses contract cutoffs, because grant cutoffs are not published;
  - research uses fractional counting and the median citation impact;
  - research requires at least 30 fractionally counted papers;
  - added the preview edition.
