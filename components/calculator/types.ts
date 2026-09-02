/** Shared prop types for the calculator form primitives. */

export interface SelectOption {
  value: string
  label: string
}

export interface ToggleOption<T extends string> {
  id: T
  label: string
  /** Optional symbol rendered after the label, e.g. an operator sign. */
  symbol?: string
}

/** One figure in the result breakdown grid under a calculator. */
export interface BreakdownItem {
  term: string
  /** `null` renders the em-dash placeholder, so callers can pass a result directly. */
  value: string | null
  /** Renders the value in the destructive colour, e.g. for a loss. */
  negative?: boolean
}
