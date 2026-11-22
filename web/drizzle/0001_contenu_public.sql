ALTER TABLE "game" DROP CONSTRAINT "game_description_length";--> statement-breakpoint
ALTER TABLE "game" DROP CONSTRAINT "game_min_age";--> statement-breakpoint
ALTER TABLE "game" DROP CONSTRAINT "game_duration";--> statement-breakpoint
ALTER TABLE "game" DROP CONSTRAINT "game_year";--> statement-breakpoint
ALTER TABLE "game" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "game" ALTER COLUMN "min_age" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "game" ALTER COLUMN "duration_minutes" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "game" ALTER COLUMN "purchased_on" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "game" ALTER COLUMN "purchased_on" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "game" ALTER COLUMN "author" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "game" ALTER COLUMN "publisher" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "game" ALTER COLUMN "year" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "article" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "game" ADD COLUMN "is_expansion" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "game" ADD COLUMN "bgg_id" integer;--> statement-breakpoint
ALTER TABLE "game" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "game" ADD COLUMN "thumbnail_url" text;--> statement-breakpoint
ALTER TABLE "article" ADD CONSTRAINT "article_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "game" ADD CONSTRAINT "game_bgg_id_unique" UNIQUE("bgg_id");--> statement-breakpoint
ALTER TABLE "game" ADD CONSTRAINT "game_description_length" CHECK ("game"."description" IS NULL OR char_length(trim("game"."description")) >= 15);--> statement-breakpoint
ALTER TABLE "game" ADD CONSTRAINT "game_min_age" CHECK ("game"."min_age" IS NULL OR "game"."min_age" > 0);--> statement-breakpoint
ALTER TABLE "game" ADD CONSTRAINT "game_duration" CHECK ("game"."duration_minutes" IS NULL OR "game"."duration_minutes" > 0);--> statement-breakpoint
ALTER TABLE "game" ADD CONSTRAINT "game_year" CHECK ("game"."year" IS NULL OR ("game"."year" > 1100 AND "game"."year" < 2100));