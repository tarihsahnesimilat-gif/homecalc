import {
  Apple,
  ArrowRightLeft,
  ArrowLeftRight,
  ArrowUpRight,
  BadgePercent,
  Banknote,
  Blocks,
  Briefcase,
  Cake,
  Calculator,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  CalendarPlus,
  ChartLine,
  ChartPie,
  Clock,
  Coins,
  Divide,
  DollarSign,
  Flame,
  Footprints,
  Fuel,
  GraduationCap,
  Globe,
  HandCoins,
  Hash,
  Hourglass,
  HeartPulse,
  Home,
  LandPlot,
  Landmark,
  Layers,
  Percent,
  PiggyBank,
  Ratio,
  Receipt,
  ReceiptText,
  Salad,
  Scale,
  SquareRadical,
  Superscript,
  ShoppingBasket,
  ShoppingCart,
  Sigma,
  Tag,
  Target,
  Timer,
  TrendingUp,
  TrendingUpDown,
  Wallet,
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
  /** Also the URL slug: /calculators/<id>. */
  id: CalculatorCategoryId
  name: string
  description: string
  icon: LucideIcon
  seoTitle: string
  seoDescription: string
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
  /**
   * Slugs to surface first in related calculators, for pairings that matter
   * more than category order. Category-mates fill any remaining slots.
   */
  related?: readonly string[]
  /**
   * Search aliases — the words people actually type. Used by search only and
   * never rendered, so they cannot turn into keyword-stuffed page copy.
   */
  keywords?: readonly string[]
}

/** Everything except `href`, which is derived from the slug. */
type CalculatorSource = Omit<CalculatorDefinition, 'href'>

export const CALCULATORS_BASE_PATH = '/calculators'

export function calculatorHref(slug: string): string {
  return `${CALCULATORS_BASE_PATH}/${slug}`
}

/** The directory listing every live calculator. */
export const CALCULATORS_DIRECTORY_PATH = CALCULATORS_BASE_PATH

/**
 * A category page lives at /calculators/<id>.
 *
 * Category ids and calculator slugs share this namespace, so a category id must
 * never collide with a calculator slug. `categoryIdsAreDistinctFromSlugs` in the
 * test suite enforces that.
 */
export function categoryHref(id: CalculatorCategoryId): string {
  return `${CALCULATORS_BASE_PATH}/${id}`
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
    seoTitle: 'Math Calculators — Percentages, Fractions, Ratios and More',
    seoDescription:
      'Free math calculators for percentages, fractions, ratios, averages and scientific work. Every tool runs in your browser with no sign-up.',
  },
  {
    id: 'finance',
    name: 'Financial Calculators',
    description: 'Make smarter money decisions.',
    icon: DollarSign,
    seoTitle: 'Financial Calculators — Loans, Interest, Tips and Margins',
    seoDescription:
      'Free finance calculators for loan repayments, compound and simple interest, tips, discounts, profit margin and return on investment.',
  },
  {
    id: 'health',
    name: 'Health Calculators',
    description: 'Understand your health numbers.',
    icon: HeartPulse,
    seoTitle: 'Health Calculators — BMI, BMR and Daily Calories',
    seoDescription:
      'Free health calculators for body mass index, basal metabolic rate and estimated daily calorie needs. Informational tools, not medical advice.',
  },
  {
    id: 'home',
    name: 'Home & Living',
    description: 'Plan projects with confidence.',
    icon: Home,
    seoTitle: 'Home & Living Calculators',
    seoDescription:
      'Free home and living calculators for planning work around the house. Work out the area and square footage of a room before you order materials.',
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Learn and solve step by step.',
    icon: GraduationCap,
    seoTitle: 'Education Calculators — Grades and Study Tools',
    seoDescription:
      'Calculators for grades and coursework. More study tools are on the way.',
  },
  {
    id: 'date-time',
    name: 'Date & Time',
    description: 'Work out dates, ages, and durations.',
    icon: CalendarClock,
    seoTitle: 'Date and Time Calculators — Age, Durations and Day Counts',
    seoDescription:
      'Free date calculators for working out an exact age, the gap between two dates, and counting days, weeks and months.',
  },
  {
    id: 'everyday',
    name: 'Everyday Tools',
    description: 'Quick answers for daily decisions.',
    icon: ShoppingBasket,
    seoTitle: 'Everyday Calculators — Unit Conversion and Quick Answers',
    seoDescription:
      'Free everyday calculators, including a unit converter for length, weight, temperature and volume measurements.',
  },
]

