import { describe, expect, it } from "vitest";

import { fromParisInput, toParisInput } from "@/lib/format";
import { articleInput, eventInput, fieldErrors, gameInput } from "@/lib/validation/content";

describe("heure de Paris", () => {
  it("convertit l'heure d'hiver et l'heure d'été", () => {
    expect(fromParisInput("2026-12-05T20:30")?.toISOString()).toBe("2026-12-05T19:30:00.000Z");
    expect(fromParisInput("2026-07-14T20:30")?.toISOString()).toBe("2026-07-14T18:30:00.000Z");
  });

  it("fait l'aller-retour avec toParisInput", () => {
    const d = new Date("2027-03-28T08:15:00Z"); // jour du passage à l'heure d'été
    expect(fromParisInput(toParisInput(d))?.getTime()).toBe(d.getTime());
  });

  it("refuse une saisie invalide ou une heure qui n'existe pas", () => {
    expect(fromParisInput("")).toBeNull();
    expect(fromParisInput("2026-02-30T10:00")).toBeNull();
    expect(fromParisInput("2027-03-28T02:30")).toBeNull();
  });
});

describe("saisie d'un article", () => {
  it("accepte un article complet et nettoie les espaces", () => {
    const r = articleInput.parse({ title: "  Soirée Dixit ", content: "x".repeat(20), tagId: "2" });
    expect(r).toEqual({ title: "Soirée Dixit", content: "x".repeat(20), tagId: 2 });
  });

  it("renvoie un message par champ", () => {
    const r = articleInput.safeParse({ title: "a", content: "court", tagId: "" });
    expect(r.success).toBe(false);
    const errors = fieldErrors(r.error!);
    expect(Object.keys(errors).sort()).toEqual(["content", "tagId", "title"]);
  });
});

describe("saisie d'un événement", () => {
  it("convertit la date saisie", () => {
    const r = eventInput.parse({
      title: "Tournoi",
      description: "Un tournoi convivial pour tous.",
      startsAt: "2026-12-05T20:30",
      tagId: "1",
    });
    expect(r.startsAt.toISOString()).toBe("2026-12-05T19:30:00.000Z");
  });

  it("refuse une date vide", () => {
    const r = eventInput.safeParse({
      title: "Tournoi",
      description: "x".repeat(20),
      startsAt: "",
      tagId: "1",
    });
    expect(r.success).toBe(false);
    expect(fieldErrors(r.error!).startsAt).toMatch(/date/);
  });
});

describe("saisie d'un jeu", () => {
  const base = { title: "Azul", minPlayers: "2", quantity: "1", typeId: "1" };

  it("transforme les cases vides en null et la case à cocher en booléen", () => {
    const r = gameInput.parse({ ...base, maxPlayers: "", description: "  ", isExpansion: "on" });
    expect(r).toMatchObject({
      maxPlayers: null,
      description: null,
      author: null,
      isExpansion: true,
    });
  });

  it("vérifie que le maximum de joueurs dépasse le minimum", () => {
    const r = gameInput.safeParse({ ...base, minPlayers: "4", maxPlayers: "2" });
    expect(r.success).toBe(false);
    expect(fieldErrors(r.error!).maxPlayers).toBeDefined();
  });

  it("reprend les contraintes de la base", () => {
    expect(gameInput.safeParse({ ...base, durationMinutes: "-1" }).success).toBe(false);
    expect(gameInput.safeParse({ ...base, description: "trop court" }).success).toBe(false);
    expect(gameInput.safeParse({ ...base, year: "1999" }).success).toBe(true);
  });
});
