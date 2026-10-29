-- Close Supabase's auto-generated REST API (PostgREST) over these tables.
-- RLS with no policies denies the anon/authenticated roles everything; the site
-- connects through Prisma as the table owner, which RLS does not restrict.
-- New tables need the same line in their migration.
ALTER TABLE "University" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RankingPeriod" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Indicator" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Source" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Score" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RankingResult" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Bookmark" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ReviewVote" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ReviewReport" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Article" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;
