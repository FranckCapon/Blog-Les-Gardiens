import { describe, expect, it } from "vitest";

import { formatDuration, formatPlayers } from "@/lib/format";
import { slugify } from "@/lib/slug";

describe("slugify", () => {
  it("retire accents, apostrophes et ponctuation", () => {
    expect(slugify("Rentrée des Gardiens 2020/2021")).toBe("rentree-des-gardiens-2020-2021");
    expect(slugify("Réouverture de l’activité")).toBe("reouverture-de-lactivite");
    expect(slugify("CORONAVIRUS : Fermeture du club (et de la MJC)")).toBe(
      "coronavirus-fermeture-du-club-et-de-la-mjc",
    );
  });

  it("limite la longueur sans laisser de tiret final", () => {
    const slug = slugify("a ".repeat(100));
    expect(slug.length).toBeLessThanOrEqual(80);
    expect(slug.endsWith("-")).toBe(false);
  });
});

describe("formatPlayers", () => {
  it("gère les fourchettes, les nombres fixes et l'absence de maximum", () => {
    expect(formatPlayers(2, 4)).toBe("2 à 4 joueurs");
    expect(formatPlayers(2, 2)).toBe("2 joueurs");
    expect(formatPlayers(1, 1)).toBe("1 joueur");
    expect(formatPlayers(3, null)).toBe("3 joueurs et +");
  });
});

describe("formatDuration", () => {
  it("affiche minutes et heures", () => {
    expect(formatDuration(null)).toBeNull();
    expect(formatDuration(45)).toBe("45 min");
    expect(formatDuration(60)).toBe("1 h");
    expect(formatDuration(90)).toBe("1 h 30");
  });
});