// ---------------------------------------------------------------------------
// Calculators
// ---------------------------------------------------------------------------

const calculatorDefinitions: readonly CalculatorSource[] = [
  {
    name: 'Percentage Calculator',
    slug: 'percentage-calculator',
    keywords: [
      'percent',
      'percentage',
      'percent calculator',
      'percentage increase',
      'percentage decrease',
    ],
    description: 'Calculate percentages, increases, decreases, and more.',
    category: 'math',
    icon: Percent,
    popular: true,
    status: 'live',
  },
  {
    name: 'Tip Calculator',
    slug: 'tip-calculator',
    keywords: ['tip', 'gratuity', 'split the bill', 'bill split', 'service charge'],
    description: 'Split bills and calculate tips in seconds.',
    category: 'finance',
    icon: Receipt,
    popular: true,
    status: 'live',
  },
  {
    name: 'Discount Calculator',
    slug: 'discount-calculator',
    keywords: ['discount', 'sale price', 'percent off', 'markdown', 'how much you save'],
    description: 'Work out sale prices and how much you save.',
    category: 'finance',
    icon: Tag,
    popular: true,
    status: 'live',
  },
  {
    name: 'Average Calculator',
    slug: 'average-calculator',
    keywords: ['average', 'mean', 'arithmetic mean', 'sum of numbers', 'add up numbers'],
    description: 'Find the mean, sum, and count of any list of numbers.',
    category: 'math',
    icon: Sigma,
    popular: false,
    status: 'live',
  },
  {
    name: 'Percentage Change Calculator',
    slug: 'percentage-change-calculator',
    keywords: [
      'percentage change',
      'percent increase',
      'percent decrease',
      'increase or decrease',
      'change between two numbers',
    ],
    description: 'Measure the increase or decrease between two values.',
    category: 'math',
    icon: TrendingUp,
    popular: true,
    status: 'live',
  },
  {
    name: 'Fraction Calculator',
    slug: 'fraction-calculator',
    keywords: ['fraction', 'fractions', 'add fractions', 'simplify fraction', 'lowest terms'],
    description: 'Add, subtract, multiply, and divide fractions exactly.',
    category: 'math',
    icon: Divide,
    popular: false,
    status: 'live',
  },
  {
    name: 'Ratio Calculator',
    slug: 'ratio-calculator',
    keywords: ['ratio', 'proportion', 'scale a ratio', 'simplify ratio', 'aspect ratio'],
    description: 'Scale a ratio to a known value and simplify it.',
    category: 'math',
    icon: Ratio,
    popular: false,
    status: 'live',
  },
  {
    name: 'Profit Margin Calculator',
    slug: 'profit-margin-calculator',
    keywords: ['profit margin', 'margin', 'gross margin', 'net margin', 'profit'],
    description: 'Turn revenue and cost into profit and margin.',
    category: 'finance',
    icon: PiggyBank,
    popular: false,
    status: 'live',
  },
  {
    name: 'Simple Interest Calculator',
    slug: 'simple-interest-calculator',
    keywords: ['simple interest', 'flat interest', 'principal rate time', 'non-compounding interest'],
    description: 'Work out interest and the total owed over time.',
    category: 'finance',
    icon: Landmark,
    popular: false,
    status: 'live',
  },
  {
    name: 'Unit Converter',
    slug: 'unit-converter',
    keywords: [
      'unit converter',
      'convert units',
      'metric to imperial',
      'length weight volume',
      'temperature conversion',
    ],
    description: 'Convert length, weight, temperature, and volume units.',
    category: 'everyday',
    icon: ArrowRightLeft,
    popular: true,
    status: 'live',
  },
  {
    name: 'Markup Calculator',
    slug: 'markup-calculator',
    description: 'Add a markup to cost and see the margin it really gives.',
    category: 'finance',
    icon: ArrowUpRight,
    popular: true,
    status: 'live',
    related: ['profit-margin-calculator', 'sales-tax-calculator', 'commission-calculator'],
    keywords: [
      'markup calculator',
      'markup',
      'markup percentage',
      'cost plus pricing',
      'markup vs margin',
    ],
  },
  {
    name: 'Loan Interest Calculator',
    slug: 'loan-interest-calculator',
    description: 'See what a loan costs in interest and how it is front-loaded.',
    category: 'finance',
    icon: HandCoins,
    popular: false,
    status: 'live',
    related: ['loan-payment-calculator', 'mortgage-calculator', 'debt-payoff-calculator'],
    keywords: [
      'loan interest calculator',
      'total loan interest',
      'interest on a loan',
      'interest and principal split',
    ],
  },
  {
    name: 'Future Value Calculator',
    slug: 'future-value-calculator',
    description: 'Grow a sum forward, or discount a future sum to today.',
    category: 'finance',
    icon: Hourglass,
    popular: true,
    status: 'live',
    related: ['compound-interest-calculator', 'investment-calculator', 'savings-calculator'],
    keywords: [
      'future value calculator',
      'present value',
      'time value of money',
      'discount to present value',
      'future worth',
    ],
  },
  {
    name: 'Price per Unit Calculator',
    slug: 'price-per-unit-calculator',
    description: 'Compare two pack sizes to find the better value.',
    category: 'everyday',
    icon: ShoppingCart,
    popular: true,
    status: 'live',
    related: ['unit-converter', 'discount-calculator', 'percentage-calculator'],
    keywords: [
      'price per unit',
      'unit price calculator',
      'cost per unit',
      'compare pack sizes',
      'which is cheaper',
    ],
  },
  {
    name: 'Percentage Point Calculator',
    slug: 'percentage-point-calculator',
    description: 'Tell percentage points apart from percentage change.',
    category: 'math',
    icon: ChartPie,
    popular: false,
    status: 'live',
    related: [
      'percentage-change-calculator',
      'percentage-difference-calculator',
      'percentage-calculator',
    ],
    keywords: [
      'percentage point',
      'percentage points',
      'percentage point change',
      'points vs percent',
      'basis points',
    ],
  },
  {
    name: 'Ratio to Percentage Calculator',
    slug: 'ratio-to-percentage-calculator',
    description: 'Turn a ratio into the percentage share of each part.',
    category: 'math',
    icon: Layers,
    popular: false,
    status: 'live',
    related: ['ratio-calculator', 'fraction-calculator', 'percentage-calculator'],
    keywords: [
      'ratio to percentage',
      'convert ratio to percent',
      'ratio percentage calculator',
      'share of the whole',
    ],
  },
  {
    name: 'Pace Calculator',
    slug: 'pace-calculator',
    description: 'Work out running pace per kilometre or mile, and speed.',
    category: 'health',
    icon: Footprints,
    popular: true,
    status: 'live',
    related: ['calorie-calculator', 'bmr-calculator', 'time-duration-calculator'],
    keywords: [
      'pace calculator',
      'running pace',
      'pace per mile',
      'pace per km',
      'race pace',
      'min per km',
    ],
  },
  {
    name: 'Calorie Deficit Calculator',
    slug: 'calorie-deficit-calculator',
    description: 'Turn a daily deficit into a projected weekly change.',
    category: 'health',
    icon: Salad,
    popular: true,
    status: 'live',
    related: ['calorie-calculator', 'bmr-calculator', 'bmi-calculator'],
    keywords: [
      'calorie deficit',
      'calorie deficit calculator',
      'weight loss calories',
      'daily deficit',
      'cutting calories',
    ],
  },
  {
    name: 'Hours Calculator',
    slug: 'hours-calculator',
    description: 'Add up several time entries into a weekly total.',
    category: 'date-time',
    icon: Timer,
    popular: true,
    status: 'live',
    related: ['work-hours-calculator', 'time-duration-calculator', 'time-zone-converter'],
    keywords: [
      'hours calculator',
      'add up hours',
      'total hours worked',
      'weekly timesheet',
      'sum time entries',
    ],
  },
  {
    name: 'Area Calculator',
    slug: 'area-calculator',
    description: 'Find the area of a rectangle, circle, or triangle.',
    category: 'home',
    icon: LandPlot,
    popular: true,
    status: 'live',
    related: ['concrete-calculator', 'unit-converter', 'price-per-unit-calculator'],
    keywords: [
      'area calculator',
      'square footage',
      'room area',
      'area of a circle',
      'area of a triangle',
      'floor area',
    ],
  },
  {
    name: 'BMI Calculator',
    slug: 'bmi-calculator',
    keywords: ['bmi', 'body mass index', 'body mass', 'height and weight'],
    description: 'Check your body mass index against the standard categories.',
    category: 'health',
    icon: Scale,
    popular: true,
    status: 'live',
    related: ['bmr-calculator', 'calorie-calculator'],
  },
  {
    name: 'BMR Calculator',
    slug: 'bmr-calculator',
    keywords: [
      'bmr',
      'basal metabolic rate',
      'resting metabolism',
      'metabolic rate',
      'mifflin st jeor',
    ],
    description: 'Estimate the calories your body uses at rest.',
    category: 'health',
    icon: Flame,
    popular: false,
    status: 'live',
    related: ['calorie-calculator', 'bmi-calculator'],
  },
  {
    name: 'Calorie Calculator',
    slug: 'calorie-calculator',
    keywords: [
      'calorie',
      'calories',
      'tdee',
      'daily calories',
      'energy needs',
      'maintenance calories',
    ],
    description: 'Estimate daily calorie needs from BMR and activity.',
    category: 'health',
    icon: Apple,
    popular: true,
    status: 'live',
    related: ['bmr-calculator', 'bmi-calculator'],
  },
  {
    name: 'Compound Interest Calculator',
    slug: 'compound-interest-calculator',
    keywords: [
      'compound interest',
      'compounding',
      'interest on interest',
      'savings growth',
      'future value',
    ],
    description: 'Project how a balance grows as interest earns interest.',
    category: 'finance',
    icon: Coins,
    popular: true,
    status: 'live',
    related: ['simple-interest-calculator', 'loan-payment-calculator'],
  },
  {
    name: 'Loan Payment Calculator',
    slug: 'loan-payment-calculator',
    keywords: ['loan', 'monthly payment', 'loan repayment', 'amortization', 'repayment schedule'],
    description: 'Estimate monthly repayments and the total interest on a loan.',
    category: 'finance',
    icon: Banknote,
    popular: true,
    status: 'live',
    related: ['compound-interest-calculator', 'simple-interest-calculator'],
  },
  {
    name: 'ROI Calculator',
    slug: 'roi-calculator',
    keywords: ['roi', 'return on investment', 'investment return', 'gain percentage'],
    description: 'Turn an investment and its final value into a return percentage.',
    category: 'finance',
    icon: ChartLine,
    popular: false,
    status: 'live',
    related: ['profit-margin-calculator', 'compound-interest-calculator'],
  },
  {
    name: 'Scientific Calculator',
    slug: 'scientific-calculator',
    keywords: [
      'scientific calculator',
      'trigonometry',
      'sin cos tan',
      'advanced calculator',
      'calculator with brackets',
    ],
    description: 'Powers, roots, trigonometry, and constants with full precedence.',
    category: 'math',
    icon: Calculator,
    popular: true,
    status: 'live',
    related: ['percentage-calculator', 'fraction-calculator', 'ratio-calculator'],
  },
  {
    name: 'Percentage of Number Calculator',
    slug: 'percentage-of-number-calculator',
    description: 'Work out what a percentage of any number comes to.',
    category: 'math',
    icon: BadgePercent,
    popular: true,
    status: 'live',
    related: ['percentage-calculator', 'percentage-change-calculator', 'discount-calculator'],
    keywords: [
      'percent of',
      'percentage of',
      'what is x percent of',
      'percentage of a number',
      'calculate percent',
    ],
  },
  {
    name: 'GCF and LCM Calculator',
    slug: 'gcf-lcm-calculator',
    description: 'Find the greatest common factor and least common multiple.',
    category: 'math',
    icon: Hash,
    popular: false,
    status: 'live',
    related: ['fraction-calculator', 'ratio-calculator', 'percentage-calculator'],
    keywords: [
      'gcd',
      'gcf',
      'greatest common factor',
      'greatest common divisor',
      'least common multiple',
      'lcm',
    ],
  },
  {
    name: 'Exponent Calculator',
    slug: 'exponent-calculator',
    description: 'Raise any number to a power, including negative exponents.',
    category: 'math',
    icon: Superscript,
    popular: false,
    status: 'live',
    related: ['scientific-calculator', 'square-root-calculator'],
    keywords: [
      'power calculator',
      'exponent',
      'powers',
      'x to the power',
      'raise to a power',
    ],
  },
  {
    name: 'Square Root Calculator',
    slug: 'square-root-calculator',
    description: 'Find the square root of any positive number.',
    category: 'math',
    icon: SquareRadical,
    popular: false,
    status: 'live',
    related: ['exponent-calculator', 'scientific-calculator'],
    keywords: ['sqrt', 'square root', 'root calculator', 'square root calculator'],
  },
  {
    name: 'Sales Tax Calculator',
    slug: 'sales-tax-calculator',
    description: 'Add tax to a price, or work backwards from a total.',
    category: 'finance',
    icon: ReceiptText,
    popular: true,
    status: 'live',
    related: ['discount-calculator', 'percentage-calculator', 'profit-margin-calculator'],
    keywords: [
      'sales tax',
      'tax calculator',
      'tax on price',
      'sales tax calculator',
      'calculate tax',
      'vat',
    ],
  },
  {
    name: 'Investment Calculator',
    slug: 'investment-calculator',
    description: 'Project savings growth with regular monthly contributions.',
    category: 'finance',
    icon: Wallet,
    popular: true,
    status: 'live',
    related: ['compound-interest-calculator', 'roi-calculator', 'simple-interest-calculator'],
    keywords: [
      'investment calculator',
      'investment growth',
      'future investment value',
      'savings with contributions',
      'compound savings',
    ],
  },
  {
    name: 'Break-Even Calculator',
    slug: 'break-even-calculator',
    description: 'Find how many units cover your fixed costs.',
    category: 'finance',
    icon: Target,
    popular: false,
    status: 'live',
    related: ['profit-margin-calculator', 'roi-calculator', 'sales-tax-calculator'],
    keywords: [
      'break even',
      'break even point',
      'break even analysis',
      'break even calculator',
      'breakeven',
      'contribution margin',
    ],
  },
  {
    name: 'Fuel Cost Calculator',
    slug: 'fuel-cost-calculator',
    description: 'Estimate the fuel a trip needs and what it will cost.',
    category: 'everyday',
    icon: Fuel,
    popular: true,
    status: 'live',
    related: ['unit-converter', 'time-duration-calculator'],
    keywords: [
      'fuel cost',
      'gas cost',
      'trip fuel cost',
      'fuel calculator',
      'road trip fuel cost',
      'petrol cost',
    ],
  },
  {
    name: 'Time Duration Calculator',
    slug: 'time-duration-calculator',
    description: 'Measure the time between two clock times, past midnight included.',
    category: 'date-time',
    icon: Clock,
    popular: true,
    status: 'live',
    related: [
      'work-hours-calculator',
      'days-between-dates-calculator',
      'date-difference-calculator',
    ],
    keywords: [
      'time duration',
      'time difference',
      'hours between',
      'elapsed time',
      'duration calculator',
      'time calculator',
    ],
  },
  {
    name: 'Work Hours Calculator',
    slug: 'work-hours-calculator',
    description: 'Work out hours on shift after deducting a break.',
    category: 'date-time',
    icon: Briefcase,
    popular: false,
    status: 'live',
    related: ['time-duration-calculator', 'date-difference-calculator'],
    keywords: [
      'work hours',
      'working hours',
      'hours worked',
      'work time calculator',
      'shift hours',
      'timesheet calculator',
    ],
  },
  {
    name: 'Percentage Difference Calculator',
    slug: 'percentage-difference-calculator',
    description: 'Compare two numbers without treating either as the baseline.',
    category: 'math',
    icon: TrendingUpDown,
    popular: false,
    status: 'live',
    related: [
      'percentage-calculator',
      'percentage-change-calculator',
      'percentage-of-number-calculator',
    ],
    keywords: [
      'percentage difference',
      'percent difference',
      'percentage difference calculator',
      'difference between two numbers',
    ],
  },
  {
    name: 'Savings Calculator',
    slug: 'savings-calculator',
    description: 'See how a balance grows with regular deposits.',
    category: 'finance',
    icon: PiggyBank,
    popular: true,
    status: 'live',
    related: [
      'compound-interest-calculator',
      'investment-calculator',
      'simple-interest-calculator',
    ],
    keywords: [
      'savings calculator',
      'savings account calculator',
      'savings interest calculator',
      'save money over time',
    ],
  },
  {
    name: 'Commission Calculator',
    slug: 'commission-calculator',
    description: 'Work out commission on a sale and what is left after it.',
    category: 'finance',
    icon: Percent,
    popular: false,
    status: 'live',
    related: ['profit-margin-calculator', 'percentage-calculator', 'sales-tax-calculator'],
    keywords: [
      'commission calculator',
      'sales commission',
      'commission rate',
      'sales commission calculator',
    ],
  },
  {
    name: 'Debt Payoff Calculator',
    slug: 'debt-payoff-calculator',
    description: 'Estimate how long a balance takes to clear, and what it costs.',
    category: 'finance',
    icon: TrendingUp,
    popular: true,
    status: 'live',
    related: [
      'loan-payment-calculator',
      'compound-interest-calculator',
      'simple-interest-calculator',
    ],
    keywords: [
      'debt payoff calculator',
      'debt calculator',
      'credit card payoff',
      'payoff calculator',
      'debt repayment calculator',
    ],
  },
  {
    name: 'Currency Converter',
    slug: 'currency-converter',
    description: 'Convert an amount using an exchange rate you supply.',
    category: 'everyday',
    icon: ArrowLeftRight,
    popular: true,
    status: 'live',
    related: ['unit-converter', 'percentage-calculator'],
    keywords: [
      'currency converter',
      'currency conversion',
      'exchange rate calculator',
      'convert currency',
    ],
  },
  {
    name: 'Concrete Calculator',
    slug: 'concrete-calculator',
    description: 'Estimate the concrete a slab needs, with a waste allowance.',
    category: 'everyday',
    icon: Blocks,
    popular: false,
    status: 'live',
    related: ['unit-converter', 'fuel-cost-calculator'],
    keywords: [
      'concrete calculator',
      'concrete volume',
      'concrete yard calculator',
      'how much concrete do i need',
      'slab calculator',
    ],
  },
  {
    name: 'Date Calculator',
    slug: 'date-calculator',
    description: 'Add or subtract days from a date to find another.',
    category: 'date-time',
    icon: CalendarPlus,
    popular: true,
    status: 'live',
    related: [
      'days-between-dates-calculator',
      'date-difference-calculator',
      'age-calculator',
    ],
    keywords: [
      'date calculator',
      'add days to date',
      'subtract days from date',
      'date addition calculator',
      'days from today',
    ],
  },
  {
    name: 'Time Zone Converter',
    slug: 'time-zone-converter',
    description: 'Convert a date and time between world time zones.',
    category: 'date-time',
    icon: Globe,
    popular: true,
    status: 'live',
    related: ['time-duration-calculator', 'work-hours-calculator', 'date-calculator'],
    keywords: [
      'time zone converter',
      'timezone converter',
      'time conversion',
      'convert time zones',
      'world clock',
    ],
  },
  {
    name: 'Mortgage Calculator',
    slug: 'mortgage-calculator',
    keywords: [
      'mortgage',
      'mortgage calculator',
      'mortgage payment',
      'monthly mortgage payment',
      'home loan calculator',
      'house payment',
    ],
    description: 'Estimate a monthly mortgage payment after your deposit.',
    category: 'finance',
    icon: Home,
    popular: true,
    status: 'live',
    related: ['loan-payment-calculator', 'compound-interest-calculator', 'savings-calculator'],
  },
  {
    name: 'Age Calculator',
    slug: 'age-calculator',
    keywords: ['age', 'how old am i', 'date of birth', 'birthday', 'exact age'],
    description: 'Find an exact age in years, months, and days.',
    category: 'date-time',
    icon: Cake,
    popular: true,
    status: 'live',
    related: ['date-difference-calculator', 'days-between-dates-calculator'],
  },
  {
    name: 'Date Difference Calculator',
    slug: 'date-difference-calculator',
    keywords: [
      'date difference',
      'between two dates',
      'time between dates',
      'duration between dates',
    ],
    description: 'Measure the gap between two dates in years, months, and days.',
    category: 'date-time',
    icon: CalendarDays,
    popular: false,
    status: 'live',
    related: ['days-between-dates-calculator', 'age-calculator'],
  },
  {
    name: 'Days Between Dates Calculator',
    slug: 'days-between-dates-calculator',
    keywords: ['days between dates', 'day count', 'count days', 'number of days'],
    description: 'Count the days, weeks, and remaining days between two dates.',
    category: 'date-time',
    icon: CalendarRange,
    popular: false,
    status: 'live',
    related: ['date-difference-calculator', 'age-calculator'],
  },
  {
    name: 'Grade Calculator',
    slug: 'grade-calculator',
    keywords: [
      'grade calculator',
      'grade percentage',
      'test grade',
      'exam grade',
      'calculate grade',
      'exam score',
    ],
    description: 'Turn points earned into a percentage and a letter grade.',
    category: 'math',
    icon: GraduationCap,
    popular: true,
    status: 'live',
    related: ['percentage-calculator', 'average-calculator', 'percentage-change-calculator'],
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
 * Categories with at least one live calculator.
 *
 * These are exactly the categories that get a page, appear in the sitemap and
 * are safe to link to. A category holding only planned calculators is listed on
 * the homepage as "Coming soon" but never linked.
 */
export const categoriesWithLiveCalculators: readonly CategoryWithCount[] =
  categoriesWithCounts.filter((category) => category.liveCount > 0)

export function getLiveCalculatorsByCategory(
  id: CalculatorCategoryId,
): readonly CalculatorDefinition[] {
  return liveCalculators.filter((calculator) => calculator.category === id)
}

/** Live calculators grouped by category, in registry order, for the directory. */
export function groupLiveCalculatorsByCategory(): readonly {
  category: CategoryWithCount
  calculators: readonly CalculatorDefinition[]
}[] {
  return categoriesWithLiveCalculators.map((category) => ({
    category,
    calculators: getLiveCalculatorsByCategory(category.id),
  }))
}

/**
 * Live calculators related to `slug`: same category first, then other popular
 * live calculators as filler. Never returns planned calculators.
 */
/** Never leave a calculator with fewer than this many onward links. */
const MINIMUM_RELATED = 2

export function getRelatedCalculators(slug: string, limit = 4): readonly CalculatorDefinition[] {
  const current = getCalculatorBySlug(slug)
  const candidates = liveCalculators.filter((calculator) => calculator.slug !== slug)

  if (!current) return candidates.slice(0, limit)

  // Curated pairings first, then category-mates, then anything else live.
  const curated = (current.related ?? [])
    .map((relatedSlug) => candidates.find((calculator) => calculator.slug === relatedSlug))
    .filter((calculator): calculator is CalculatorDefinition => calculator !== undefined)

  const sameCategory = candidates.filter(
    (calculator) => calculator.category === current.category,
  )
  const others = candidates.filter((calculator) => calculator.category !== current.category)

  const seen = new Set<string>()
  const dedupe = (list: readonly CalculatorDefinition[]) =>
    list.filter((calculator) => {
      if (seen.has(calculator.slug)) return false
      seen.add(calculator.slug)
      return true
    })

  // Curated pairings and category-mates are the only genuinely relevant
  // suggestions, so the list stops there rather than padding to `limit` with
  // whatever happens to come next in the registry.
  const relevant = dedupe([...curated, ...sameCategory]).slice(0, limit)
  if (relevant.length >= MINIMUM_RELATED) return relevant

  // A calculator alone in its category would otherwise be a dead end, so top
  // up to the minimum with popular calculators from elsewhere.
  const fallback = dedupe(
    others.slice().sort((a, b) => Number(b.popular) - Number(a.popular)),
  )

  return [...relevant, ...fallback].slice(0, MINIMUM_RELATED)
}

/**
 * Lightweight client-side search over name, description and category label.
 * Live calculators are ranked above planned ones so the useful tools surface
 * first; callers decide how (or whether) to present planned results.
 */
/**
 * Ranks a calculator against a search term. Lower is better; `null` means no
 * match at all.
 *
 * The order is deliberate: an exact name wins, then an exact alias, then a name
 * that starts with the term, then anything containing it. Everything is a plain
 * string comparison, so results are deterministic and no search dependency is
 * needed.
 */
function searchRank(calculator: CalculatorDefinition, term: string): number | null {
  const name = calculator.name.toLowerCase()
  const keywords = (calculator.keywords ?? []).map((keyword) => keyword.toLowerCase())

  if (name === term) return 0
  if (keywords.includes(term)) return 1
  if (name.startsWith(term)) return 2
  if (name.includes(term)) return 3
  if (keywords.some((keyword) => keyword.includes(term))) return 4

  const haystack = [
    calculator.description,
    getCategoryName(calculator.category),
    calculator.category,
  ]
    .join(' ')
    .toLowerCase()

  return haystack.includes(term) ? 5 : null
}

/**
 * Search across name, aliases, description and category.
 *
 * Live calculators always rank above planned ones, so the results people can
 * actually use come first.
 */
export function searchCalculators(query: string, limit = 6): readonly CalculatorDefinition[] {
  const term = query.trim().toLowerCase()
  if (!term) return []

  const ranked = calculators
    .map((calculator) => ({ calculator, rank: searchRank(calculator, term) }))
    .filter(
      (entry): entry is { calculator: CalculatorDefinition; rank: number } => entry.rank !== null,
    )

  return ranked
    .sort((a, b) => {
      if (a.calculator.status !== b.calculator.status) {
        return a.calculator.status === 'live' ? -1 : 1
      }
      if (a.rank !== b.rank) return a.rank - b.rank
      return a.calculator.name.localeCompare(b.calculator.name)
    })
    .slice(0, limit)
    .map((entry) => entry.calculator)
}
