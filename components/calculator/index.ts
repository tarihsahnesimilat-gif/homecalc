/**
 * Form-side calculator primitives.
 *
 * Only the pieces used inside interactive (client) calculator forms are
 * exported here. The page-level pieces — CalculatorShell, CalculatorArticle,
 * CalculatorFaq, RelatedCalculators — stay on direct imports so the server
 * components that render them never pull a client module through a barrel.
 */
export { CalculatorResult } from './calculator-result'
export { CalculatorReset } from './calculator-reset'
export { CalculatorSelect } from './calculator-select'
export { CalculatorToggle } from './calculator-toggle'
export { NumberInput } from './number-input'
export { AmountInput } from './amount-input'
export { ResultBreakdown } from './result-breakdown'
export type { BreakdownItem, SelectOption, ToggleOption } from './types'
