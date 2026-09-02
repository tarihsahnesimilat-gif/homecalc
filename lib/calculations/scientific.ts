import { type CalculatorOutcome, invalid, isBlank, ok } from '../calculator-validation.ts'
import { normalizePrecision } from './precision.ts'

/**
 * A small, deliberately limited expression evaluator.
 *
 * Written as a tokenizer plus a recursive-descent parser rather than using
 * `eval` or `new Function`, which would hand arbitrary user input straight to
 * the JavaScript engine. Only the operators, functions and constants listed
 * below are recognised; anything else is a parse error rather than something
 * that runs.
 *
 * Grammar:
 *   expression := term (('+' | '-') term)*
 *   term       := unary (('*' | '/') unary)*
 *   unary      := ('-' | '+') unary | power
 *   power      := postfix ('^' unary)?        right-associative
 *   postfix    := primary '%'*
 *   primary    := number | constant | '(' expression ')' | function '(' expression ')'
 */

export type AngleMode = 'degrees' | 'radians'

const FUNCTIONS = ['sqrt', 'sin', 'cos', 'tan', 'inv'] as const
type FunctionName = (typeof FUNCTIONS)[number]

const CONSTANTS: Readonly<Record<string, number>> = {
  pi: Math.PI,
  e: Math.E,
}

type Token =
  | { kind: 'number'; value: number }
  | { kind: 'identifier'; value: string }
  | { kind: 'operator'; value: '+' | '-' | '*' | '/' | '^' | '%' }
  | { kind: 'paren'; value: '(' | ')' }

/** Thrown internally and converted to an `invalid` outcome at the boundary. */
class ExpressionError extends Error {}

function tokenize(input: string): Token[] {
  const tokens: Token[] = []
  let index = 0

  while (index < input.length) {
    const char = input[index]

    if (char === ' ') {
      index += 1
      continue
    }

    if ((char >= '0' && char <= '9') || char === '.') {
      let literal = ''
      while (
        index < input.length &&
        ((input[index] >= '0' && input[index] <= '9') || input[index] === '.')
      ) {
        literal += input[index]
        index += 1
      }
      const value = Number(literal)
      if (!Number.isFinite(value)) throw new ExpressionError(`"${literal}" is not a number.`)
      tokens.push({ kind: 'number', value })
      continue
    }

    if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {
      let name = ''
      while (
        index < input.length &&
        ((input[index] >= 'a' && input[index] <= 'z') ||
          (input[index] >= 'A' && input[index] <= 'Z'))
      ) {
        name += input[index]
        index += 1
      }
      tokens.push({ kind: 'identifier', value: name.toLowerCase() })
      continue
    }

    if (char === '+' || char === '-' || char === '*' || char === '/' || char === '^' || char === '%') {
      tokens.push({ kind: 'operator', value: char })
      index += 1
      continue
    }

    if (char === '(' || char === ')') {
      tokens.push({ kind: 'paren', value: char })
      index += 1
      continue
    }

    throw new ExpressionError(`"${char}" is not something this calculator understands.`)
  }

  return tokens
}

function isFunctionName(name: string): name is FunctionName {
  return (FUNCTIONS as readonly string[]).includes(name)
}

/**
 * Trigonometry with exact quarter-turn values in degree mode.
 *
 * Converting 180 degrees to radians and taking the sine gives 1.22e-16 rather
 * than 0, because pi cannot be represented exactly. Reading the exact values
 * off a table at multiples of 90 degrees avoids showing that noise.
 */
export function evaluateTrig(name: 'sin' | 'cos' | 'tan', angle: number, mode: AngleMode): number {
  if (mode === 'degrees') {
    const normalized = ((angle % 360) + 360) % 360

    if (normalized % 90 === 0) {
      const quarter = normalized / 90
      if (name === 'sin') return [0, 1, 0, -1][quarter]
      if (name === 'cos') return [1, 0, -1, 0][quarter]
      if (quarter === 1 || quarter === 3) {
        throw new ExpressionError('The tangent of that angle is undefined.')
      }
      return 0
    }

    const radians = (normalized * Math.PI) / 180
    return name === 'sin' ? Math.sin(radians) : name === 'cos' ? Math.cos(radians) : Math.tan(radians)
  }

  return name === 'sin' ? Math.sin(angle) : name === 'cos' ? Math.cos(angle) : Math.tan(angle)
}

