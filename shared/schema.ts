import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
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
