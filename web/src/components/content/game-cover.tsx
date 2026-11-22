import { Dices } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";

/** Visuel d'un jeu (image BoardGameGeek), ou une icône si le jeu n'en a pas. */
export function GameCover({
  src,
  alt,
  className,
  sizes,
  priority,
}: {
  src: string | null;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain p-2"
        />
      ) : (
        <div className="grid size-full place-items-center text-muted-foreground">
          <Dices className="size-10" aria-hidden />
        </div>
      )}
    </div>
  );
}
