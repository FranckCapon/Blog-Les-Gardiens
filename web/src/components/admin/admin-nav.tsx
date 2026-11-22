import { getSession } from "@/lib/auth/guards";
import { roleCan } from "@/lib/auth/permissions";

import { AdminNavLinks } from "./admin-nav-links";

/** Onglets de l'administration, limités à ce que le rôle permet de gérer. */
export async function AdminNav() {
  const session = await getSession();
  const role = session?.user.role;
  const links = [
    { href: "/admin", label: "Tableau de bord", show: true },
    { href: "/admin/articles", label: "Articles", show: roleCan(role, { article: ["update"] }) },
    { href: "/admin/evenements", label: "Événements", show: roleCan(role, { event: ["update"] }) },
    { href: "/admin/jeux", label: "Ludothèque", show: roleCan(role, { game: ["update"] }) },
    { href: "/admin/membres", label: "Membres", show: roleCan(role, { user: ["set-role"] }) },
  ].filter((l) => l.show);
  if (!session || links.length === 1) return null;
  return <AdminNavLinks links={links.map(({ href, label }) => ({ href, label }))} />;
}
