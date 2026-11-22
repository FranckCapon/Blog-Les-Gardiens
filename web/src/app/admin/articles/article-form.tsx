"use client";

import { SelectField, TextAreaField, TextField } from "@/components/admin/fields";
import { AdminForm, type FormAction } from "@/components/admin/form-shell";

type Option = { id: number; name: string };
type Defaults = { title?: string; content?: string; tagId?: number };

export function ArticleForm({
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
          <SelectField
            name="tagId"
            label="Catégorie"
            placeholder="Choisir une catégorie"
            options={tags}
            defaultValue={values?.tagId ?? defaults.tagId}
            error={errors.tagId}
          />
          <TextAreaField
            name="content"
            label="Contenu"
            rows={16}
            required
            hint="Laisse une ligne vide entre deux paragraphes."
            defaultValue={values?.content ?? defaults.content}
            error={errors.content}
          />
        </>
      )}
    </AdminForm>
  );
}
