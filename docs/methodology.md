# OliyRank Methodology (MVP v1)

This document defines the MVP ranking methodology and data specification used by OliyRank.
It is intentionally simple and designed for transparent, repeatable scoring.

## Scope
- Institution types: universities and learning centers.
- Geography: Uzbekistan (initial phase).
- Ranking periods: annual (with optional quarterly updates).

## Scoring Model (0-100)
- Each indicator is scored on a 0-100 scale.
- Each indicator has a fixed weight.
- Final score is a weighted average:
  FinalScore = sum(IndicatorScore * IndicatorWeight) / sum(IndicatorWeight)
- Missing data in MVP is treated as 0 for that indicator and flagged internally.

## Pillars and Weights
Total weight = 100.

### Pillar A: Academic Quality (30)
- faculty_qualifications (8)
- program_accreditation (6)
- research_output (8)
- student_faculty_ratio (8)

### Pillar B: Infrastructure (20)
- campus_facilities (7)
- library_resources (5)
- lab_equipment (4)
- digital_infrastructure (4)

### Pillar C: Graduate Outcomes (25)
- employment_rate (10)
- median_salary (6)
- employer_feedback (5)
- internship_placement (4)

### Pillar D: Student Experience (25)
- student_satisfaction (8)
- teaching_quality (6)
- career_services (4)
- international_exposure (3)
- student_support (2)
- cost_value (2)

## Indicator Definitions (MVP)
- faculty_qualifications: % of faculty with PhD/Master + professional certifications.
- program_accreditation: % of programs with national/international accreditation.
- research_output: indexed publications + patents per faculty (normalized).
- student_faculty_ratio: smaller ratio scores higher.
- campus_facilities: classrooms, labs, dorms, accessibility.
- library_resources: library size, access to digital journals.
- lab_equipment: availability of modern labs/equipment for key programs.
- digital_infrastructure: LMS coverage, internet speed, digital services.
- employment_rate: % employed within 6-12 months after graduation.
- median_salary: normalized median salary after graduation.
- employer_feedback: employer survey score on graduate quality.
- internship_placement: % of students with verified internships.
- student_satisfaction: student survey overall satisfaction.
- teaching_quality: survey + peer review of instruction.
- career_services: effectiveness of career center and placement support.
- international_exposure: partnerships, exchange, foreign faculty ratio.
- student_support: counseling, disability support, wellbeing services.
- cost_value: affordability relative to outcomes.

## Data Sources (MVP)
- Official statistics and university reports.
- Accreditation registries and public disclosures.
- Employer and student surveys (structured).
- Independent audits and field verification (when possible).

## Publication Rules (MVP)
- New ranking period is published only after minimum data completeness is met.
- Every score is traceable to a source and timestamp.
- Changes are versioned by ranking period.

## Notes
- Weights are fixed for MVP and may change after public feedback.
- When a methodology update happens, a new ranking period is created.