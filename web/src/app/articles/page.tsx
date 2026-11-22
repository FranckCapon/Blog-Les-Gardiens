import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Articles" };

export default function Page() {
  return (
    <ComingSoon title="Articles" description="Les actualités et comptes rendus des Gardiens." />
  );
}
