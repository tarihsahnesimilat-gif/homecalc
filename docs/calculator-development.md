# Adding a calculator

CalculatorHub derives most of a calculator's surface area from two registries.
Adding one is four files plus a test — nothing else needs editing.

## The layers

```
lib/calculators.ts          metadata: name, slug, category, status, icon, keywords
lib/calculator-content/     SEO copy, intro, how-to, formulas, examples, FAQs
lib/calculations/           pure maths + validation, no React
lib/routes.ts               every public route, derived from the registry
app/calculators/page.tsx    the directory listing every live calculator
app/calculators/[category]/ one page per category that has live calculators
app/calculators/<slug>/     page (server, owns metadata) + form (client, owns state)
components/calculator/      shared presentation primitives
```

The site hierarchy is **Home → Calculators → Category → Calculator**, and every
level of it is generated from the registry.

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

Add `keywords` — the words people actually type, lowercase, at least three of
them. They feed search only and are never rendered, so they cannot become
keyword-stuffed page copy:

```ts
keywords: ['loan', 'monthly payment', 'mortgage payment', 'amortization'],
```

**Each keyword must belong to exactly one calculator**, and a test enforces it.
When a new calculator deserves an alias an older one holds — a dedicated
Square Root Calculator claiming `square root` from the Scientific Calculator —
move it rather than duplicating it. A shared alias makes the top search result
depend on alphabetical order instead of intent.

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

`tests/discovery.test.ts` and `tests/rendered-seo.test.ts` then check the new
calculator automatically — keywords, category membership, links, sitemap count
and the rendered metadata. The rendered checks need a prior `pnpm build` and
skip without one, so run the build before the suite when changing pages.

## What you do not have to do

Once the registry entry and content file exist, these update themselves:

- Homepage cards, and the "N calculators available now" line
- The `/calculators` directory, in the right category group
- Its category page, and that category's count
- Category counts and which categories appear at all
- Search, across name, keywords, description and category
- Related calculators on every page
- `sitemap.xml` (live calculators and their categories only)
- Breadcrumbs, `<h1>`, canonical URL, OpenGraph tags, and all JSON-LD

There is no second list to update anywhere.

## Discovery, categories and SEO

### The directory and category pages

`/calculators` lists every live calculator grouped by category.
`/calculators/<category>` is one page per category, generated by
`generateStaticParams` from `categoriesWithLiveCalculators` — categories whose
calculators are all still planned get no page, so nothing can link to an empty
one. `dynamicParams = false`, so any other slug 404s.

Category ids double as URL slugs and share the `/calculators/*` namespace with
calculator slugs. A test enforces that the two never collide.

Category SEO copy lives on the category itself in `lib/calculators.ts`
(`seoTitle`, `seoDescription`). There is no separate category config.

### Search

`searchCalculators` ranks matches deterministically, with no search dependency:

1. exact name
2. exact keyword
3. name starts with the term
4. name contains it
5. keyword contains it
6. description or category contains it

Live calculators always sort above planned ones.

### Breadcrumbs and structured data

`components/calculator/breadcrumbs.tsx` renders the visible trail *and* its
`BreadcrumbList` JSON-LD together, so the two cannot drift and a page cannot
emit two competing trails. Use it on any new page type.

Each page type carries exactly one JSON-LD block per entity:

| Page | Structured data |
| --- | --- |
| Calculator | `BreadcrumbList` + `FAQPage` + `WebApplication` |
| Directory and category | `BreadcrumbList` + `CollectionPage` |

`WebApplication` is emitted once, inside `CalculatorShell`, so every calculator
gets it and no page can duplicate it. **Never add ratings, reviews, prices,
authors or organisations** — none of those exist, and asserting them would be
fabrication. A test fails the build output if any of those keys appear.

### Sitemap

`lib/routes.ts` derives every public route from the registry, and `app/sitemap.ts`
just maps it to URLs. Nothing is hand-written, so a planned calculator cannot
leak in. The count is asserted in `tests/discovery.test.ts`.

## Domain conventions

Conventions worth following when a new calculator touches one of these areas.

### Money projections

Investment and loan projections state their assumptions on the page and in the
module doc comment — when contributions land, how often growth compounds, and
what is excluded (fees, tax, inflation). Present the result as a projection of
those assumptions, never as a prediction or as advice. Where a rate is an input
the user cannot know, say so and suggest trying a range.

### Business calculations

Break-even style calculations turn on the contribution margin — selling price
minus variable cost. Validate that it is positive and explain *why* when it is
not: a zero margin never repays fixed costs, and a negative one loses money on
every sale. Round unit counts up, since part of a unit cannot be sold.

### Times of day

