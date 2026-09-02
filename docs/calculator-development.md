# Adding a calculator

CalculatorHub derives most of a calculator's surface area from two registries.
Adding one is four files plus a test — nothing else needs editing.

## The layers

```
lib/calculators.ts          metadata: name, slug, category, status, icon
lib/calculator-content/     SEO copy, intro, how-to, formulas, examples, FAQs
lib/calculations/           pure maths + validation, no React
app/calculators/<slug>/     page (server, owns metadata) + form (client, owns state)
components/calculator/      shared presentation primitives
```

The rule that keeps this scalable: **calculation logic never lives in a
component**. Everything under `lib/calculations/` is plain TypeScript with no
React import, which is what makes it directly unit-testable.

## Steps

### 1. Register the calculator

Add one entry to `calculatorDefinitions` in `lib/calculators.ts`:

```ts
{
  name: 'Loan Calculator',
  slug: 'loan-calculator',
  description: 'Work out repayments over the life of a loan.',
  category: 'finance',
  icon: Landmark,
  popular: false,
  status: 'planned',   // flip to 'live' once the route exists
}
```

`href` is derived from `slug`, so a dead `#` link is impossible.

Add `related: ['other-slug']` when a specific pairing matters more than
category order — Loan Payment to Compound Interest, say. Curated slugs are
shown first and category-mates fill the remaining slots.

### 2. Write the calculation module

Create `lib/calculations/loan.ts`. Export a pure calculation function and an
`evaluate*` function that validates raw string input:

```ts
import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

export function calculateLoan(principal: number, rate: number): LoanResult { /* ... */ }

export function evaluateLoan(rawPrincipal: string, rawRate: string): CalculatorOutcome<LoanResult> {
  if (anyBlank(rawPrincipal, rawRate)) return { state: 'empty' }

  const parsed = parseNumbers(rawPrincipal, rawRate)
  if (!parsed) return invalid('Please enter numbers only.')

  const [principal, rate] = parsed
  if (principal < 0) return invalid('The principal cannot be negative.')

  return ok(calculateLoan(principal, rate))
}
```

Three conventions matter here:

- **Import siblings with the `.ts` extension.** That is what lets `node --test`
  run these modules directly; Next and `tsc` both accept it. The same applies
  inside `lib/calculator-content/`.
- **Never import from `lib/format.ts` or any component.** Calculation modules
  return numbers and structured data; formatting is the form's job.
- **Avoid constructor parameter properties.** Node's type-stripping runner
  rejects `constructor(private readonly x: T)`; declare the field and assign it
  in the body instead. Everything else in TypeScript's type syntax is fine.

`CalculatorOutcome<T>` has exactly three states — `empty` (not enough input
yet, show a placeholder), `invalid` (with a message for the user), and `ok`
(with the value). Use `outcomeValue(outcome)` in the form to get `T | null`.

### 3. Write the content file

Create `lib/calculator-content/loan.ts` exporting a `CalculatorContent`, then
add it to `contentEntries` in `lib/calculator-content/index.ts`. Long-form copy
never goes in a component.

### 4. Create the page

Copy any existing `app/calculators/<slug>/page.tsx`. It is ~45 lines and only
the `SLUG` constant and the form import change. It stays a **server** component
so metadata, canonical URL, OpenGraph and FAQ JSON-LD are generated statically.

### 5. Create the form

The form is the client component. It owns input state and formatting, and calls
`evaluate*` for everything else:

```tsx
'use client'
import { AmountInput, CalculatorReset, CalculatorResult, ResultBreakdown } from '@/components/calculator'
import { evaluateLoan } from '@/lib/calculations/loan'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatAmount } from '@/lib/format'

const DEFAULTS = { principal: '10000', rate: '5' }

export function LoanForm() {
  const [inputs, setInputs] = useState({ ...DEFAULTS })
  const outcome = useMemo(() => evaluateLoan(inputs.principal, inputs.rate), [inputs])
  const result = outcomeValue(outcome)
  // ...
}
```

Available primitives (`@/components/calculator`):

| Component | Use for |
| --- | --- |
| `NumberInput` | Any numeric field. Handles label association, hint text, `min`/`max`/`step`, `integer`. |
| `AmountInput` | Money. A `NumberInput` defaulting to non-negative, with an optional currency in the label. |
| `CalculatorToggle` | Segmented mode switcher (percentage modes, time units). |
| `CalculatorResult` | The headline result. The page's only `aria-live` region. |
| `ResultBreakdown` | The supporting figures grid beneath it. |
| `CalculatorSelect` | A labelled native select. |
| `DateInput` | A labelled native date field, always reporting `YYYY-MM-DD`. |
| `CalculatorReset` | The reset control. You supply what resetting means. |

Only `CalculatorResult` announces changes. Do not add a second live region —
two announcers talk over each other.

### 6. Flip the status and add a test

Set `status: 'live'` in the registry, then add cases to
`tests/calculations.test.ts` covering the normal path, the edge cases, and
every validation branch. Run `pnpm test`.

## What you do not have to do

Once the registry entry and content file exist, these update themselves:

- Homepage cards, and the "N calculators available now" line
- Category counts and which categories appear at all
- Search, across name, description and category
- Related calculators on every page
- `sitemap.xml` (live calculators only)
- Breadcrumb, `<h1>`, canonical URL, OpenGraph tags, FAQ JSON-LD

There is no second list to update anywhere.

## Working with dates

Never build date logic on `Date` arithmetic or millisecond division. Use
`lib/calculations/date-utils.ts`, which works on plain `{ year, month, day }`
records: `parseDateInput`, `differenceInDays`, `calendarSpan`, `addMonths`,
`daysInMonth` and `isLeapYear`. Timestamps carry a timezone, which is how the
same two calendar dates end up a day apart on different machines.

If a form needs today's date, set it in a `useEffect` rather than during
render — reading the clock while rendering makes the server and client markup
disagree.

## Before you commit

```powershell
pnpm test
npx tsc --noEmit
pnpm build
```

`typescript.ignoreBuildErrors` is `false`, so the build enforces types too.
