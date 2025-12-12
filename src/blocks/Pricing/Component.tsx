import React from 'react'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const PricingBlock: React.FC<any> = ({ title, plans }) => {
  return (
    <section className="py-24">
      <div className="container px-4 mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">{title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans?.map((plan: any, i: number) => (
            <div 
              key={i} 
              className={`relative p-8 rounded-2xl border flex flex-col ${
                plan.isPopular 
                  ? 'border-blue-600 shadow-xl scale-105 bg-white dark:bg-zinc-900 z-10' 
                  : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-medium text-muted-foreground">{plan.name}</h3>
                <div className="flex items-baseline mt-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">/ one-time</span>
                </div>
                <p className="text-sm font-medium text-blue-600 mt-2">
                  {plan.tokens} Tokens
                </p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features?.map((f: any, j: number) => (
                  <li key={j} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 shrink-0" />
                    <span className="text-sm">{f.text}</span>
                  </li>
                ))}
              </ul>

              <Button asChild className="w-full" variant={plan.isPopular ? 'default' : 'outline'}>
                {/* Note: This link will eventually point to your Stripe checkout */}
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}