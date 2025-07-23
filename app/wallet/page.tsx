// app/wallet/page.tsx
import { supabaseAdmin } from '@/lib/supabase-server'
import TopUpButton from './TopUpButton'

export default async function WalletPage() {
  // Calculate wallet balance from transactions
  const { data: transactions, error } = await supabaseAdmin()
    .from('transactions')
    .select('amount, type')
    .eq('user_id', '107f6ee2-65b3-425c-99fb-0fdac12e9c31')

  if (error) {
    console.error('Error fetching transactions:', error)
    return <div>Error loading wallet</div>
  }

  // Calculate balance from transactions
  const balance = transactions?.reduce((total, transaction) => {
    if (transaction.type === 'top_up') {
      return total + transaction.amount
    }
    // Add other transaction types here as needed (e.g., purchases, refunds)
    return total
  }, 0) || 0

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Wallet</h1>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-1">Current Balance</p>
        <p className="text-3xl font-bold text-green-600">
          ${balance.toFixed(2)}
        </p>
      </div>

      <TopUpButton />
    </div>
  )
} 