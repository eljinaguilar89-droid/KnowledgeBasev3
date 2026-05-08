import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";

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
  createdAt: timestamp("created_at").defaultNow(),
});
