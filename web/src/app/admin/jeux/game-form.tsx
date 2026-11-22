"use client";

import { CheckboxField, SelectField, TextAreaField, TextField } from "@/components/admin/fields";
import { AdminForm, type FormAction } from "@/components/admin/form-shell";

type Option = { id: number; name: string };
export type GameDefaults = {
  title?: string;
  description?: string | null;
  minPlayers?: number;
  maxPlayers?: number | null;
  minAge?: number | null;
  durationMinutes?: number | null;
  quantity?: number;
  year?: number | null;
  author?: string | null;
  publisher?: string | null;
  isExpansion?: boolean;
  typeId?: number;
};

export function GameForm({
  action,
  types,
  defaults = {},
  submitLabel,
}: {
  action: FormAction;
  types: Option[];
  defaults?: GameDefaults;
  submitLabel: string;
}) {
  return (
    <AdminForm action={action} submitLabel={submitLabel}>
      {({ errors = {}, values }) => {
        const v = (key: keyof GameDefaults) =>
          values ? values[key] : (defaults[key] as string | number | null | undefined);
        return (
          <>
            <TextField
              name="title"
              label="Titre"
              required
              defaultValue={v("title")}
              error={errors.title}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField
                name="typeId"
                label="Type de jeu"
                placeholder="Choisir un type"
                options={types}
                defaultValue={v("typeId")}
                error={errors.typeId}
              />
              <TextField
                name="quantity"
                label="Exemplaires au club"
                type="number"
                min={1}
                required
                defaultValue={v("quantity") ?? 1}
                error={errors.quantity}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-4">
              <TextField
                name="minPlayers"
                label="Joueurs min."
                type="number"
                min={1}
                required
                defaultValue={v("minPlayers")}
                error={errors.minPlayers}
              />
              <TextField
                name="maxPlayers"
                label="Joueurs max."
                type="number"
                min={1}
                defaultValue={v("maxPlayers")}
                error={errors.maxPlayers}
              />
              <TextField
                name="minAge"
                label="Âge min."
                type="number"
                min={1}
                defaultValue={v("minAge")}
                error={errors.minAge}
              />
              <TextField
                name="durationMinutes"
                label="Durée (min)"
                type="number"
                min={1}
                defaultValue={v("durationMinutes")}
                error={errors.durationMinutes}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <TextField
                name="author"
                label="Auteur"
                defaultValue={v("author")}
                error={errors.author}
              />
              <TextField
                name="publisher"
                label="Éditeur"
                defaultValue={v("publisher")}
                error={errors.publisher}
              />
              <TextField
                name="year"
                label="Année"
                type="number"
                defaultValue={v("year")}
                error={errors.year}
              />
            </div>
            <CheckboxField
              name="isExpansion"
              label="C'est une extension"
              defaultChecked={values ? values.isExpansion === "on" : defaults.isExpansion}
            />
            <TextAreaField
              name="description"
              label="Description"
              rows={6}
              hint="Facultative, 15 caractères minimum si elle est remplie."
              defaultValue={v("description") as string | undefined}
              error={errors.description}
            />
          </>
        );
      }}
    </AdminForm>
  );
}
