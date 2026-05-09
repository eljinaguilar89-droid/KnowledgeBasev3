import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").default("Viewer").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const articles = pgTable("articles", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content"),
  author: text("author").notNull(),
  date: text("date").notNull(),
  views: integer("views").default(0),
  category: text("category").notNull(),
  categoryColor: text("category_color").notNull(),
  categoryIcon: text("category_icon"),
  version: text("version"),
  badge: text("badge"),
  status: text("status").notNull(),
  accessLevel: text("access_level").default("Public").notNull(), // Public, Internal, Confidential, Restricted
  createdAt: timestamp("created_at").defaultNow(),
});
