CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"pseudo" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" text DEFAULT 'membre' NOT NULL,
	"banned" boolean DEFAULT false NOT NULL,
	"ban_reason" text,
	"ban_expires" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_pseudo_unique" UNIQUE("pseudo"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "article_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"content" text NOT NULL,
	"author_id" text NOT NULL,
	"tag_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "article_title_unique" UNIQUE("title"),
	CONSTRAINT "article_content_length" CHECK (char_length(trim("article"."content")) >= 15),
	CONSTRAINT "article_dates" CHECK ("article"."updated_at" IS NULL OR "article"."updated_at" >= "article"."created_at")
);
--> statement-breakpoint
CREATE TABLE "article_tag" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "article_tag_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	CONSTRAINT "article_tag_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "event" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "event_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"description" text NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"creator_id" text NOT NULL,
	"tag_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "event_description_length" CHECK (char_length(trim("event"."description")) >= 15),
	CONSTRAINT "event_dates" CHECK ("event"."updated_at" IS NULL OR "event"."updated_at" >= "event"."created_at")
);
--> statement-breakpoint
CREATE TABLE "event_game" (
	"event_id" integer NOT NULL,
	"game_id" integer NOT NULL,
	CONSTRAINT "event_game_event_id_game_id_pk" PRIMARY KEY("event_id","game_id")
);
--> statement-breakpoint
CREATE TABLE "event_participant" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "event_participant_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"event_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"registered_at" timestamp with time zone DEFAULT now() NOT NULL,
	"cancelled_at" timestamp with time zone,
	CONSTRAINT "event_participant_unique" UNIQUE("event_id","user_id"),
	CONSTRAINT "event_participant_dates" CHECK ("event_participant"."cancelled_at" IS NULL OR "event_participant"."cancelled_at" >= "event_participant"."registered_at")
);
--> statement-breakpoint
CREATE TABLE "event_tag" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "event_tag_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	CONSTRAINT "event_tag_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "game" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "game_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"description" text NOT NULL,
	"min_players" integer NOT NULL,
	"max_players" integer,
	"min_age" integer NOT NULL,
	"duration_minutes" integer NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"purchased_on" date DEFAULT now() NOT NULL,
	"author" text NOT NULL,
	"publisher" text NOT NULL,
	"year" integer NOT NULL,
	"type_id" integer NOT NULL,
	CONSTRAINT "game_description_length" CHECK (char_length(trim("game"."description")) >= 15),
	CONSTRAINT "game_players" CHECK ("game"."min_players" > 0 AND ("game"."max_players" IS NULL OR "game"."max_players" >= "game"."min_players")),
	CONSTRAINT "game_min_age" CHECK ("game"."min_age" > 0),
	CONSTRAINT "game_duration" CHECK ("game"."duration_minutes" > 0),
	CONSTRAINT "game_quantity" CHECK ("game"."quantity" > 0),
	CONSTRAINT "game_year" CHECK ("game"."year" > 1100 AND "game"."year" < 2100)
);
--> statement-breakpoint
CREATE TABLE "game_tag" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "game_tag_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	CONSTRAINT "game_tag_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "game_to_tag" (
	"game_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	CONSTRAINT "game_to_tag_game_id_tag_id_pk" PRIMARY KEY("game_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "game_type" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "game_type_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	CONSTRAINT "game_type_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article" ADD CONSTRAINT "article_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article" ADD CONSTRAINT "article_tag_id_article_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."article_tag"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event" ADD CONSTRAINT "event_tag_id_event_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."event_tag"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_game" ADD CONSTRAINT "event_game_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_game" ADD CONSTRAINT "event_game_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_participant" ADD CONSTRAINT "event_participant_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_participant" ADD CONSTRAINT "event_participant_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game" ADD CONSTRAINT "game_type_id_game_type_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."game_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_to_tag" ADD CONSTRAINT "game_to_tag_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_to_tag" ADD CONSTRAINT "game_to_tag_tag_id_game_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."game_tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");