function applyFunction(name: FunctionName, argument: number, mode: AngleMode): number {
  switch (name) {
    case 'sqrt':
      if (argument < 0) {
        throw new ExpressionError('The square root of a negative number is not a real number.')
      }
      return Math.sqrt(argument)
    case 'inv':
      if (argument === 0) throw new ExpressionError('Cannot divide by zero.')
      return 1 / argument
    case 'sin':
    case 'cos':
    case 'tan':
      return evaluateTrig(name, argument, mode)
  }
}

class Parser {
  private position = 0
  // Declared explicitly rather than as constructor parameter properties, which
  // Node's type-stripping test runner cannot handle.
  private readonly tokens: Token[]
  private readonly mode: AngleMode

  constructor(tokens: Token[], mode: AngleMode) {
    this.tokens = tokens
    this.mode = mode
  }

  parse(): number {
    const value = this.parseExpression()
    if (this.position < this.tokens.length) {
      throw new ExpressionError('That expression is not complete.')
    }
    return value
  }

  private peek(): Token | undefined {
    return this.tokens[this.position]
  }

  private parseExpression(): number {
    let left = this.parseTerm()

    for (;;) {
      const token = this.peek()
      if (token?.kind !== 'operator' || (token.value !== '+' && token.value !== '-')) break
      this.position += 1
      const right = this.parseTerm()
      left = token.value === '+' ? left + right : left - right
    }

    return left
  }

  private parseTerm(): number {
    let left = this.parseUnary()

    for (;;) {
      const token = this.peek()
      if (token?.kind !== 'operator' || (token.value !== '*' && token.value !== '/')) break
      this.position += 1
      const right = this.parseUnary()
      if (token.value === '/' && right === 0) throw new ExpressionError('Cannot divide by zero.')
      left = token.value === '*' ? left * right : left / right
    }

    return left
  }

  private parseUnary(): number {
    const token = this.peek()
    if (token?.kind === 'operator' && (token.value === '-' || token.value === '+')) {
      this.position += 1
      const value = this.parseUnary()
      return token.value === '-' ? -value : value
    }
    return this.parsePower()
  }

  private parsePower(): number {
    const base = this.parsePostfix()
    const token = this.peek()

    if (token?.kind === 'operator' && token.value === '^') {
      this.position += 1
      // Right-associative, and the exponent may itself be negative.
      const exponent = this.parseUnary()
      const result = Math.pow(base, exponent)
      if (!Number.isFinite(result)) {
        throw new ExpressionError('That power is not a finite number.')
      }
      return result
    }

    return base
  }

  private parsePostfix(): number {
    let value = this.parsePrimary()

    for (;;) {
      const token = this.peek()
      if (token?.kind !== 'operator' || token.value !== '%') break
      this.position += 1
      value = value / 100
    }

    return value
  }

  private parsePrimary(): number {
    const token = this.peek()
    if (!token) throw new ExpressionError('That expression is not complete.')

    if (token.kind === 'number') {
      this.position += 1
      return token.value
    }

    if (token.kind === 'identifier') {
      this.position += 1

      const constant = CONSTANTS[token.value]
      if (constant !== undefined) return constant

      if (isFunctionName(token.value)) {
        const open = this.peek()
        if (open?.kind !== 'paren' || open.value !== '(') {
          throw new ExpressionError(`${token.value} needs brackets around its value.`)
        }
        this.position += 1
        const argument = this.parseExpression()
        const close = this.peek()
        if (close?.kind !== 'paren' || close.value !== ')') {
          throw new ExpressionError('A bracket was left open.')
        }
        this.position += 1
        return applyFunction(token.value, argument, this.mode)
      }

      throw new ExpressionError(`"${token.value}" is not a function this calculator knows.`)
    }

    if (token.kind === 'paren' && token.value === '(') {
      this.position += 1
      const value = this.parseExpression()
      const close = this.peek()
      if (close?.kind !== 'paren' || close.value !== ')') {
        throw new ExpressionError('A bracket was left open.')
      }
      this.position += 1
      return value
    }

    throw new ExpressionError('That expression is not complete.')
  }
}

export function evaluateExpression(
  expression: string,
  mode: AngleMode = 'degrees',
): CalculatorOutcome<number> {
  if (isBlank(expression)) return { state: 'empty' }

  try {
    const value = new Parser(tokenize(expression), mode).parse()

    if (!Number.isFinite(value)) {
      return invalid('That calculation does not have a finite answer.')
    }

    return ok(normalizePrecision(value))
  } catch (error) {
    if (error instanceof ExpressionError) return invalid(error.message)
    throw error
  }
}
