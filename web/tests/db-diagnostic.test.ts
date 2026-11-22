import { describe, expect, it } from "vitest";

import { causeMessage, explainDbError, rootCause } from "@/lib/db/diagnostic";

const wrapped = (cause: object) => Object.assign(new Error("Failed query: select 1"), { cause });

describe("diagnostic des erreurs de base", () => {
  it("retrouve la cause sous l'erreur Drizzle", () => {
    expect(
      rootCause(wrapped({ code: "42P01", message: 'relation "event" does not exist' })),
    ).toMatchObject({
      code: "42P01",
    });
  });

  it("explique une base arrêtée", () => {
    expect(explainDbError(wrapped({ code: "ECONNREFUSED" }))).toMatch(/npm run db:up/);
  });

  it("reconnaît une base arrêtée même ré-emballée par le cache (AggregateError sans code)", () => {
    const aggregate = Object.assign(
      new Error("An error occurred in the Server Components render but no message was provided"),
      {
        errors: [
          new Error("connect ECONNREFUSED ::1:5432"),
          new Error("connect ECONNREFUSED 127.0.0.1:5432"),
        ],
      },
    );
    const error = wrapped(aggregate);
    expect(explainDbError(error)).toMatch(/npm run db:up/);
    expect(causeMessage(error)).toBe("connect ECONNREFUSED 127.0.0.1:5432");
  });

  it("reconnaît une table absente par son message", () => {
    expect(explainDbError(wrapped(new Error('relation "event" does not exist')))).toMatch(
      /db:migrate/,
    );
  });

  it("explique des migrations manquantes", () => {
    expect(explainDbError(wrapped({ code: "42P01" }))).toMatch(/npm run db:migrate/);
    expect(explainDbError(wrapped({ code: "42703" }))).toMatch(/npm run db:migrate/);
  });

  it("ignore les autres erreurs", () => {
    expect(explainDbError(new Error("autre"))).toBeNull();
    expect(explainDbError(wrapped({ code: "23505" }))).toBeNull();
  });
});
