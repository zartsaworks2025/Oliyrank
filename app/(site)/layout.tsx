import { FeedbackBanner } from "@/components/layout/feedback-banner";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeaderWithAccount } from "@/components/layout/site-chrome";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeaderWithAccount />
      <FeedbackBanner />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
