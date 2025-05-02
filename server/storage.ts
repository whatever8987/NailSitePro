import { 
  users, type User, type InsertUser, 
  salons, type Salon, type InsertSalon,
  templates, type Template, type InsertTemplate,
  subscriptionPlans, type SubscriptionPlan, type InsertSubscriptionPlan,
  stats, type Stats
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  updateStripeCustomerId(userId: number, stripeCustomerId: string): Promise<User>;
  updateUserStripeInfo(userId: number, stripeInfo: { stripeCustomerId: string, stripeSubscriptionId: string }): Promise<User>;
  
  // Salon operations
  getSalon(id: number): Promise<Salon | undefined>;
  getSalonBySampleUrl(sampleUrl: string): Promise<Salon | undefined>;
  getSalonByOwner(ownerId: number): Promise<Salon | undefined>;
  getSalons(): Promise<Salon[]>;
  createSalon(salon: InsertSalon): Promise<Salon>;
  updateSalon(id: number, updates: Partial<Salon>): Promise<Salon>;
  claimSalon(id: number, ownerId: number): Promise<Salon>;
  
  // Template operations
  getTemplate(id: number): Promise<Template | undefined>;
  getTemplates(): Promise<Template[]>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  
  // Subscription plan operations
  getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined>;
  getSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan>;
  
  // Stats operations
  getStats(): Promise<Stats>;
  updateStats(updates: Partial<Stats>): Promise<Stats>;
  
  // Initialization (create initial data)
  initialize(): Promise<void>;
}

