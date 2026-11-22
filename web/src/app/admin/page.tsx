import { CalendarDays, Dices, Newspaper } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { requirePermission } from "@/lib/auth/guards";
import { roleCan, roleLabels, type RoleName } from "@/lib/auth/permissions";

export const metadata: Metadata = { title: "Administration" };

export default function AdminPage() {
  return (
    <>
      <h1 className="mb-6 font-display text-2xl font-semibold tracking-wide">Administration</h1>
      <Suspense fallback={<p className="text-muted-foreground">Chargement…</p>}>
        <Admin />
      </Suspense>
    </>
  );
}

async function Admin() {
  // Réservé aux modérateurs et administrateurs : un membre reçoit une page 403.
  const { user } = await requirePermission({ article: ["create"] }, "/admin");
  const can = (permissions: Parameters<typeof roleCan>[1]) => roleCan(user.role, permissions);

  const sections = [
    {
      href: "/admin/articles",
      icon: Newspaper,
      title: "Articles",
      text: can({ article: ["delete"] })
        ? "Rédiger, modifier et supprimer les articles du blog."
        : "Rédiger et modifier les articles du blog.",
      show: can({ article: ["update"] }),
    },
    {
      href: "/admin/evenements",
      icon: CalendarDays,
      title: "Événements",
      text: "Programmer les soirées et voir qui est inscrit.",
      show: can({ event: ["update"] }),
    },
    {
      href: "/admin/jeux",
      icon: Dices,
      title: "Ludothèque",
      text: "Ajouter, corriger ou retirer des jeux du club.",
      show: can({ game: ["update"] }),
    },
  ].filter((s) => s.show);

  const rights = [
    { label: "Rédiger et modifier des articles", allowed: can({ article: ["create", "update"] }) },
    { label: "Supprimer des articles", allowed: can({ article: ["delete"] }) },
    { label: "Organiser des événements", allowed: can({ event: ["create", "update"] }) },
    { label: "Supprimer des événements", allowed: can({ event: ["delete"] }) },
    { label: "Gérer la ludothèque", allowed: can({ game: ["create", "update", "delete"] }) },
    { label: "Gérer les membres et leurs rôles", allowed: can({ user: ["list", "set-role"] }) },
  ];

  return (
    <div className="grid gap-8">
      <p className="text-muted-foreground">
        Connecté en tant que <strong className="text-foreground">{user.name}</strong> (
        {roleLabels[user.role as RoleName] ?? user.role}).
      </p>
      <ul className="grid gap-4 sm:grid-cols-3">
        {sections.map((s) => (
          <li key={s.href}>
            <Link
              href={s.href}
              className="grid h-full gap-2 rounded-lg border p-5 transition-colors hover:border-primary hover:bg-accent/40"
            >
              <s.icon className="size-6 text-primary" aria-hidden />
              <span className="font-display text-lg font-semibold tracking-wide">{s.title}</span>
              <span className="text-sm text-muted-foreground">{s.text}</span>
            </Link>
          </li>
        ))}
      </ul>
      <section className="grid gap-3">
        <h2 className="font-medium">Ce que ton rôle autorise</h2>
        <ul className="divide-y rounded-lg border">
          {rights.map((row) => (
            <li key={row.label} className="flex items-center justify-between px-4 py-3 text-sm">
              <span>{row.label}</span>
              <span className={row.allowed ? "font-medium" : "text-muted-foreground"}>
                {row.allowed ? "Autorisé" : "Non autorisé"}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
