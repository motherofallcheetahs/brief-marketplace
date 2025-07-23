# Brief Marketplace - Wallet Top-up with Stripe

This project implements wallet top-up functionality using Stripe Checkout and a ledger-based transaction system.

## Features

- ✅ Stripe Checkout integration for secure payments
- ✅ Webhook handling for payment confirmation
- ✅ Ledger-based transaction recording (no mutable wallet table)
- ✅ Edge runtime compatible webhook handler
- ✅ TypeScript implementation with proper error handling

## Setup

1. **Environment Variables** (already configured):
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

## Testing

1. **Start the webhook listener** (in a separate terminal):
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

2. **Navigate to the application**:
   - Visit `http://localhost:3000`
   - Click "Go to Wallet" or visit `http://localhost:3000/wallet`

3. **Test the top-up flow**:
   - Click "Top-up $10" button
   - Complete the Stripe checkout process
   - Verify the transaction is recorded in the `transactions` table

## API Endpoints

- `POST /api/stripe/create-checkout-session`
  - Accepts: `{ amount: number }` (in cents)
  - Returns: `{ url: string }` (Stripe checkout URL)

- `POST /api/stripe/webhook`
  - Handles Stripe webhook events
  - Records successful payments in the `transactions` table
  - Edge runtime compatible

## Database Schema

The system uses a ledger-based approach with a `transactions` table:

```sql
-- Example transaction record
{
  user_id: 'demo-user',
  amount: 10.00,  -- in dollars
  type: 'top_up',
  created_at: timestamp
}
```

## Architecture

- **Server Components**: Wallet page with balance display
- **Client Components**: Top-up button with loading states
- **API Routes**: Stripe integration with proper error handling
- **Edge Runtime**: Webhook handler for optimal performance

## Notes

- Currently uses `'demo-user'` as the user ID (replace with actual authentication)
- All amounts are handled in cents for Stripe, converted to dollars for storage
- Webhook signature verification ensures security
- Error handling and logging implemented throughout 