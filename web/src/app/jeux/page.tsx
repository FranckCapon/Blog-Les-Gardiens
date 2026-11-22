import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Nos jeux" };

export default function Page() {
  return (
    <ComingSoon
      title="Nos jeux"
      description="La ludothèque du club : jeux de plateau, de cartes et de figurines."
    />
  );
}
