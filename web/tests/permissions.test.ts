import { describe, expect, it } from "vitest";

import { roleCan } from "@/lib/auth/permissions";

describe("roleCan", () => {
  it("refuse tout sans rôle ou avec un rôle inconnu", () => {
    expect(roleCan(undefined, { article: ["create"] })).toBe(false);
    expect(roleCan("", { article: ["create"] })).toBe(false);
    expect(roleCan("superadmin", { article: ["create"] })).toBe(false);
  });

  it("ne donne aucun droit d'écriture au membre", () => {
    expect(roleCan("membre", { article: ["create"] })).toBe(false);
    expect(roleCan("membre", { event: ["create"] })).toBe(false);
    expect(roleCan("membre", { game: ["create"] })).toBe(false);
    expect(roleCan("membre", { user: ["list"] })).toBe(false);
  });

  it("laisse le modérateur rédiger et organiser, sans supprimer ni gérer les membres", () => {
    expect(roleCan("moderateur", { article: ["create", "update"] })).toBe(true);
    expect(roleCan("moderateur", { event: ["create", "update"] })).toBe(true);
    expect(roleCan("moderateur", { article: ["delete"] })).toBe(false);
    expect(roleCan("moderateur", { game: ["create"] })).toBe(false);
    expect(roleCan("moderateur", { user: ["list"] })).toBe(false);
    expect(roleCan("moderateur", { user: ["set-role"] })).toBe(false);
  });

  it("donne tous les droits à l'administrateur", () => {
    expect(roleCan("admin", { article: ["create", "update", "delete"] })).toBe(true);
    expect(roleCan("admin", { game: ["create", "update", "delete"] })).toBe(true);
    expect(roleCan("admin", { user: ["list", "set-role", "ban"] })).toBe(true);
  });

  it("accepte plusieurs rôles séparés par des virgules", () => {
    expect(roleCan("membre, moderateur", { article: ["create"] })).toBe(true);
  });
});
