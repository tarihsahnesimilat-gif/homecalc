'use client'

import { useMemo, useState } from 'react'
import { ArrowRightLeft } from 'lucide-react'

import {
  CalculatorReset,
  CalculatorResult,
  CalculatorSelect,
  NumberInput,
  type SelectOption,
} from '@/components/calculator'
import {
  type UnitCategory,
  type UnitCategoryId,
  UNIT_CATEGORIES,
  evaluateConversion,
  getUnit,
  getUnitCategory,
} from '@/lib/calculations/units'
import { outcomeValue } from '@/lib/calculator-validation'
import { formatNumber } from '@/lib/format'

const CATEGORY_OPTIONS: readonly SelectOption[] = UNIT_CATEGORIES.map((category) => ({
  value: category.id,
  label: category.name,
}))

function unitOptions(category: UnitCategory): readonly SelectOption[] {
  return category.units.map((unit) => ({
    value: unit.id,
    label: `${unit.name} (${unit.abbreviation})`,
  }))
}

export function UnitConverterForm() {
  const [categoryId, setCategoryId] = useState<UnitCategoryId>('length')
  const category = getUnitCategory(categoryId)
  const [fromUnitId, setFromUnitId] = useState<string>(category.units[0].id)
  const [toUnitId, setToUnitId] = useState<string>(category.units[2].id)
  const [rawValue, setRawValue] = useState('1')

  const outcome = useMemo(
    () => evaluateConversion(categoryId, fromUnitId, toUnitId, rawValue),
    [categoryId, fromUnitId, toUnitId, rawValue],
  )
  const converted = outcomeValue(outcome)

  /** Takes the raw select value and resolves it through the category table. */
  function changeCategory(nextId: string) {
    const nextCategory =
      UNIT_CATEGORIES.find((entry) => entry.id === nextId) ?? UNIT_CATEGORIES[0]
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
  const options = unitOptions(category)

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-5 shadow-sm sm:p-8">
      <CalculatorSelect
        label="Category"
        value={categoryId}
        onChange={changeCategory}
        options={CATEGORY_OPTIONS}
      />

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <NumberInput label="Value" value={rawValue} onChange={setRawValue} />
        <CalculatorSelect
          label="From"
          value={fromUnitId}
          onChange={setFromUnitId}
          options={options}
        />
      </div>

      <div className="mt-5 flex items-end gap-3">
        <CalculatorSelect
          className="flex-1"
          label="To"
          value={toUnitId}
          onChange={setToUnitId}
          options={options}
        />
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
            ? outcome.message
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

      <CalculatorReset onReset={() => setRawValue('')} label="Reset value" />
    </div>
  )
}
