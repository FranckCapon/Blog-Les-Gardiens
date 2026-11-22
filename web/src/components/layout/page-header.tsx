import type { ReactNode } from "react";

/** Titre de page avec le bandeau médiéval de l'ancien site. */
export function PageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="relative isolate overflow-hidden border-b">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[url(/images/bandeau.jpg)] bg-cover bg-left opacity-90"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-black/55 via-black/35 to-black/20"
      />
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:py-16">
        <h1 className="font-display text-3xl font-semibold tracking-wide text-balance text-white drop-shadow-[0_2px_6px_rgb(0_0_0/0.6)] sm:text-4xl">
          {title}
        </h1>
        {children ? (
          <div className="mt-3 max-w-2xl text-base text-white/90 drop-shadow-[0_1px_4px_rgb(0_0_0/0.6)]">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Mise en forme des textes longs (titres, paragraphes, listes, liens). */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-3xl text-base leading-7 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-wide [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-semibold [&_li]:mt-1 [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
      {children}
    </div>
  );
}
