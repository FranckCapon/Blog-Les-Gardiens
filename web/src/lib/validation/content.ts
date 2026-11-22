// Règles de saisie des écrans d'administration. Elles reprennent les contraintes
// CHECK de la base pour renvoyer un message clair avant même d'écrire.
import { z } from "zod";

import { fromParisInput } from "@/lib/format";

const text = (label: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min, `${label} : au moins ${min} caractères.`)
    .max(max, `${label} : ${max} caractères maximum.`);

const id = (message: string) => z.coerce.number({ error: message }).int(message).positive(message);

/** Case laissée vide (ou absente) → null. */
const emptyToNull = (v: unknown) =>
  v == null || (typeof v === "string" && v.trim() === "") ? null : v;

/** Champ numérique facultatif : une case vide donne `null`. */
const optionalInt = (label: string, min: number, max: number) =>
  z.preprocess(
    emptyToNull,
    z.coerce
      .number({ error: `${label} : nombre attendu.` })
      .int(`${label} : nombre entier attendu.`)
      .min(min, `${label} : ${min} minimum.`)
      .max(max, `${label} : ${max} maximum.`)
      .nullable(),
  );

const optionalText = (label: string, max: number) =>
  z.preprocess(emptyToNull, text(label, 1, max).nullable());

export const articleInput = z.object({
  title: text("Titre", 3, 150),
  content: text("Contenu", 15, 50_000),
  tagId: id("Choisis une catégorie."),
});

export const eventInput = z.object({
  title: text("Titre", 3, 150),
  description: text("Description", 15, 10_000),
  startsAt: z.string().transform((v, ctx) => {
    const date = fromParisInput(v);
    if (!date) {
      ctx.addIssue({ code: "custom", message: "Indique une date et une heure valides." });
      return z.NEVER;
    }
    return date;
  }),
  tagId: id("Choisis un type d'événement."),
});

export const gameInput = z
  .object({
    title: text("Titre", 1, 200),
    description: z.preprocess(emptyToNull, text("Description", 15, 10_000).nullable()),
    minPlayers: z.coerce
      .number({ error: "Joueurs minimum : nombre attendu." })
      .int("Joueurs minimum : nombre entier attendu.")
      .min(1, "Il faut au moins 1 joueur.")
      .max(100, "Joueurs minimum : 100 maximum."),
    maxPlayers: optionalInt("Joueurs maximum", 1, 100),
    minAge: optionalInt("Âge minimum", 1, 99),
    durationMinutes: optionalInt("Durée", 1, 6000),
    quantity: z.coerce
      .number({ error: "Exemplaires : nombre attendu." })
      .int("Exemplaires : nombre entier attendu.")
      .min(1, "Au moins 1 exemplaire.")
      .max(50, "Exemplaires : 50 maximum."),
    year: optionalInt("Année", 1101, 2099),
    author: optionalText("Auteur", 200),
    publisher: optionalText("Éditeur", 200),
    isExpansion: z.preprocess((v) => v === "on" || v === true, z.boolean()),
    typeId: id("Choisis un type de jeu."),
  })
  .refine((g) => g.maxPlayers == null || g.maxPlayers >= g.minPlayers, {
    path: ["maxPlayers"],
    message: "Le maximum doit être supérieur ou égal au minimum.",
  });

export type FieldErrors = Partial<Record<string, string>>;

/** Premier message d'erreur de chaque champ, pour l'afficher sous la saisie. */
export function fieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}
