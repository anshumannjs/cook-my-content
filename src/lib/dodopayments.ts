import DodoPayments from 'dodopayments'

export const dodo = new DodoPayments({
  bearerToken:  process.env.DODO_PAYMENTS_API_KEY!,
  environment:  (process.env.DODO_PAYMENTS_ENVIRONMENT ?? 'live_mode') as 'live_mode' | 'test_mode',
  webhookKey:   process.env.DODO_PAYMENTS_WEBHOOK_KEY!,
})

export const DODO_PRODUCT_IDS = {
  classic: process.env.DODO_CLASSIC_PRODUCT_ID!,
  premium: process.env.DODO_PREMIUM_PRODUCT_ID!,
}