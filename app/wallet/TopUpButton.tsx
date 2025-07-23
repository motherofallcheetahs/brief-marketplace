'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TopUpButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleTopUp = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: 1000 }), // $10.00 in cents
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json()
      
      if (url) {
        router.push(url)
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('Failed to create checkout session. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleTopUp}
      disabled={isLoading}
      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
    >
      {isLoading ? 'Processing...' : 'Top-up $10'}
    </button>
  )
} 