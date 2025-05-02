import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model for admin and salon owners
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role", { enum: ["admin", "salonOwner"] }).notNull().default("salonOwner"),
  phoneNumber: text("phone_number"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  stripeCustomerId: true,
  stripeSubscriptionId: true,
});

// Salon model for business information
export const salons = pgTable("salons", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  address: text("address").notNull(),
  phoneNumber: text("phone_number"),
  email: text("email"),
  ownerId: integer("owner_id").references(() => users.id),
  services: text("services").array(),
  claimed: boolean("claimed").default(false),
  claimedAt: timestamp("claimed_at"),
  contactStatus: text("contact_status", { enum: ["notContacted", "contacted", "interested", "subscribed"] }).default("notContacted"),
  sampleUrl: text("sample_url").notNull(),
  templateId: integer("template_id").references(() => templates.id),
  description: text("description"),
  openingHours: text("opening_hours"),
});

export const insertSalonSchema = createInsertSchema(salons).omit({
  id: true,
  claimed: true,
  claimedAt: true,
  ownerId: true,
});

// Template model for website designs
export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  previewImageUrl: text("preview_image_url").notNull(),
  features: text("features").array(),
  isMobileOptimized: boolean("is_mobile_optimized").default(true),
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
});

// Subscription model for pricing plans
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  features: text("features").array(),
  stripePriceId: text("stripe_price_id"),
  trialDays: integer("trial_days").default(14),
  isPopular: boolean("is_popular").default(false),
});

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({
  id: true,
});

// Stats for dashboard
export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  totalSalons: integer("total_salons").default(0),
  sampleSites: integer("sample_sites").default(0),
  activeSubscriptions: integer("active_subscriptions").default(0),
  pendingContacts: integer("pending_contacts").default(0),
});

// Blog category enum
export const blogCategoryEnum = pgEnum("blog_category", [
  "salon_tips",
  "nail_art",
  "business_advice",
  "industry_trends",
  "tutorials",
  "marketing",
  "customer_service",
  "other",
]);

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  coverImage: text("cover_image"),
  authorId: integer("author_id").references(() => users.id).notNull(),
  category: text("category", { 
    enum: ["salon_tips", "nail_art", "business_advice", "industry_trends", "tutorials", "marketing", "customer_service", "other"]
  }).default("other").notNull(),
  tags: text("tags").array(),
  published: boolean("published").default(false).notNull(),
  featured: boolean("featured").default(false).notNull(),
  viewCount: integer("view_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
}).extend({
  tags: z.string().optional(),
});

// Blog comments table
export const blogComments = pgTable("blog_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => blogPosts.id).notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  content: text("content").notNull(),
  approved: boolean("approved").default(false).notNull(),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBlogCommentSchema = createInsertSchema(blogComments).omit({
  id: true,
  approved: true,
  createdAt: true,
});

// Types export
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Salon = typeof salons.$inferSelect;
export type InsertSalon = z.infer<typeof insertSalonSchema>;

export type Template = typeof templates.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;

export type Stats = typeof stats.$inferSelect;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type BlogComment = typeof blogComments.$inferSelect;
export type InsertBlogComment = z.infer<typeof insertBlogCommentSchema>;
