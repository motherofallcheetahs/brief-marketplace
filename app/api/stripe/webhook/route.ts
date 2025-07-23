// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase-server'
import Stripe from 'stripe'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  console.log('Webhook received:', new Date().toISOString())
  
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    console.log('Webhook signature present:', !!signature)
    console.log('Webhook body length:', body.length)

    if (!signature) {
      console.error('Missing stripe-signature header')
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
      console.log('Webhook event type:', event.type)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    if (event.type === 'checkout.session.completed') {
      console.log('Processing checkout.session.completed event')
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.client_reference_id
      const amount = session.amount_total

      console.log('Session data:', { userId, amount })

      if (!userId || !amount) {
        console.error('Missing userId or amount in session:', session)
        return NextResponse.json(
          { error: 'Invalid session data' },
          { status: 400 }
        )
      }

      // Insert transaction into ledger
      console.log('Inserting transaction into database...')
      const { data, error } = await supabaseAdmin()
        .from('transactions')
        .insert({
          user_id: userId,
          amount: amount / 100, // Convert from cents to dollars
          type: 'top_up',
        })
        .select()

      if (error) {
        console.error('Error inserting transaction:', error)
        return NextResponse.json(
          { error: 'Failed to record transaction' },
          { status: 500 }
        )
      }

      console.log('Transaction inserted successfully:', data)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
} 