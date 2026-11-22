import { Users } from "lucide-react";
import Link from "next/link";

import { formatDateTime, formatDay, formatMonth } from "@/lib/format";
import { cn } from "@/lib/utils";

import { Badge } from "./badge";

export type EventItemData = {
  id: number;
  title: string;
  startsAt: Date;
  tag: string;
  participants: number;
};

/** Événement en ligne, avec un bloc date à gauche. */
export function EventItem({ event, past = false }: { event: EventItemData; past?: boolean }) {
  return (
    <article className="relative flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors hover:border-primary">
      <div
        className={cn(
          "grid w-16 shrink-0 place-items-center rounded-lg border py-2 text-center",
          past ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground",
        )}
      >
        <span className="font-display text-2xl leading-none font-semibold">
          {formatDay(event.startsAt)}
        </span>
        <span className="text-xs tracking-wide uppercase">{formatMonth(event.startsAt)}</span>
      </div>
      <div className="grid min-w-0 gap-1">
        <h3 className="font-semibold">
          <Link href={`/evenements/${event.id}`} className="after:absolute after:inset-0">
            {event.title}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground first-letter:uppercase">
          <time dateTime={event.startsAt.toISOString()}>{formatDateTime(event.startsAt)}</time>
        </p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <Badge>{event.tag}</Badge>
          <span className="inline-flex items-center gap-1">
            <Users className="size-3.5" aria-hidden />
            {event.participants} inscrit{event.participants > 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </article>
  );
}
