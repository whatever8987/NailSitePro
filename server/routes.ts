import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Stripe from "stripe";
import session from "express-session";
import { z } from "zod";
import { insertSalonSchema, insertUserSchema } from "@shared/schema";
import MemoryStore from "memorystore";
import bcrypt from "bcryptjs";

// Declare session types
declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing Stripe secret key. Stripe integration will not work properly.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy", {
  apiVersion: "2023-10-16",
});

// Create memory store for sessions
const SessionStore = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session middleware
  app.use(
    session({
      cookie: { maxAge: 86400000 }, // 24 hours
      store: new SessionStore({
        checkPeriod: 86400000, // 24 hours
      }),
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "salon-site-secret",
    })
  );

  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  const requireAdmin = async (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    next();
  };

  // Authentication endpoints
  app.post("/api/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create the user with hashed password
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating user" });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Compare password with hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Set user session
      req.session.userId = user.id;
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  // User endpoints
  app.get("/api/user/me", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user" });
    }
  });

  app.patch("/api/user/profile", requireAuth, async (req, res) => {
    try {
      const { password, ...updateData } = req.body;
      
      // Don't allow changing the role through this endpoint
      if (updateData.role) {
        delete updateData.role;
      }
      
      const updatedUser = await storage.updateUser(req.session.userId, updateData);
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = updatedUser;
      
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error updating profile" });
    }
  });

  app.post("/api/user/change-password", requireAuth, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current and new passwords are required" });
      }
      
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify current password
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Update the password
      await storage.updateUser(req.session.userId, { password: hashedPassword });
      
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error changing password" });
    }
  });

  app.get("/api/user/salon", requireAuth, async (req, res) => {
    try {
      const salon = await storage.getSalonByOwner(req.session.userId);
      if (!salon) {
        return res.status(404).json({ message: "No salon found for this user" });
      }
      
      res.status(200).json(salon);
    } catch (error) {
      res.status(500).json({ message: "Error fetching salon" });
    }
  });

  // Salon endpoints
  app.get("/api/salons", async (req, res) => {
    try {
      const salons = await storage.getSalons();
      res.status(200).json(salons);
    } catch (error) {
      res.status(500).json({ message: "Error fetching salons" });
    }
  });

  app.get("/api/salons/:id", async (req, res) => {
    try {
      const salonId = parseInt(req.params.id);
      const salon = await storage.getSalon(salonId);
      
      if (!salon) {
        return res.status(404).json({ message: "Salon not found" });
      }
      
      res.status(200).json(salon);
    } catch (error) {
      res.status(500).json({ message: "Error fetching salon" });
    }
  });

  app.get("/api/salons/sample/:sampleUrl", async (req, res) => {
    try {
      const salon = await storage.getSalonBySampleUrl(req.params.sampleUrl);
      
      if (!salon) {
        return res.status(404).json({ message: "Sample salon not found" });
      }
      
      res.status(200).json(salon);
    } catch (error) {
      res.status(500).json({ message: "Error fetching sample salon" });
    }
  });

  app.post("/api/salons", requireAdmin, async (req, res) => {
    try {
      const salonData = insertSalonSchema.parse(req.body);
      
      // Generate sample URL if not provided
      if (!salonData.sampleUrl) {
        const nameSlug = salonData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const locationSlug = salonData.location.split(',')[0].toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
        salonData.sampleUrl = `${nameSlug}-${locationSlug}`;
      }
      
      const salon = await storage.createSalon(salonData);
      
      // Update stats
      const stats = await storage.getStats();
      await storage.updateStats({
        totalSalons: stats.totalSalons + 1,
        sampleSites: stats.sampleSites + 1,
        pendingContacts: stats.pendingContacts + 1
      });
      
      res.status(201).json(salon);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating salon" });
    }
  });

  app.patch("/api/salons/:id", requireAuth, async (req, res) => {
    try {
      const salonId = parseInt(req.params.id);
      const salon = await storage.getSalon(salonId);
      
      // Check if salon exists
      if (!salon) {
        return res.status(404).json({ message: "Salon not found" });
      }
      
      // Check if user owns the salon or is an admin
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      
      if (salon.ownerId !== user.id && user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to update this salon" });
      }
      
      // Update the salon
      const updatedSalon = await storage.updateSalon(salonId, req.body);
      
      res.status(200).json(updatedSalon);
    } catch (error) {
      res.status(500).json({ message: "Error updating salon" });
    }
  });

  app.post("/api/salons/:id/claim", requireAuth, async (req, res) => {
    try {
      const salonId = parseInt(req.params.id);
      const salon = await storage.getSalon(salonId);
      
      // Check if salon exists
      if (!salon) {
        return res.status(404).json({ message: "Salon not found" });
      }
      
      // Check if salon is already claimed
      if (salon.claimed) {
        return res.status(400).json({ message: "Salon is already claimed" });
      }
      
      // Claim the salon
      const updatedSalon = await storage.claimSalon(salonId, req.session.userId);
      
      res.status(200).json(updatedSalon);
    } catch (error) {
      res.status(500).json({ message: "Error claiming salon" });
    }
  });

  app.post("/api/contact-leads", requireAdmin, async (req, res) => {
    try {
      const { leadIds } = req.body;
      
      if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
        return res.status(400).json({ message: "Lead IDs are required" });
      }
      
      // Update contact status for each lead
      for (const leadId of leadIds) {
        const salon = await storage.getSalon(leadId);
        if (salon) {
          await storage.updateSalon(leadId, { contactStatus: "contacted" });
        }
      }
      
      // Update stats
      const stats = await storage.getStats();
      const salons = await storage.getSalons();
      const pendingContacts = salons.filter(s => s.contactStatus === "notContacted").length;
      
      await storage.updateStats({
        pendingContacts
      });
      
      res.status(200).json({ message: "Leads contacted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error contacting leads" });
    }
  });

  // Template endpoints
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getTemplates();
      res.status(200).json(templates);
    } catch (error) {
      res.status(500).json({ message: "Error fetching templates" });
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const templateId = parseInt(req.params.id);
      const template = await storage.getTemplate(templateId);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      res.status(200).json(template);
    } catch (error) {
      res.status(500).json({ message: "Error fetching template" });
    }
  });
  
  app.get("/api/templates/:id/preview", async (req, res) => {
    try {
      const templateId = parseInt(req.params.id);
      const template = await storage.getTemplate(templateId);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      // Create a sample salon with the template for preview
      const sampleSalon = {
        id: 999,
        name: "Sample Salon",
        address: "123 Main Street",
        location: "Sample City",
        email: "contact@samplesalon.com",
        phoneNumber: "(555) 123-4567",
        description: "This is a preview of your salon website using the " + template.name + " template.",
        services: [
          "Classic Manicure - $35",
          "Gel Pedicure - $45",
          "Nail Extensions - $60",
          "Nail Art - $20"
        ],
        openingHours: "Monday - Friday: 9:00 AM - 7:00 PM\nSaturday: 9:00 AM - 6:00 PM\nSunday: Closed",
        sampleUrl: `sample-salon-${template.id}`,
        ownerId: null,
        templateId: template.id,
        claimed: false,
        claimedAt: null,
        contactStatus: "notContacted"
      };
      
      res.status(200).json(sampleSalon);
    } catch (error) {
      res.status(500).json({ message: "Error generating template preview" });
    }
  });

  // Subscription plan endpoints
  app.get("/api/subscription-plans", async (req, res) => {
    try {
      const plans = await storage.getSubscriptionPlans();
      res.status(200).json(plans);
    } catch (error) {
      res.status(500).json({ message: "Error fetching subscription plans" });
    }
  });

  app.get("/api/subscription-plans/:id", async (req, res) => {
    try {
      const planId = parseInt(req.params.id);
      const plan = await storage.getSubscriptionPlan(planId);
      
      if (!plan) {
        return res.status(404).json({ message: "Subscription plan not found" });
      }
      
      res.status(200).json(plan);
    } catch (error) {
      res.status(500).json({ message: "Error fetching subscription plan" });
    }
  });

  // Stats endpoints
  app.get("/api/stats", requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.status(200).json(stats);
    } catch (error) {
      res.status(500).json({ message: "Error fetching stats" });
    }
  });

  // Stripe payment endpoints
  app.post("/api/create-payment-intent", requireAuth, async (req, res) => {
    try {
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ message: "Stripe is not configured" });
      }

      const { amount, description = "Payment for services" } = req.body;
      
      if (!amount || typeof amount !== 'number') {
        return res.status(400).json({ message: "Valid amount is required" });
      }
      
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Create or get stripe customer
      let customerId = user.stripeCustomerId;
      
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.username,
          metadata: {
            userId: user.id.toString(),
          },
        });
        
        customerId = customer.id;
        await storage.updateStripeCustomerId(user.id, customerId);
      }
      
      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        customer: customerId,
        description,
        metadata: {
          userId: user.id.toString(),
        }
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Stripe subscription endpoints
  app.post("/api/create-subscription", requireAuth, async (req, res) => {
    try {
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({ message: "Stripe is not configured" });
      }

      const { planId } = req.body;
      
      if (!planId) {
        return res.status(400).json({ message: "Plan ID is required" });
      }
      
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const plan = await storage.getSubscriptionPlan(planId);
      if (!plan) {
        return res.status(404).json({ message: "Subscription plan not found" });
      }
      
      // Check if user already has an active subscription
      if (user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        
        // Only return clientSecret if payment is needed
        if (subscription.status === 'active') {
          return res.status(400).json({ message: "User already has an active subscription" });
        }

        return res.json({
          subscriptionId: subscription.id,
          clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
        });
      }
      
      // Create or get stripe customer
      let customerId = user.stripeCustomerId;
      
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.username,
          metadata: {
            userId: user.id.toString(),
          },
        });
        
        customerId = customer.id;
        await storage.updateStripeCustomerId(user.id, customerId);
      }
      
      // Create subscription with trial period
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: plan.stripePriceId || 'price_placeholder', // Placeholder for development
          },
        ],
        payment_behavior: 'default_incomplete',
        trial_period_days: plan.trialDays || 14,
        expand: ['latest_invoice.payment_intent'],
      });
      
      // Update user with subscription ID
      await storage.updateUserStripeInfo(user.id, {
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
      });
      
      // Update stats
      const stats = await storage.getStats();
      await storage.updateStats({
        activeSubscriptions: stats.activeSubscriptions + 1,
      });
      
      // Return client secret for frontend payment confirmation
      return res.json({
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
      });
    } catch (error: any) {
      console.error('Error creating subscription:', error);
      return res.status(500).json({ 
        message: "Failed to create subscription", 
        error: error.message 
      });
    }
  });

  // Webhook for Stripe events
  app.post("/api/webhook", async (req, res) => {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ message: "Stripe is not configured" });
    }
    
    const sig = req.headers['stripe-signature'] as string;
    
    if (!sig) {
      return res.status(400).json({ message: "Stripe signature missing" });
    }
    
    let event;
    
    // Verify webhook signature and extract the event
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder'
      );
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
        const subscriptionCreated = event.data.object;
        // Handle subscription created
        break;
      case 'customer.subscription.updated':
        const subscriptionUpdated = event.data.object;
        // Handle subscription update
        break;
      case 'customer.subscription.deleted':
        const subscriptionDeleted = event.data.object;
        // Handle subscription deletion
        break;
      case 'invoice.payment_succeeded':
        const invoiceSucceeded = event.data.object;
        // Handle successful payment
        break;
      case 'invoice.payment_failed':
        const invoiceFailed = event.data.object;
        // Handle failed payment
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    // Return a 200 response
    res.json({ received: true });
  });

  const httpServer = createServer(app);
  return httpServer;
}
