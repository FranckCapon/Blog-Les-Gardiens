import type { FieldErrors } from "@/lib/validation/content";

/** Résultat renvoyé par une Server Action de formulaire à useActionState. */
export type FormState = {
  message?: string;
  errors?: FieldErrors;
  /** Valeurs saisies, pour ne rien perdre quand la saisie est refusée. */
  values?: Record<string, string>;
  /** Compteur d'envois, posé côté client par AdminForm. */
  n?: number;
};

export const initialFormState: FormState = {};

export function formValues(formData: FormData) {
  const values: Record<string, string> = {};
  for (const [key, value] of formData) {
    if (typeof value === "string" && !key.startsWith("$")) values[key] = value;
  }
  return values;
}

/** Code PostgreSQL d'une erreur, y compris quand Drizzle l'enveloppe. */
export function pgCode(error: unknown): string | undefined {
  for (let e = error as { code?: unknown; cause?: unknown } | undefined; e; e = e.cause as never) {
    if (typeof e.code === "string") return e.code;
  }
  return undefined;
}

/** Les arguments liés d'une Server Action viennent du navigateur : on les revérifie. */
export function validId(value: unknown): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}
