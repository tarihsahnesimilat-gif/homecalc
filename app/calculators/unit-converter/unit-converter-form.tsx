'use client'

import { useId, useMemo, useState } from 'react'
import { ArrowRightLeft, RotateCcw } from 'lucide-react'

import { CalculatorResult } from '@/components/calculator/calculator-result'
import { formatNumber } from '@/lib/format'

export type UnitCategoryId = 'length' | 'weight' | 'temperature' | 'volume'

export interface UnitDefinition {
  id: string
  name: string
  abbreviation: string
  /** Converts a value in this unit into the category's base unit. */
  toBase(value: number): number
  /** Converts a value in the category's base unit into this unit. */
  fromBase(value: number): number
}

export interface UnitCategory {
  id: UnitCategoryId
  name: string
  /** Name of the base unit every conversion in this category passes through. */
  baseUnit: string
  units: readonly UnitDefinition[]
}

/** Most units are a fixed multiple of the base, so define them from one factor. */
function scaled(id: string, name: string, abbreviation: string, factor: number): UnitDefinition {
  return {
    id,
    name,
    abbreviation,
    toBase: (value) => value * factor,
    fromBase: (value) => value / factor,
  }
}

/**
 * Conversion definitions, kept local and exact.
 *
 * Length, weight and volume use internationally defined factors (an inch is
 * exactly 0.0254 m, a pound exactly 0.45359237 kg). Volume uses US liquid
 * measures. Temperature needs offsets, not multipliers, so those units define
 * their own functions.
 */
export const UNIT_CATEGORIES: readonly UnitCategory[] = [
  {
    id: 'length',
    name: 'Length',
    baseUnit: 'meter',
    units: [
      scaled('meter', 'Meter', 'm', 1),
      scaled('kilometer', 'Kilometer', 'km', 1000),
      scaled('centimeter', 'Centimeter', 'cm', 0.01),
      scaled('millimeter', 'Millimeter', 'mm', 0.001),
      scaled('inch', 'Inch', 'in', 0.0254),
      scaled('foot', 'Foot', 'ft', 0.3048),
      scaled('yard', 'Yard', 'yd', 0.9144),
      scaled('mile', 'Mile', 'mi', 1609.344),
    ],
  },
  {
    id: 'weight',
    name: 'Weight',
    baseUnit: 'kilogram',
    units: [
      scaled('kilogram', 'Kilogram', 'kg', 1),
      scaled('gram', 'Gram', 'g', 0.001),
      scaled('pound', 'Pound', 'lb', 0.45359237),
      scaled('ounce', 'Ounce', 'oz', 0.028349523125),
    ],
  },
  {
    id: 'temperature',
    name: 'Temperature',
    baseUnit: 'degree Celsius',
    units: [
      {
        id: 'celsius',
        name: 'Celsius',
        abbreviation: '°C',
        toBase: (value) => value,
        fromBase: (value) => value,
      },
      {
        id: 'fahrenheit',
        name: 'Fahrenheit',
        abbreviation: '°F',
        toBase: (value) => ((value - 32) * 5) / 9,
        fromBase: (value) => (value * 9) / 5 + 32,
      },
      {
        id: 'kelvin',
        name: 'Kelvin',
        abbreviation: 'K',
        toBase: (value) => value - 273.15,
        fromBase: (value) => value + 273.15,
      },
    ],
  },
  {
    id: 'volume',
    name: 'Volume',
    baseUnit: 'liter',
    units: [
      scaled('liter', 'Liter', 'L', 1),
      scaled('milliliter', 'Milliliter', 'mL', 0.001),
      scaled('gallon', 'Gallon (US)', 'gal', 3.785411784),
      scaled('fluid-ounce', 'Fluid ounce (US)', 'fl oz', 0.0295735295625),
    ],
  },
]

/** Coldest possible value per temperature unit, used to reject impossible input. */
const ABSOLUTE_ZERO: Readonly<Record<string, number>> = {
  celsius: -273.15,
  fahrenheit: -459.67,
  kelvin: 0,
}

export function getCategory(id: UnitCategoryId): UnitCategory {
  return UNIT_CATEGORIES.find((category) => category.id === id) ?? UNIT_CATEGORIES[0]
}

export function getUnit(category: UnitCategory, unitId: string): UnitDefinition {
  return category.units.find((unit) => unit.id === unitId) ?? category.units[0]
}

interface ConversionOutcome {
  state: 'empty' | 'invalid' | 'ok'
  message?: string
  value?: number
}

/**
 * Rounds away floating-point noise without touching real precision.
 *
 * Every conversion runs two chained operations, which can turn an exact result
 * into something like 12.000000000000002. A double carries 15 to 17 significant
 * digits, so rounding to 12 discards only the accumulated error — far more
 * precision is kept than any measurement needs, or than the six decimal places
 * actually displayed.
 */
function normalizePrecision(value: number): number {
  return Number.isFinite(value) ? Number(value.toPrecision(12)) : value
}

