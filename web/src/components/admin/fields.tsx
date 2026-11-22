import type { ReactNode } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const controlClass =
  "w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] md:text-sm dark:bg-input/30 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20";

type BaseProps = {
  name: string;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
};

function FieldShell({
  name,
  label,
  error,
  hint,
  className,
  children,
}: BaseProps & { children: ReactNode }) {
  return (
    <div className={cn("grid content-start gap-2", className)}>
      <label htmlFor={name} className="text-sm leading-none font-medium">
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${name}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${name}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const describedBy = (p: BaseProps) =>
  p.error ? `${p.name}-error` : p.hint ? `${p.name}-hint` : undefined;

export function TextField(
  props: BaseProps & {
    defaultValue?: string | number | null;
    type?: string;
    required?: boolean;
    min?: number;
    max?: number;
  },
) {
  const { name, error, defaultValue, type = "text", required, min, max } = props;
  return (
    <FieldShell {...props}>
      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        min={min}
        max={max}
        defaultValue={defaultValue ?? ""}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(props)}
      />
    </FieldShell>
  );
}

export function TextAreaField(
  props: BaseProps & { defaultValue?: string | null; rows?: number; required?: boolean },
) {
  const { name, error, defaultValue, rows = 8, required } = props;
  return (
    <FieldShell {...props}>
      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required}
        defaultValue={defaultValue ?? ""}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(props)}
        className={cn(controlClass, "leading-6")}
      />
    </FieldShell>
  );
}

export function SelectField(
  props: BaseProps & {
    defaultValue?: string | number | null;
    options: { id: number; name: string }[];
    placeholder: string;
  },
) {
  const { name, error, defaultValue, options, placeholder } = props;
  return (
    <FieldShell {...props}>
      <select
        id={name}
        name={name}
        required
        defaultValue={defaultValue == null ? "" : String(defaultValue)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(props)}
        className={cn(controlClass, "h-9 py-1")}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function CheckboxField({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="size-4 accent-primary"
      />
      {label}
    </label>
  );
}
