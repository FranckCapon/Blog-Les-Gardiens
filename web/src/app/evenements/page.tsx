import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/coming-soon";

export const metadata: Metadata = { title: "Événements" };

export default function Page() {
  return (
    <ComingSoon
      title="Événements"
      description="Soirées jeux, tournois et sorties organisés par le club."
    />
  );
}
