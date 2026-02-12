import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ShieldCheck, Smartphone, Zap, Check } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* --- 1. HERO SECTION --- */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="container px-4 mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-primary">
              Create Realistic iOS Chat Mockups in <span className="text-blue-600">Seconds</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              The fastest way to generate iPhone messaging screenshots for marketing, social media,
              and presentations. <br className="hidden sm:inline" />
              <span className="italic font-medium text-foreground">No design skills required.</span>
            </p>

            <div className="flex justify-center gap-4 pt-4">
              <Link href="/create">
                <Button
                  size="lg"
                  className="h-12 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  Start Creating
                </Button>
              </Link>
              {/* Optional Secondary CTA */}
              <Link href="#pricing">
                <Button variant="outline" size="lg" className="h-12 px-8 text-lg rounded-full">
                  View Plans
                </Button>
              </Link>
            </div>
          </div>

          {/* Optional: Abstract "Product Shot" Visual */}
          <div className="mt-16 mx-auto max-w-5xl p-4 bg-muted/50 rounded-3xl border shadow-2xl rotate-x-12 transform-gpu perspective-1000">
            {/* This replicates a browser window look */}
            <div className="rounded-2xl overflow-hidden border bg-background shadow-sm aspect-video flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900 opacity-50" />
              <p className="text-muted-foreground font-medium z-10">
                [ Insert High-Quality Screenshot of your /create page here ]
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. FEATURES SECTION --- */}
      <section id="features" className="py-24 bg-muted/30 border-y">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Use TextMock?</h2>
            <p className="text-muted-foreground">
              Stop wasting hours in Photoshop. We built the tool specifically for marketers and
              creators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="bg-background/50 border-none shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <CardTitle>100% Private</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your data stays yours. We dont train AI on your conversations. What happens in
                  TextMock stays in TextMock.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-background/50 border-none shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
                  <Smartphone className="w-6 h-6" />
                </div>
                <CardTitle>Fully Responsive</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Create conversation mockups on the go. Our editor works perfectly on your
                  smartphone, tablet, or desktop.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-background/50 border-none shadow-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
                  <Zap className="w-6 h-6" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Generate high-res PNGs in milliseconds. No loading spinners, no complex render
                  queues. Just click and save.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* --- 3. PRICING SECTION --- */}
      <section id="pricing" className="py-24">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Choose a Plan</h2>
            <p className="text-muted-foreground">
              Start for free, upgrade for power. Simple token-based pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl">Starter</CardTitle>
                <CardDescription>For casual creators</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground"> / month</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" /> 10 Free Tokens
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" /> Standard Resolution
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" /> Basic iOS Assets
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  Sign Up Free
                </Button>
              </CardFooter>
            </Card>

            {/* Advanced Plan (Highlighted) */}
            <Card className="flex flex-col relative border-blue-500 shadow-lg scale-105 z-10">
              <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Most Popular
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Advanced</CardTitle>
                <CardDescription>For power users</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$9</span>
                  <span className="text-muted-foreground"> / month</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" /> 500 Tokens / mo
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" /> 4K Resolution Export
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" /> Remove Watermark
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" /> Priority Support
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="default">
                  Get Started
                </Button>
              </CardFooter>
            </Card>

            {/* Lifetime Plan */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl">Lifetime</CardTitle>
                <CardDescription>One-time payment</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="text-muted-foreground"> / once</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" /> Unlimited Tokens
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" /> All Future Updates
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" /> Commercial License
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  Buy Now
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* --- 4. CTA FOOTER --- */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to create your first mock?</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            Join thousands of marketers creating better social media content today.
          </p>
          <Link href="/create">
            <Button size="lg" variant="secondary" className="px-8 font-semibold">
              Launch TextMock Editor
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}
