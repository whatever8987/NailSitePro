import { PaymentProvider, paymentConfig } from './index';

class ManualPaymentProvider implements PaymentProvider {
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = paymentConfig.manual.enabled;
  }

  public isConfigured(): boolean {
    return this.isEnabled;
  }

  private checkConfiguration() {
    if (!this.isConfigured()) {
      throw new Error('Manual payment provider is not configured');
    }
  }

  async createPaymentIntent(amount: number, currency: string, metadata?: any): Promise<any> {
    this.checkConfiguration();
    
    // Generate a unique reference number for the manual payment
    const referenceNumber = `MAN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    return {
      id: referenceNumber,
      status: 'PENDING',
      amount,
      currency,
      referenceNumber,
      paymentInstructions: 'Please make a bank transfer using the reference number provided.',
    };
  }

  async processPayment(paymentId: string): Promise<any> {
    this.checkConfiguration();
    
    // In a real implementation, this would check if the payment has been marked as paid
    // For demonstration purposes, we'll assume the payment is successful
    
    return {
      id: paymentId,
      status: 'COMPLETED',
      referenceNumber: paymentId,
    };
  }

  async createCustomer(email: string, name: string): Promise<any> {
    this.checkConfiguration();
    
    // For manual payments, we just record the customer information
    return {
      id: `manual-${Date.now()}`,
      email,
      name,
    };
  }

  async createSubscription(customerId: string, priceId: string): Promise<any> {
    this.checkConfiguration();
    
    // Create a subscription record with manual payment method
    const subscriptionId = `manual-sub-${Date.now()}`;
    
    return {
      id: subscriptionId,
      status: 'PENDING',
      customerId,
      planId: priceId,
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      paymentInstructions: 'Please make a bank transfer by the next billing date.',
    };
  }

  async cancelSubscription(subscriptionId: string): Promise<any> {
    this.checkConfiguration();
    
    // Simply mark the subscription as cancelled
    return {
      id: subscriptionId,
      status: 'CANCELLED',
    };
  }
}

export const manualProvider: PaymentProvider = new ManualPaymentProvider();