CREATE TABLE "articles" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" text,
	"author" text NOT NULL,
	"date" text NOT NULL,
	"views" integer DEFAULT 0,
	"category" text NOT NULL,
	"category_color" text NOT NULL,
	"category_icon" text,
	"badge" text,
	"status" text NOT NULL,
	"access_level" text DEFAULT 'Public' NOT NULL,
	"attachment_name" text,
	"attachment_data" text,
	"attachments" json,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"filter_category" text NOT NULL,
	"icon" text NOT NULL,
	"count" text,
	"color_class" text NOT NULL,
	"group" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"level" text NOT NULL,
	"message" text NOT NULL,
	"date" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"name" text NOT NULL,
	"role" text DEFAULT 'NEO' NOT NULL,
	"api_key" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
