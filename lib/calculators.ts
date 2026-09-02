import {
  ArrowRightLeft,
  Calculator,
  CalendarClock,
  Divide,
  DollarSign,
  GraduationCap,
  HeartPulse,
  Home,
  Landmark,
  Percent,
  PiggyBank,
  Ratio,
  Receipt,
  ShoppingBasket,
  Sigma,
  Tag,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'

/**
 * Central source of truth for every calculator on CalculatorHub.
 *
 * Adding a calculator means adding one entry to `calculatorDefinitions` below.
 * The homepage, categories, search, related calculators and the sitemap all
 * read from here, so nothing else needs a manual list.
 */

export type CalculatorCategoryId =
  | 'math'
  | 'finance'
  | 'health'
  | 'home'
  | 'education'
  | 'date-time'
  | 'everyday'

/**
 * `live`    - the route exists and the calculator works.
 * `planned` - listed as "Coming soon"; never rendered as a working link.
 */
export type CalculatorStatus = 'live' | 'planned'

export interface CalculatorCategory {
  id: CalculatorCategoryId
  name: string
  description: string
  icon: LucideIcon
}

export interface CalculatorDefinition {
  name: string
  slug: string
  description: string
  category: CalculatorCategoryId
  /** Derived from the slug — never hand-written, never "#". */
  href: string
  icon: LucideIcon
  popular: boolean
  status: CalculatorStatus
}

/** Everything except `href`, which is derived from the slug. */
type CalculatorSource = Omit<CalculatorDefinition, 'href'>

export const CALCULATORS_BASE_PATH = '/calculators'

export function calculatorHref(slug: string): string {
  return `${CALCULATORS_BASE_PATH}/${slug}`
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export const categories: readonly CalculatorCategory[] = [
  {
    id: 'math',
    name: 'Math Calculators',
    description: 'Everyday math made simple.',
    icon: Calculator,
  },
  {
    id: 'finance',
    name: 'Financial Calculators',
    description: 'Make smarter money decisions.',
    icon: DollarSign,
  },
  {
    id: 'health',
    name: 'Health Calculators',
    description: 'Understand your health numbers.',
    icon: HeartPulse,
  },
  {
    id: 'home',
    name: 'Home & Living',
    description: 'Plan projects with confidence.',
    icon: Home,
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Learn and solve step by step.',
    icon: GraduationCap,
  },
  {
    id: 'date-time',
    name: 'Date & Time',
    description: 'Work out dates, ages, and durations.',
    icon: CalendarClock,
  },
  {
    id: 'everyday',
    name: 'Everyday Tools',
    description: 'Quick answers for daily decisions.',
    icon: ShoppingBasket,
  },
]

// ---------------------------------------------------------------------------
// Calculators
// ---------------------------------------------------------------------------

const calculatorDefinitions: readonly CalculatorSource[] = [
  {
    name: 'Percentage Calculator',
    slug: 'percentage-calculator',
    description: 'Calculate percentages, increases, decreases, and more.',
    category: 'math',
    icon: Percent,
    popular: true,
    status: 'live',
  },
  {
    name: 'Tip Calculator',
    slug: 'tip-calculator',
    description: 'Split bills and calculate tips in seconds.',
    category: 'finance',
    icon: Receipt,
    popular: true,
    status: 'live',
  },
  {
    name: 'Discount Calculator',
    slug: 'discount-calculator',
    description: 'Work out sale prices and how much you save.',
    category: 'finance',
    icon: Tag,
    popular: true,
    status: 'live',
  },
  {
    name: 'Average Calculator',
    slug: 'average-calculator',
    description: 'Find the mean, sum, and count of any list of numbers.',
    category: 'math',
    icon: Sigma,
    popular: false,
    status: 'live',
  },
  {
    name: 'Percentage Change Calculator',
    slug: 'percentage-change-calculator',
    description: 'Measure the increase or decrease between two values.',
    category: 'math',
    icon: TrendingUp,
    popular: true,
    status: 'live',
  },
  {
    name: 'Fraction Calculator',
    slug: 'fraction-calculator',
    description: 'Add, subtract, multiply, and divide fractions exactly.',
    category: 'math',
    icon: Divide,
    popular: false,
    status: 'live',
  },
  {
    name: 'Ratio Calculator',
    slug: 'ratio-calculator',
    description: 'Scale a ratio to a known value and simplify it.',
    category: 'math',
    icon: Ratio,
    popular: false,
    status: 'live',
  },
  {
    name: 'Profit Margin Calculator',
    slug: 'profit-margin-calculator',
    description: 'Turn revenue and cost into profit and margin.',
    category: 'finance',
    icon: PiggyBank,
    popular: false,
    status: 'live',
  },
  {
    name: 'Simple Interest Calculator',
    slug: 'simple-interest-calculator',
    description: 'Work out interest and the total owed over time.',
    category: 'finance',
    icon: Landmark,
    popular: false,
    status: 'live',
  },
  {
    name: 'Unit Converter',
    slug: 'unit-converter',
    description: 'Convert length, weight, temperature, and volume units.',
    category: 'everyday',
    icon: ArrowRightLeft,
    popular: true,
    status: 'live',
  },
  {
    name: 'BMI Calculator',
    slug: 'bmi-calculator',
    description: 'Check your body mass index and healthy range.',
    category: 'health',
    icon: HeartPulse,
    popular: true,
    status: 'planned',
  },
  {
    name: 'Mortgage Calculator',
    slug: 'mortgage-calculator',
    description: 'Estimate monthly payments for your next home.',
    category: 'finance',
    icon: Home,
    popular: true,
    status: 'planned',
  },
  {
    name: 'Age Calculator',
    slug: 'age-calculator',
    description: 'Find your exact age in years, months, and days.',
    category: 'math',
    icon: Calculator,
    popular: false,
    status: 'planned',
  },
  {
    name: 'Grade Calculator',
    slug: 'grade-calculator',
    description: 'Calculate grades and what you need on your final.',
    category: 'education',
    icon: GraduationCap,
    popular: false,
    status: 'planned',
  },
]

export const calculators: readonly CalculatorDefinition[] = calculatorDefinitions.map(
  (definition) => ({ ...definition, href: calculatorHref(definition.slug) }),
)

// ---------------------------------------------------------------------------
// Derived collections and lookups
// ---------------------------------------------------------------------------

export const liveCalculators: readonly CalculatorDefinition[] = calculators.filter(
  (calculator) => calculator.status === 'live',
)

export const plannedCalculators: readonly CalculatorDefinition[] = calculators.filter(
  (calculator) => calculator.status === 'planned',
)

export const popularCalculators: readonly CalculatorDefinition[] = calculators.filter(
  (calculator) => calculator.popular,
)

export const popularLiveCalculators: readonly CalculatorDefinition[] = liveCalculators.filter(
  (calculator) => calculator.popular,
)

export function getCalculatorBySlug(slug: string): CalculatorDefinition | undefined {
  return calculators.find((calculator) => calculator.slug === slug)
}

export function getCategory(id: CalculatorCategoryId): CalculatorCategory | undefined {
  return categories.find((category) => category.id === id)
}

/** Human-readable label for a category id, safe to render directly. */
export function getCategoryName(id: CalculatorCategoryId): string {
  return getCategory(id)?.name ?? id
}

export function getCalculatorsByCategory(
  id: CalculatorCategoryId,
): readonly CalculatorDefinition[] {
  return calculators.filter((calculator) => calculator.category === id)
}

export function countLiveInCategory(id: CalculatorCategoryId): number {
  return liveCalculators.filter((calculator) => calculator.category === id).length
}

export interface CategoryWithCount extends CalculatorCategory {
  liveCount: number
  plannedCount: number
  /** Ready-to-render label, e.g. "1 calculator" or "Coming soon". */
  countLabel: string
}

/** Categories with counts computed from the registry — never hardcoded. */
export const categoriesWithCounts: readonly CategoryWithCount[] = categories.map((category) => {
  const inCategory = getCalculatorsByCategory(category.id)
  const liveCount = inCategory.filter((calculator) => calculator.status === 'live').length
  const plannedCount = inCategory.length - liveCount

  return {
    ...category,
    liveCount,
    plannedCount,
    countLabel:
      liveCount === 0
        ? 'Coming soon'
        : `${liveCount} calculator${liveCount === 1 ? '' : 's'}`,
  }
})

/**
 * Categories that currently hold at least one registered calculator. A new
 * category appears on the homepage automatically as soon as a calculator is
 * assigned to it, so empty placeholder cards never ship.
 */
export const activeCategories: readonly CategoryWithCount[] = categoriesWithCounts.filter(
  (category) => category.liveCount + category.plannedCount > 0,
)

/**
 * Live calculators related to `slug`: same category first, then other popular
 * live calculators as filler. Never returns planned calculators.
 */
export function getRelatedCalculators(slug: string, limit = 4): readonly CalculatorDefinition[] {
  const current = getCalculatorBySlug(slug)
  const candidates = liveCalculators.filter((calculator) => calculator.slug !== slug)

  if (!current) return candidates.slice(0, limit)

  const sameCategory = candidates.filter(
    (calculator) => calculator.category === current.category,
  )
  const others = candidates.filter((calculator) => calculator.category !== current.category)

  return [...sameCategory, ...others].slice(0, limit)
}

/**
 * Lightweight client-side search over name, description and category label.
 * Live calculators are ranked above planned ones so the useful tools surface
 * first; callers decide how (or whether) to present planned results.
 */
export function searchCalculators(query: string, limit = 6): readonly CalculatorDefinition[] {
  const term = query.trim().toLowerCase()
  if (!term) return []

  const matches = calculators.filter((calculator) => {
    const haystack = [
      calculator.name,
      calculator.description,
      getCategoryName(calculator.category),
      calculator.category,
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(term)
  })

  return matches
    .slice()
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === 'live' ? -1 : 1
      const aStarts = a.name.toLowerCase().startsWith(term)
      const bStarts = b.name.toLowerCase().startsWith(term)
      if (aStarts !== bStarts) return aStarts ? -1 : 1
      return a.name.localeCompare(b.name)
    })
    .slice(0, limit)
}
