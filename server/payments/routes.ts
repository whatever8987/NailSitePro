import { Request, Response, Router } from 'express';
import { PaymentProviderType, getDefaultPaymentProvider, getEnabledPaymentProviders, getPaymentProvider, paymentConfig } from '.';

const paymentRouter = Router();

// Get available payment methods
paymentRouter.get('/methods', (req: Request, res: Response) => {
  const enabledProviders = getEnabledPaymentProviders();
  const defaultProvider = paymentConfig.defaultProvider;

  res.json({
    enabled: enabledProviders,
    default: defaultProvider,
  });
});

// Create a payment intent
paymentRouter.post('/create-payment-intent', async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'usd', provider, metadata } = req.body;
    
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Use specified provider or default
    const paymentProvider = provider ? getPaymentProvider(provider as PaymentProviderType) : getDefaultPaymentProvider();
    
    const paymentIntent = await paymentProvider.createPaymentIntent(amount, currency, metadata);
    
    res.json(paymentIntent);
  } catch (error: any) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Process a payment
paymentRouter.post('/process-payment', async (req: Request, res: Response) => {
  try {
    const { paymentId, provider } = req.body;
    
    if (!paymentId) {
      return res.status(400).json({ error: 'Payment ID is required' });
    }

    // Use specified provider or default
    const paymentProvider = provider ? getPaymentProvider(provider as PaymentProviderType) : getDefaultPaymentProvider();
    
    const paymentResult = await paymentProvider.processPayment(paymentId);
    
    res.json(paymentResult);
  } catch (error: any) {
    console.error('Payment processing error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a customer
paymentRouter.post('/create-customer', async (req: Request, res: Response) => {
  try {
    const { email, name, provider } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    // Use specified provider or default
    const paymentProvider = provider ? getPaymentProvider(provider as PaymentProviderType) : getDefaultPaymentProvider();
    
    const customer = await paymentProvider.createCustomer(email, name);
    
    res.json(customer);
  } catch (error: any) {
    console.error('Customer creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a subscription
paymentRouter.post('/create-subscription', async (req: Request, res: Response) => {
  try {
    const { customerId, priceId, provider } = req.body;
    
    if (!customerId || !priceId) {
      return res.status(400).json({ error: 'Customer ID and price ID are required' });
    }

    // Use specified provider or default
    const paymentProvider = provider ? getPaymentProvider(provider as PaymentProviderType) : getDefaultPaymentProvider();
    
    const subscription = await paymentProvider.createSubscription(customerId, priceId);
    
    res.json(subscription);
  } catch (error: any) {
    console.error('Subscription creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cancel a subscription
paymentRouter.post('/cancel-subscription', async (req: Request, res: Response) => {
  try {
    const { subscriptionId, provider } = req.body;
    
    if (!subscriptionId) {
      return res.status(400).json({ error: 'Subscription ID is required' });
    }

    // Use specified provider or default
    const paymentProvider = provider ? getPaymentProvider(provider as PaymentProviderType) : getDefaultPaymentProvider();
    
    const cancellation = await paymentProvider.cancelSubscription(subscriptionId);
    
    res.json(cancellation);
  } catch (error: any) {
    console.error('Subscription cancellation error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default paymentRouter;