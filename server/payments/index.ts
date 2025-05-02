import { stripeProvider } from './stripeProvider';
import { paypalProvider } from './paypalProvider';
import { manualProvider } from './manualProvider';

// Payment provider configuration type
export type PaymentProviderConfig = {
  enabled: boolean;
  apiKey?: string;
  // Add other provider-specific config options here
};

// Define available payment providers
export type PaymentProviderType = 'stripe' | 'paypal' | 'manual';

// Config interface for all providers
export interface PaymentProvidersConfig {
  stripe: PaymentProviderConfig;
  paypal: PaymentProviderConfig;
  manual: PaymentProviderConfig;
  defaultProvider: PaymentProviderType;
}

// Default configuration with all providers disabled by default
const defaultConfig: PaymentProvidersConfig = {
  stripe: { enabled: false },
  paypal: { enabled: false },
  manual: { enabled: true }, // Enable manual payments by default
  defaultProvider: 'manual',
};

// Get configuration from environment variables
const getPaymentConfig = (): PaymentProvidersConfig => {
  const config = { ...defaultConfig };
  
  // Stripe configuration
  config.stripe.enabled = process.env.ENABLE_STRIPE === 'true';
  config.stripe.apiKey = process.env.STRIPE_SECRET_KEY;

  // PayPal configuration
  config.paypal.enabled = process.env.ENABLE_PAYPAL === 'true';
  config.paypal.apiKey = process.env.PAYPAL_API_KEY;

  // Set default provider based on environment
  if (process.env.DEFAULT_PAYMENT_PROVIDER) {
    const providerType = process.env.DEFAULT_PAYMENT_PROVIDER as PaymentProviderType;
    if (config[providerType]?.enabled) {
      config.defaultProvider = providerType;
    }
  }

  return config;
};

// Current payment config
export const paymentConfig = getPaymentConfig();

// Payment provider interface
export interface PaymentProvider {
  createPaymentIntent(amount: number, currency: string, metadata?: any): Promise<any>;
  processPayment(paymentId: string): Promise<any>;
  createSubscription(customerId: string, priceId: string): Promise<any>;
  cancelSubscription(subscriptionId: string): Promise<any>;
  createCustomer(email: string, name: string): Promise<any>;
  isConfigured(): boolean;
}

// Get payment provider based on type
export const getPaymentProvider = (type: PaymentProviderType): PaymentProvider => {
  const config = paymentConfig[type];
  
  if (!config.enabled) {
    throw new Error(`Payment provider ${type} is disabled`);
  }

  switch (type) {
    case 'stripe':
      return stripeProvider;
    case 'paypal':
      return paypalProvider;
    case 'manual':
      return manualProvider;
    default:
      throw new Error(`Unknown payment provider: ${type}`);
  }
};

// Get the default payment provider
export const getDefaultPaymentProvider = (): PaymentProvider => {
  return getPaymentProvider(paymentConfig.defaultProvider);
};

// Get all enabled payment providers
export const getEnabledPaymentProviders = (): PaymentProviderType[] => {
  return Object.entries(paymentConfig)
    .filter(([key, value]) => key !== 'defaultProvider' && typeof value === 'object' && value.enabled)
    .map(([key]) => key as PaymentProviderType);
};