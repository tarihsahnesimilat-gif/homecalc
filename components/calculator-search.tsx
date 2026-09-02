'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'
import { Search } from 'lucide-react'

import { getCategoryName, searchCalculators } from '@/lib/calculators'
import { cn } from '@/lib/utils'

interface CalculatorSearchProps {
  placeholder?: string
  label?: string
  /** `hero` is the large homepage box, `compact` is the header field. */
  variant?: 'hero' | 'compact'
  className?: string
}

/**
 * Client-side search over the calculator registry. Live calculators link to
 * their page; planned ones are listed as "Coming soon" and are not clickable,
 * so the search never pretends a calculator is available.
 */
export function CalculatorSearch({
  placeholder = 'Search calculators...',
  label = 'Search calculators',
  variant = 'compact',
  className,
}: CalculatorSearchProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  const results = searchCalculators(query)
  const showResults = isOpen && query.trim().length > 0

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  const isHero = variant === 'hero'

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div
        className={cn(
          isHero
            ? 'flex items-center gap-3 rounded-lg border border-border bg-background p-2 shadow-sm'
            : 'relative',
        )}
      >
        <Search
          className={cn(
            'text-muted-foreground',
            isHero ? 'ml-2 size-5 shrink-0' : 'absolute left-3 top-2.5 size-4',
          )}
        />
        <input
          type="search"
          role="combobox"
          aria-label={label}
          aria-expanded={showResults}
          aria-controls={listId}
          autoComplete="off"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setIsOpen(false)
          }}
          placeholder={placeholder}
          className={cn(
            isHero
              ? 'min-w-0 flex-1 bg-transparent px-1 py-2 text-sm outline-none'
              : 'h-9 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm outline-none ring-accent focus:ring-2',
          )}
        />
        {isHero && (
          <Link
            href="#calculators"
            className="shrink-0 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Find a tool
          </Link>
        )}
      </div>

      {showResults && (
        <div
          id={listId}
          role="listbox"
          className={cn(
            'absolute z-20 w-full rounded-md border border-border bg-card p-1 shadow-lg',
            isHero ? 'top-full mt-2' : 'top-11',
          )}
        >
          {results.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              No calculators match &ldquo;{query.trim()}&rdquo; yet.
            </p>
          ) : (
            results.map((calculator) =>
              calculator.status === 'live' ? (
                <Link
                  key={calculator.slug}
                  href={calculator.href}
                  role="option"
                  aria-selected={false}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between gap-3 rounded px-3 py-2 text-sm hover:bg-muted"
                >
                  <span className="font-medium text-primary">{calculator.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {getCategoryName(calculator.category)}
                  </span>
                </Link>
              ) : (
                <div
                  key={calculator.slug}
                  role="option"
                  aria-selected={false}
                  aria-disabled="true"
                  className="flex cursor-not-allowed items-center justify-between gap-3 rounded px-3 py-2 text-sm text-muted-foreground"
                >
                  <span>{calculator.name}</span>
                  <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs font-medium">
                    Coming soon
                  </span>
                </div>
              ),
            )
          )}
        </div>
      )}
    </div>
  )
}
