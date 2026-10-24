import { Suspense } from "react";
import { AccountNav } from "@/components/auth/account-nav";
import { SiteHeader } from "./site-header";

/** Site header with the session-dependent account buttons streamed in. */
export function SiteHeaderWithAccount() {
  return (
    <SiteHeader
      account={
        <Suspense fallback={<div className="hidden h-10 w-40 sm:block" aria-hidden="true" />}>
          <AccountNav />
        </Suspense>
      }
      mobileAccount={
        <Suspense fallback={null}>
          <AccountNav mobile />
        </Suspense>
      }
    />
  );
}
