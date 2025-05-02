import Stripe from 'stripe';
import { PaymentProvider } from './index';

class StripePaymentProvider implements PaymentProvider {
  private stripe: Stripe | null = null;
  private isEnabled: boolean = false;

  constructor() {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    this.isEnabled = process.env.ENABLE_STRIPE === 'true';
    
    if (this.isEnabled && apiKey) {
      this.stripe = new Stripe(apiKey, {
        apiVersion: '2023-10-16',
      });
    }
  }

  public isConfigured(): boolean {
    return !!this.stripe;
  }

  private checkConfiguration() {
    if (!this.isConfigured()) {
      throw new Error('Stripe payment provider is not configured');
    }
    return this.stripe as Stripe;
  }

  async createPaymentIntent(amount: number, currency: string, metadata?: any): Promise<any> {
    const stripe = this.checkConfiguration();
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata,
    });

    return {
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    };
  }

  async processPayment(paymentId: string): Promise<any> {
    const stripe = this.checkConfiguration();
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
    
    return {
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100, // Convert from cents
      currency: paymentIntent.currency,
    };
  }

  async createCustomer(email: string, name: string): Promise<any> {
    const stripe = this.checkConfiguration();
    
    const customer = await stripe.customers.create({
      email,
      name,
    });

    return {
      id: customer.id,
      email: customer.email,
      name: customer.name,
    };
  }

  async createSubscription(customerId: string, priceId: string): Promise<any> {
    const stripe = this.checkConfiguration();
    
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{
        price: priceId,
      }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    const invoice = subscription.latest_invoice;
    
    if (typeof invoice === 'string') {
      throw new Error('Failed to expand latest invoice');
    }
    
    const paymentIntent = invoice.payment_intent;
    
    if (typeof paymentIntent === 'string') {
      throw new Error('Failed to expand payment intent');
    }

    return {
      id: subscription.id,
      clientSecret: paymentIntent.client_secret,
      status: subscription.status,
    };
  }

  async cancelSubscription(subscriptionId: string): Promise<any> {
    const stripe = this.checkConfiguration();
    
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    
    return {
      id: subscription.id,
      status: subscription.status,
    };
  }
}

export const stripeProvider: PaymentProvider = new StripePaymentProvider();