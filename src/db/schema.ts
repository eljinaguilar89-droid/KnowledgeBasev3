import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").default("NEO").notNull(),
  apiKey: text("api_key"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  filterCategory: text("filter_category").notNull(),
  icon: text("icon").notNull(),
  count: text("count"),
  colorClass: text("color_class").notNull(),
  group: text("group").notNull(),
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
  badge: text("badge"),
  status: text("status").notNull(),
  accessLevel: text("access_level").default("Public").notNull(), // Public, Internal, Confidential, Restricted
  attachmentName: text("attachment_name"),
  attachmentData: text("attachment_data"),
  createdAt: timestamp("created_at").defaultNow(),
});