Wall-clock times use `lib/calculations/time-utils.ts`, which holds them as
minutes past midnight rather than as `Date` objects. `parseTimeInput` reads the
`HH:MM` a native time input produces, and `minutesBetween` handles the rollover.

**Overnight spans are the default behaviour, not a special case.** An end time
earlier than the start adds a day, so 22:00 to 06:00 is eight hours. Two equal
times give zero, not twenty-four hours — someone entering one time twice means
no elapsed time. Anything longer than a day needs dates, so use the calendar
helpers in `date-utils.ts` instead.

### Rates the site cannot know

Some calculators need a number that changes constantly and cannot honestly be
shipped in a static build — an exchange rate is the clearest case. The rule is
that the user supplies it from a source they trust, and the page says plainly
that no live or stored rate is used. Never bake in a rate that will be stale
within hours while still looking authoritative. The Currency Converter shows
the inverse rate alongside the result, which is the quickest way for someone to
catch a rate entered the wrong way round.

### Repayment that may never finish

Debt payoff steps through the balance month by month rather than using a closed
form, which keeps the totals exact and makes the failure case natural: a payment
that does not exceed the monthly interest never reduces the balance. Reject that
explicitly — a huge number of months is far less useful than saying the payment
is too small. `MAXIMUM_MONTHS` is the backstop against an unbounded loop.

### Time zones

`lib/calculations/timezone.ts` uses `Intl` only; there is no timezone library
and none is needed. Converting a wall-clock time means finding the instant it
refers to in the source zone, then formatting that instant in the target zone —
the offset is looked up twice because the offset itself depends on the instant.
Daylight saving comes from the runtime's own tz data, so accuracy for historical
dates is whatever that data provides. Say so rather than implying full support.

### Fuel and unit-bearing inputs

The fuel calculator stays unit-neutral: the user supplies distance, efficiency
and price in whatever units they already think in, and the only rule is that
efficiency and price share a volume unit. What it does need to know is which
*convention* the efficiency uses — distance per unit of fuel (mpg, km/L, higher
is better) or fuel per 100 distance (L/100 km, lower is better) — because the
two divide in opposite directions. Offer that as a toggle rather than trying to
infer it.

## Working with dates

Never build date logic on `Date` arithmetic or millisecond division. Use
`lib/calculations/date-utils.ts`, which works on plain `{ year, month, day }`
records: `parseDateInput`, `differenceInDays`, `calendarSpan`, `addMonths`,
`daysInMonth` and `isLeapYear`. Timestamps carry a timezone, which is how the
same two calendar dates end up a day apart on different machines.

If a form needs today's date, set it in a `useEffect` rather than during
render — reading the clock while rendering makes the server and client markup
disagree.

## Production and launch

### Site URL

`lib/site.ts` reads `NEXT_PUBLIC_SITE_URL` at build time and falls back to a
placeholder domain. **Set it in the hosting provider's environment before going
live**, or every canonical URL, OpenGraph tag and sitemap entry will point at
the placeholder. It holds no secret, needs no local value, and a trailing slash
is stripped for you.

### Analytics

`@vercel/analytics` is already wired into `app/layout.tsx` and rendered only
when `NODE_ENV === 'production'`. It needs no key and no local configuration,
and it never sees calculator inputs — those stay in the browser. That is the
integration point; do not add a second one. Swapping providers means changing
that one line.

Google Search Console needs no application code: verify the domain through DNS
or the hosting provider, then submit `/sitemap.xml`.

### Where ads can go without breaking anything

`CalculatorShell` takes an optional `aside`, rendered below the tip card in the
sidebar. That is the natural slot for a future ad unit: it is outside the
calculator, below the result, and collapses under the main column on mobile.
Do not place anything between the inputs and the result — the answer is why
people are on the page. No placeholder markup exists today, and none should be
added until there is a real unit to serve.

### Legal pages

`/privacy`, `/terms` and `/disclaimer` use the shared `LegalPage` component and
are listed in `lib/routes.ts` via `LEGAL_ROUTES`, so the sitemap and footer pick
them up automatically. They deliberately name no company, address or legal
entity. If the site gains an operator identity, add it to `siteConfig` rather
than hard-coding it into three pages.

### Focus and footer

A single `:focus-visible` rule in `globals.css` gives links, buttons, tabs and
summaries a visible keyboard focus ring. It uses `:where()`, so its specificity
is zero and a component can still override it.

`SiteFooter` renders from the root layout, so every route carries it — that is
what keeps the legal pages reachable from anywhere. Pages should not add their
own footer.

## Before you commit

```powershell
pnpm test
npx tsc --noEmit
pnpm build
```

`typescript.ignoreBuildErrors` is `false`, so the build enforces types too.
