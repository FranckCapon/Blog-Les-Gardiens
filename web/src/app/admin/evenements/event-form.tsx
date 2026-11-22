"use client";

import { SelectField, TextAreaField, TextField } from "@/components/admin/fields";
import { AdminForm, type FormAction } from "@/components/admin/form-shell";

type Option = { id: number; name: string };
type Defaults = { title?: string; description?: string; startsAt?: string; tagId?: number };

export function EventForm({
  action,
  tags,
  defaults = {},
  submitLabel,
}: {
  action: FormAction;
  tags: Option[];
  defaults?: Defaults;
  submitLabel: string;
}) {
  return (
    <AdminForm action={action} submitLabel={submitLabel}>
      {({ errors = {}, values }) => (
        <>
          <TextField
            name="title"
            label="Titre"
            required
            defaultValue={values?.title ?? defaults.title}
            error={errors.title}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              name="startsAt"
              label="Date et heure"
              type="datetime-local"
              required
              hint="Heure de Paris."
              defaultValue={values?.startsAt ?? defaults.startsAt}
              error={errors.startsAt}
            />
            <SelectField
              name="tagId"
              label="Type d'événement"
              placeholder="Choisir un type"
              options={tags}
              defaultValue={values?.tagId ?? defaults.tagId}
              error={errors.tagId}
            />
          </div>
          <TextAreaField
            name="description"
            label="Description"
            rows={8}
            required
            defaultValue={values?.description ?? defaults.description}
            error={errors.description}
          />
        </>
      )}
    </AdminForm>
  );
}
