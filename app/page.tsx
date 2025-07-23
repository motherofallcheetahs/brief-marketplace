// app/page.tsx
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Brief Marketplace
        </h1>
        <p className="text-gray-600 mb-8">
          Welcome to the marketplace! Manage your wallet and make purchases.
        </p>
        <Link
          href="/wallet"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Go to Wallet
        </Link>
      </div>
    </div>
  )
} 