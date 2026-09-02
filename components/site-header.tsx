'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Calculator, Menu, X } from 'lucide-react'

import { CalculatorSearch } from '@/components/calculator-search'

const navigation = [
  { label: 'Calculators', href: '/#calculators' },
  { label: 'Categories', href: '/#categories' },
  { label: 'About', href: '/#about' },
  { label: 'FAQ', href: '/#faq' },
] as const

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b border-border bg-background/95">
      <div className="mx-auto flex max-w-6xl items-center gap-8 px-5 py-4 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight text-primary"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Calculator className="size-4" />
          </span>
          CalculatorHub
        </Link>

        <nav
          aria-label="Main"
          className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex"
        >
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>

        <CalculatorSearch className="ml-auto hidden w-64 sm:block" />

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="ml-auto rounded-md p-2 text-muted-foreground hover:text-primary md:hidden"
        >
          {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {isMenuOpen && (
        <div id="mobile-menu" className="border-t border-border px-5 py-4 md:hidden">
          <CalculatorSearch className="w-full sm:hidden" />
          <nav aria-label="Mobile" className="mt-4 grid gap-1 text-sm font-medium">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-md px-2 py-2 text-muted-foreground hover:bg-muted hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