// In-memory implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private salons: Map<number, Salon>;
  private templates: Map<number, Template>;
  private subscriptionPlans: Map<number, SubscriptionPlan>;
  private statsData: Stats;
  
  private userIdCounter: number;
  private salonIdCounter: number;
  private templateIdCounter: number;
  private subscriptionPlanIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.salons = new Map();
    this.templates = new Map();
    this.subscriptionPlans = new Map();
    
    this.userIdCounter = 1;
    this.salonIdCounter = 1;
    this.templateIdCounter = 1;
    this.subscriptionPlanIdCounter = 1;
    
    this.statsData = {
      id: 1,
      totalSalons: 0,
      sampleSites: 0,
      activeSubscriptions: 0,
      pendingContacts: 0
    };
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async updateStripeCustomerId(userId: number, stripeCustomerId: string): Promise<User> {
    return this.updateUser(userId, { stripeCustomerId });
  }
  
  async updateUserStripeInfo(userId: number, stripeInfo: { stripeCustomerId: string, stripeSubscriptionId: string }): Promise<User> {
    return this.updateUser(userId, { 
      stripeCustomerId: stripeInfo.stripeCustomerId,
      stripeSubscriptionId: stripeInfo.stripeSubscriptionId
    });
  }
  
  // Salon operations
  async getSalon(id: number): Promise<Salon | undefined> {
    return this.salons.get(id);
  }
  
  async getSalonBySampleUrl(sampleUrl: string): Promise<Salon | undefined> {
    return Array.from(this.salons.values()).find(
      (salon) => salon.sampleUrl === sampleUrl
    );
  }
  
  async getSalonByOwner(ownerId: number): Promise<Salon | undefined> {
    return Array.from(this.salons.values()).find(
      (salon) => salon.ownerId === ownerId
    );
  }
  
  async getSalons(): Promise<Salon[]> {
    return Array.from(this.salons.values());
  }
  
  async createSalon(insertSalon: InsertSalon): Promise<Salon> {
    const id = this.salonIdCounter++;
    const salon: Salon = { 
      ...insertSalon, 
      id, 
      claimed: false, 
      contactStatus: "notContacted" 
    };
    
    this.salons.set(id, salon);
    
    // Update stats
    this.statsData.totalSalons += 1;
    this.statsData.sampleSites += 1;
    this.statsData.pendingContacts += 1;
    
    return salon;
  }
  
  async updateSalon(id: number, updates: Partial<Salon>): Promise<Salon> {
    const salon = await this.getSalon(id);
    if (!salon) {
      throw new Error(`Salon with id ${id} not found`);
    }
    
    const updatedSalon = { ...salon, ...updates };
    this.salons.set(id, updatedSalon);
    return updatedSalon;
  }
  
  async claimSalon(id: number, ownerId: number): Promise<Salon> {
    const salon = await this.getSalon(id);
    if (!salon) {
      throw new Error(`Salon with id ${id} not found`);
    }
    
    const updatedSalon = { 
      ...salon, 
      ownerId, 
      claimed: true, 
      claimedAt: new Date() 
    };
    
    this.salons.set(id, updatedSalon);
    return updatedSalon;
  }
  
  // Template operations
  async getTemplate(id: number): Promise<Template | undefined> {
    return this.templates.get(id);
  }
  
  async getTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }
  
  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = this.templateIdCounter++;
    const template: Template = { ...insertTemplate, id };
    this.templates.set(id, template);
    return template;
  }
  
  // Subscription plan operations
  async getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined> {
    return this.subscriptionPlans.get(id);
  }
  
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return Array.from(this.subscriptionPlans.values());
  }
  
  async createSubscriptionPlan(insertPlan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const id = this.subscriptionPlanIdCounter++;
    const plan: SubscriptionPlan = { ...insertPlan, id };
    this.subscriptionPlans.set(id, plan);
    return plan;
  }
  
  // Stats operations
  async getStats(): Promise<Stats> {
    return this.statsData;
  }
  
  async updateStats(updates: Partial<Stats>): Promise<Stats> {
    this.statsData = { ...this.statsData, ...updates };
    return this.statsData;
  }
  
  // Initialize with sample data
  async initialize(): Promise<void> {
    // Create admin user
    if (!(await this.getUserByUsername("admin"))) {
      await this.createUser({
        username: "admin",
        password: "admin123", // In a real app, this would be hashed
        email: "admin@salonsite.com",
        role: "admin",
        phoneNumber: "555-123-4567"
      });
    }
    
    // Create templates
    if ((await this.getTemplates()).length === 0) {
      await this.createTemplate({
        name: "Elegant",
        description: "Light & Minimal design ideal for upscale salons.",
        previewImageUrl: "https://images.unsplash.com/photo-1600975324106-9076e4e7a08f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        features: ["Minimalist design", "Light color palette", "Elegant typography"],
        isMobileOptimized: true
      });
      
      await this.createTemplate({
        name: "Modern",
        description: "Bold & Contemporary design with accent colors.",
        previewImageUrl: "https://images.unsplash.com/photo-1610555356070-d0efb6505f81?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        features: ["Bold colors", "Contemporary layout", "Dynamic elements"],
        isMobileOptimized: true
      });
      
      await this.createTemplate({
        name: "Luxury",
        description: "Premium & Sophisticated design for high-end salons.",
        previewImageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        features: ["Premium aesthetic", "Rich color palette", "Sophisticated typography"],
        isMobileOptimized: true
      });
      
      await this.createTemplate({
        name: "Friendly",
        description: "Warm & Inviting design for a welcoming atmosphere.",
        previewImageUrl: "https://images.unsplash.com/photo-1607779097040-28d40d9b088a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        features: ["Warm colors", "Approachable layout", "Casual typography"],
        isMobileOptimized: true
      });
    }
    
    // Create subscription plans
    if ((await this.getSubscriptionPlans()).length === 0) {
      await this.createSubscriptionPlan({
        name: "Basic",
        price: 29,
        features: ["Custom subdomain", "Mobile-friendly design", "Basic content management", "Email support"],
        stripePriceId: "price_basic",
        trialDays: 14,
        isPopular: true
      });
      
      await this.createSubscriptionPlan({
        name: "Premium",
        price: 49,
        features: ["All Basic features", "Custom domain connection", "Online booking integration", "Priority support"],
        stripePriceId: "price_premium",
        trialDays: 14,
        isPopular: false
      });
      
      await this.createSubscriptionPlan({
        name: "Luxury",
        price: 99,
        features: ["All Premium features", "Custom design modifications", "SEO optimization", "Dedicated support manager"],
        stripePriceId: "price_luxury",
        trialDays: 14,
        isPopular: false
      });
    }
    
    // Initial sample salons
    if ((await this.getSalons()).length === 0) {
      await this.createSalon({
        name: "Glam Nails Spa",
        location: "Miami, FL",
        address: "123 Ocean Drive, Miami, FL 33139",
        phoneNumber: "(305) 555-1234",
        email: "contact@glamnails.com",
        sampleUrl: "glamnails-miami",
        services: ["Manicure", "Pedicure", "Gel Nails", "Nail Art", "Acrylics"],
        templateId: 1
      });
      
      await this.createSalon({
        name: "Luxury Nail Bar",
        location: "Los Angeles, CA",
        address: "456 Beverly Blvd, Los Angeles, CA 90210",
        phoneNumber: "(310) 555-9876",
        email: "info@luxurynailbar.com",
        sampleUrl: "luxurynail-la",
        services: ["Manicure", "Pedicure", "Spa Treatments", "Waxing", "Nail Extensions"],
        templateId: 3
      });
      
      await this.createSalon({
        name: "Perfect 10 Nails",
        location: "Chicago, IL",
        address: "789 Michigan Ave, Chicago, IL 60611",
        phoneNumber: "(312) 555-4321",
        email: "hello@perfect10nails.com",
        sampleUrl: "perfect10-chicago",
        services: ["Manicure", "Pedicure", "Paraffin Treatments", "Nail Art", "Kids Nails"],
        templateId: 2
      });
      
      await this.createSalon({
        name: "Polished Nail Studio",
        location: "Atlanta, GA",
        address: "101 Peachtree St, Atlanta, GA 30303",
        phoneNumber: "(404) 555-7890",
        email: "contact@polishednailstudio.com",
        sampleUrl: "polished-atlanta",
        services: ["Manicure", "Pedicure", "Gel Polish", "Dipping Powder", "Nail Repair"],
        templateId: 4
      });
      
      // Update contact status for some salons
      const salons = await this.getSalons();
      if (salons.length >= 4) {
        await this.updateSalon(salons[1].id, { contactStatus: "contacted" });
        await this.updateSalon(salons[2].id, { contactStatus: "contacted" });
        await this.updateSalon(salons[3].id, { contactStatus: "interested" });
        
        // Update stats
        await this.updateStats({
          pendingContacts: 1, // Only one salon not contacted
        });
      }
    }
  }
}

// Create and export storage instance
export const storage = new MemStorage();

// Initialize data
storage.initialize().catch(console.error);