/** Converts by routing through the category's base unit. */
export function convert(
  categoryId: UnitCategoryId,
  fromUnitId: string,
  toUnitId: string,
  value: number,
): number {
  const category = getCategory(categoryId)
  const from = getUnit(category, fromUnitId)
  const to = getUnit(category, toUnitId)

  return normalizePrecision(to.fromBase(from.toBase(value)))
}

export function evaluateConversion(
  categoryId: UnitCategoryId,
  fromUnitId: string,
  toUnitId: string,
  rawValue: string,
): ConversionOutcome {
  if (rawValue.trim() === '') return { state: 'empty' }

  const value = Number(rawValue)
  if (!Number.isFinite(value)) {
    return { state: 'invalid', message: 'Please enter a number.' }
  }

  if (categoryId === 'temperature') {
    const minimum = ABSOLUTE_ZERO[fromUnitId]
    if (minimum !== undefined && value < minimum) {
      return {
        state: 'invalid',
        message: `Nothing can be colder than absolute zero (${minimum}°).`,
      }
    }
  } else if (value < 0) {
    return { state: 'invalid', message: 'This measurement cannot be negative.' }
  }

  return { state: 'ok', value: convert(categoryId, fromUnitId, toUnitId, value) }
}

export function UnitConverterForm() {
  const [categoryId, setCategoryId] = useState<UnitCategoryId>('length')
  const category = getCategory(categoryId)
  const [fromUnitId, setFromUnitId] = useState<string>(category.units[0].id)
  const [toUnitId, setToUnitId] = useState<string>(category.units[2].id)
  const [rawValue, setRawValue] = useState('1')

  const categoryFieldId = useId()
  const fromFieldId = useId()
  const toFieldId = useId()
  const valueFieldId = useId()

  const outcome = useMemo(
    () => evaluateConversion(categoryId, fromUnitId, toUnitId, rawValue),
    [categoryId, fromUnitId, toUnitId, rawValue],
  )

  /** Takes the raw select value and resolves it through the category table. */
  function changeCategory(nextId: string) {
    const nextCategory =
      UNIT_CATEGORIES.find((category) => category.id === nextId) ?? UNIT_CATEGORIES[0]
    setCategoryId(nextCategory.id)
    setFromUnitId(nextCategory.units[0].id)
    setToUnitId(nextCategory.units[1].id)
  }

  function swapUnits() {
    setFromUnitId(toUnitId)
    setToUnitId(fromUnitId)
  }

  const fromUnit = getUnit(category, fromUnitId)
  const toUnit = getUnit(category, toUnitId)
  const converted = outcome.state === 'ok' && outcome.value !== undefined ? outcome.value : null

  const selectClass =
    'h-12 w-full rounded-md border border-input bg-background px-3 text-base outline-none ring-accent focus:ring-2'

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <div className="grid gap-2">
        <label htmlFor={categoryFieldId} className="text-sm font-semibold text-primary">
          Category
        </label>
        <select
          id={categoryFieldId}
          value={categoryId}
          onChange={(event) => changeCategory(event.target.value)}
          className={selectClass}
        >
          {UNIT_CATEGORIES.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor={valueFieldId} className="text-sm font-semibold text-primary">
            Value
          </label>
          <input
            id={valueFieldId}
            type="number"
            inputMode="decimal"
            step="any"
            value={rawValue}
            onChange={(event) => setRawValue(event.target.value)}
            className="h-12 rounded-md border border-input bg-background px-3 text-lg outline-none ring-accent focus:ring-2"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor={fromFieldId} className="text-sm font-semibold text-primary">
            From
          </label>
          <select
            id={fromFieldId}
            value={fromUnitId}
            onChange={(event) => setFromUnitId(event.target.value)}
            className={selectClass}
          >
            {category.units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name} ({unit.abbreviation})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 flex items-end gap-3">
        <div className="grid flex-1 gap-2">
          <label htmlFor={toFieldId} className="text-sm font-semibold text-primary">
            To
          </label>
          <select
            id={toFieldId}
            value={toUnitId}
            onChange={(event) => setToUnitId(event.target.value)}
            className={selectClass}
          >
            {category.units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name} ({unit.abbreviation})
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={swapUnits}
          aria-label="Swap the from and to units"
          className="h-12 rounded-md border border-border px-3 text-muted-foreground transition hover:border-accent hover:text-primary"
        >
          <ArrowRightLeft className="size-4" />
        </button>
      </div>

      <CalculatorResult
        className="mt-7"
        label={
          converted !== null
            ? `${formatNumber(Number(rawValue), 6)} ${fromUnit.abbreviation} in ${toUnit.name.toLowerCase()}`
            : 'Your result'
        }
        value={
          outcome.state === 'invalid'
            ? (outcome.message ?? 'Invalid input')
            : converted !== null
              ? `${formatNumber(converted, 6)} ${toUnit.abbreviation}`
              : '—'
        }
        hint={
          converted !== null
            ? `Converted through the ${category.baseUnit} as the base unit.`
            : undefined
        }
        isError={outcome.state === 'invalid'}
      />

      <button
        type="button"
        onClick={() => setRawValue('')}
        className="mt-5 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
      >
        <RotateCcw className="size-4" />
        Reset value
      </button>
    </div>
  )
}
