import { 
  users, type User, type InsertUser, 
  salons, type Salon, type InsertSalon,
  templates, type Template, type InsertTemplate,
  subscriptionPlans, type SubscriptionPlan, type InsertSubscriptionPlan,
  blogPosts, type BlogPost, type InsertBlogPost,
  blogComments, type BlogComment, type InsertBlogComment,
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
  
  // Blog operations
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getBlogPosts(options?: { limit?: number, offset?: number, category?: string, featured?: boolean, published?: boolean }): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, updates: Partial<BlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<boolean>;
  incrementBlogPostViewCount(id: number): Promise<BlogPost>;
  
  // Blog comment operations
  getBlogComments(postId: number): Promise<BlogComment[]>;
  createBlogComment(comment: InsertBlogComment): Promise<BlogComment>;
  approveBlogComment(id: number): Promise<BlogComment>;
  deleteBlogComment(id: number): Promise<boolean>;
  
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
  private blogPosts: Map<number, BlogPost>;
  private blogComments: Map<number, BlogComment>;
  private statsData: Stats;
  
  private userIdCounter: number;
  private salonIdCounter: number;
  private templateIdCounter: number;
  private subscriptionPlanIdCounter: number;
  private blogPostIdCounter: number;
  private blogCommentIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.salons = new Map();
    this.templates = new Map();
    this.subscriptionPlans = new Map();
    this.blogPosts = new Map();
    this.blogComments = new Map();
    
    this.userIdCounter = 1;
    this.salonIdCounter = 1;
    this.templateIdCounter = 1;
    this.subscriptionPlanIdCounter = 1;
    this.blogPostIdCounter = 1;
    this.blogCommentIdCounter = 1;
    
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
      claimedAt: null,
      ownerId: null,
      contactStatus: "notContacted",
      description: insertSalon.description || null,
      openingHours: insertSalon.openingHours || null
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
  
  // Blog post operations
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(
      (post) => post.slug === slug
    );
  }
  
  async getBlogPosts(options?: { 
    limit?: number, 
    offset?: number, 
    category?: string, 
    featured?: boolean, 
    published?: boolean 
  }): Promise<BlogPost[]> {
    let posts = Array.from(this.blogPosts.values());
    
    // Apply filters
    if (options?.category) {
      posts = posts.filter(post => post.category === options.category);
    }
    
    if (options?.featured !== undefined) {
      posts = posts.filter(post => post.featured === options.featured);
    }
    
    if (options?.published !== undefined) {
      posts = posts.filter(post => post.published === options.published);
    }
    
    // Sort by creation date descending
    posts.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
    
    // Apply pagination
    if (options?.offset !== undefined && options?.limit !== undefined) {
      posts = posts.slice(options.offset, options.offset + options.limit);
    } else if (options?.limit !== undefined) {
      posts = posts.slice(0, options.limit);
    }
    
    return posts;
  }
  
  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.blogPostIdCounter++;
    
    // Generate slug from title
    const slug = insertPost.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    
    // Process tags if they come as a string
    let tags: string[] = [];
    if (typeof insertPost.tags === 'string') {
      tags = insertPost.tags.split(',').map(tag => tag.trim());
    } else if (Array.isArray(insertPost.tags)) {
      tags = insertPost.tags;
    }
    
    const uniqueSlug = await this.ensureUniqueSlug(slug);
    
    const post: BlogPost = {
      id,
      title: insertPost.title,
      slug: uniqueSlug,
      content: insertPost.content,
      excerpt: insertPost.excerpt || null,
      coverImage: insertPost.coverImage || null,
      authorId: insertPost.authorId,
      category: insertPost.category || 'other',
      tags: tags,
      published: insertPost.published || false,
      featured: insertPost.featured || false,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: null
    };
    
    this.blogPosts.set(id, post);
    return post;
  }
  
  private async ensureUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;
    
    while (await this.getBlogPostBySlug(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    return slug;
  }
  
  async updateBlogPost(id: number, updates: Partial<BlogPost>): Promise<BlogPost> {
    const post = await this.getBlogPost(id);
    if (!post) {
      throw new Error(`Blog post with id ${id} not found`);
    }
    
    // If title is being updated, generate a new slug
    let processedUpdates = { ...updates };
    if (updates.title && !updates.slug) {
      const newSlug = updates.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      processedUpdates.slug = await this.ensureUniqueSlug(newSlug);
    }
    
    const updatedPost = { ...post, ...processedUpdates, updatedAt: new Date() };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }
  
  async deleteBlogPost(id: number): Promise<boolean> {
    const post = await this.getBlogPost(id);
    if (!post) {
      return false;
    }
    
    // Delete associated comments
    const comments = await this.getBlogComments(id);
    for (const comment of comments) {
      await this.deleteBlogComment(comment.id);
    }
    
    return this.blogPosts.delete(id);
  }
  
  async incrementBlogPostViewCount(id: number): Promise<BlogPost> {
    const post = await this.getBlogPost(id);
    if (!post) {
      throw new Error(`Blog post with id ${id} not found`);
    }
    
    const updatedPost = { ...post, viewCount: post.viewCount + 1 };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }
  
  // Blog comment operations
  async getBlogComments(postId: number): Promise<BlogComment[]> {
    return Array.from(this.blogComments.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
  }
  
  async createBlogComment(insertComment: InsertBlogComment): Promise<BlogComment> {
    const id = this.blogCommentIdCounter++;
    
    const comment: BlogComment = {
      id,
      postId: insertComment.postId,
      name: insertComment.name,
      email: insertComment.email,
      content: insertComment.content,
      approved: false,
      userId: insertComment.userId || null,
      createdAt: new Date()
    };
    
    this.blogComments.set(id, comment);
    return comment;
  }
  
  async approveBlogComment(id: number): Promise<BlogComment> {
    const comment = this.blogComments.get(id);
    if (!comment) {
      throw new Error(`Blog comment with id ${id} not found`);
    }
    
    const approvedComment = { ...comment, approved: true };
    this.blogComments.set(id, approvedComment);
    return approvedComment;
  }
  
  async deleteBlogComment(id: number): Promise<boolean> {
    return this.blogComments.delete(id);
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
      
      await this.createTemplate({
        name: "Minimalist",
        description: "Clean & Simple design focusing on content and usability.",
        previewImageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        features: ["Minimal design elements", "Clean white space", "Focus on typography", "Fast loading"],
        isMobileOptimized: true
      });
      
      await this.createTemplate({
        name: "Artistic",
        description: "Creative & Unique design for artistic salons.",
        previewImageUrl: "https://images.unsplash.com/photo-1617897903246-719242758050?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        features: ["Artistic elements", "Creative layouts", "Unique typography", "Visual focus"],
        isMobileOptimized: true
      });
      
      await this.createTemplate({
        name: "Vibrant",
        description: "Colorful & Energetic design to showcase salon personality.",
        previewImageUrl: "https://images.unsplash.com/photo-1612837017391-4b6b7b0c3b76?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        features: ["Vibrant color palette", "Dynamic elements", "Energetic layout", "Bold imagery"],
        isMobileOptimized: true
      });
      
      await this.createTemplate({
        name: "Dark Mode",
        description: "Sleek & Modern dark-themed design for a contemporary feel.",
        previewImageUrl: "https://images.unsplash.com/photo-1608501821300-4f99e58bba77?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        features: ["Dark color scheme", "High contrast", "Glowing accents", "Modern feel"],
        isMobileOptimized: true
      });
      
      await this.createTemplate({
        name: "Natural",
        description: "Earthy & Organic design ideal for eco-friendly salons.",
        previewImageUrl: "https://images.unsplash.com/photo-1605714044579-581d3bdb5074?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        features: ["Natural color palette", "Organic shapes", "Sustainability focus", "Earthy elements"],
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
    
    // Initial blog posts
    if ((await this.getBlogPosts()).length === 0) {
      const admin = await this.getUserByUsername("admin");
      if (admin) {
        // Blog post 1
        await this.createBlogPost({
          title: "10 Nail Art Trends to Try in 2025",
          content: `
# 10 Nail Art Trends to Try in 2025

The world of nail art is constantly evolving, with new techniques, colors, and designs emerging each season. As we move into 2025, several exciting trends are taking center stage in salons across the globe. Whether you're a nail art enthusiast or just looking to try something new, here are the top trends to consider for your next manicure.

## 1. Holographic Chrome

Holographic chrome nails continue to dominate, offering a futuristic sheen that shifts colors in different lighting. The latest iterations combine chrome with matte finishes for a striking contrast.

## 2. Biodegradable Glitter

As sustainability becomes increasingly important, biodegradable glitter is replacing traditional microplastic versions. These eco-friendly alternatives still provide the sparkle clients love while being better for the environment.

## 3. Minimalist Designs

Clean, simple lines and geometric shapes on a neutral base create an elegant, sophisticated look that works for both casual and formal occasions.

## 4. Japanese-Inspired Art

Delicate cherry blossoms, koi fish, and wave patterns inspired by traditional Japanese art are becoming increasingly popular for those seeking detailed, narrative nail designs.

## 5. Extended French Tips

The classic French manicure is getting an update with colorful tips, wavy lines, and extended lengths that frame the natural nail in creative ways.

## 6. Customized Nail Shapes

From lipstick shapes to soft almond styles, customized nail shapes that complement a client's hand shape provide a personalized approach to nail art.

## 7. Texture Play

Combining smooth finishes with textured elements creates depth and visual interest, especially when using contrasting colors.

## 8. Negative Space Designs

Leaving portions of the natural nail visible creates contemporary designs that are both artistic and practical, as they grow out more gracefully.

## 9. Nature-Inspired Elements

Organic shapes, pressed flowers, and earth tones reflect a growing connection to nature in nail art design.

## 10. Gel Extensions with Embedded Elements

Thin, natural-looking gel extensions with embedded elements like dried flowers or tiny metallic pieces offer a three-dimensional effect that's both delicate and eye-catching.

Remember to discuss these trends with your clients and adapt them to suit individual preferences and lifestyles. The best nail art combines current trends with personal style for a truly unique result.
          `,
          excerpt: "Discover the hottest nail art trends of 2025, from holographic chrome to sustainable biodegradable glitter and Japanese-inspired designs.",
          authorId: admin.id,
          category: "nail_art",
          tags: ["trends", "nail art", "2025", "designs"],
          published: true,
          featured: true
        });

        // Blog post 2
        await this.createBlogPost({
          title: "How to Grow Your Salon Business with Social Media",
          content: `
# How to Grow Your Salon Business with Social Media

In today's digital landscape, social media has become an essential tool for salon business growth. With the right strategy, platforms like Instagram, Facebook, TikTok, and Pinterest can dramatically increase your salon's visibility, attract new clients, and build lasting relationships with your existing customer base.

## Showcase Your Best Work

High-quality photos and videos of your salon's work are your most powerful marketing assets. Create a consistent photography style that highlights the artistry and precision of your services. Consider these tips:

- Use natural lighting whenever possible
- Capture before-and-after transformations
- Show the process as well as the final result
- Feature diverse clients and styles
- Maintain consistent editing for brand recognition

## Choose the Right Platforms

Each social media platform serves a different purpose and audience:

- **Instagram**: Perfect for visual content and reaching younger audiences
- **Facebook**: Great for community building and targeting local customers
- **TikTok**: Ideal for quick tutorials and trend-based content
- **Pinterest**: Excellent for inspirational content that has a long shelf life

Focus on mastering 2-3 platforms rather than spreading yourself too thin across all of them.

## Create Valuable Content

Beyond showcasing your work, provide content that adds value to your followers:

- Quick tutorials for at-home maintenance
- Product recommendations and reviews
- Answers to common client questions
- Behind-the-scenes glimpses of salon life
- Staff spotlights to humanize your brand
- Seasonal trend forecasts and inspiration

## Leverage User-Generated Content

Encourage clients to share their fresh salon looks by:

- Creating an Instagram-worthy space in your salon
- Offering small discounts for clients who post and tag your salon
- Reposting client content (with permission)
- Creating a unique salon hashtag for clients to use

## Implement a Booking Call-to-Action

Make it easy for followers to become clients:

- Include booking links in your bio and stories
- Add "Book Now" buttons to Facebook and Instagram business profiles
- Respond promptly to booking inquiries through direct messages
- Consider implementing a social media booking system

## Build Community Engagement

Foster a sense of community around your salon:

- Respond to comments and messages promptly
- Ask questions to encourage interaction
- Run polls and requests for feedback
- Feature client stories and testimonials
- Collaborate with complementary local businesses

## Analyze and Adapt

Use analytics tools to refine your strategy:

- Track which content generates the most engagement
- Identify peak posting times for your audience
- Monitor conversion rates from social to actual bookings
- Adjust your content calendar based on performance data

Remember, consistency is key to social media success. Create a content calendar, establish a regular posting schedule, and stick to it. With patience and persistence, social media can become your salon's most effective marketing channel.
          `,
          excerpt: "Learn effective strategies to leverage social media platforms for growing your salon business, attracting new clients, and building a strong online community.",
          authorId: admin.id,
          category: "marketing",
          tags: ["social media", "marketing", "business growth", "salon tips"],
          published: true,
          featured: false
        });

        // Blog post 3
        await this.createBlogPost({
          title: "Essential Equipment for New Salon Owners",
          content: `
# Essential Equipment for New Salon Owners

Opening a new nail salon is an exciting venture, but it requires careful planning and investment in quality equipment. Having the right tools not only enhances the client experience but also improves efficiency and service quality. Here's a comprehensive guide to the essential equipment every new salon owner should consider.

## Salon Furniture

### Reception Area
- Reception desk with storage
- Comfortable seating for waiting clients
- Display shelving for retail products
- Coffee table with current magazines
- Water dispenser or refreshment station

### Workstations
- Manicure tables with built-in ventilation
- Adjustable technician chairs with back support
- Comfortable client chairs
- Good task lighting at each station
- Storage drawers or caddies for immediate supplies

### Pedicure Area
- Pedicure chairs with massage features
- Foot spas with disposable liners or excellent cleaning systems
- Adjustable technician stools
- Privacy dividers if space allows

## Nail Equipment and Tools

### Basic Tools (multiple sets)
- Cuticle nippers, pushers, and scissors
- Nail clippers and files
- Buffer blocks and nail brushes
- Callus removers
- Metal implements sterilizer

### Electric Equipment
- Professional nail drills with various bits
- LED/UV lamps for gel curing
- Electric file for acrylics and gels
- Paraffin wax heaters
- Hot towel warmers

### Disposables
- Quality nail files and buffers
- Disposable liners for pedicure tubs
- Toe separators
- Cuticle sticks
- Gauze and cotton pads
- Toe and finger covers

## Sanitation and Safety Equipment

- Autoclave for sterilizing metal implements
- UV sterilizer boxes for small tools
- Hand sanitizing stations
- First aid kit
- HEPA air purification system
- Ventilation system or source capture systems at each workstation
- Proper storage for chemicals

## Product Inventory

- Base coats, top coats, and various polish colors
- Gel polish system
- Acrylic system (powders, liquids, primers)
- Nail art supplies
- Cuticle oils and lotions
- Retail products for home care

## Business Technology

- Point of sale (POS) system with appointment scheduling
- Computer or tablet for business management
- Reliable WiFi
- Security cameras
- Music system for ambiance
- Telephone system

## Additional Considerations

- Designated cleaning equipment and supplies
- Proper chemical storage solutions
- Comfortable, washable uniforms for staff
- Clear signage for promotions and services
- Adequate lighting throughout the salon

## Investment Priorities

If your budget is limited, prioritize equipment in this order:
1. Safety and sanitation equipment (non-negotiable)
2. Essential tools for your core services
3. Comfortable workstations
4. Business management technology
5. Reception area furnishings
6. Ambient and comfort features

Remember that while it might be tempting to save money by purchasing inexpensive equipment, investing in quality items will serve your business better in the long run. Quality equipment lasts longer, performs better, and contributes to a more professional image for your salon.

Also consider lease options for more expensive equipment if the initial investment is prohibitive. As your business grows, you can always upgrade or expand your equipment collection to accommodate new services and techniques.
          `,
          excerpt: "A comprehensive guide to essential equipment and supplies needed when opening a new nail salon, from furniture and tools to sanitation systems and business technology.",
          authorId: admin.id,
          category: "business_advice",
          tags: ["equipment", "new salon", "startup", "business essentials"],
          published: true,
          featured: true
        });
      }
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
