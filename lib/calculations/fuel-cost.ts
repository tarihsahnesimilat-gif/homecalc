import { type CalculatorOutcome, anyBlank, invalid, ok, parseNumbers } from '../calculator-validation.ts'

/**
 * The two ways fuel efficiency is quoted around the world.
 *
 * `distance-per-unit` covers miles per gallon and kilometres per litre, where
 * a bigger number is better. `units-per-hundred` covers litres per 100 km,
 * where a smaller number is better.
 *
 * The calculator stays unit-neutral beyond that: distance, volume and currency
 * are whatever the user is already thinking in, so long as the efficiency and
 * the fuel price use the same volume unit.
 */
export type EfficiencyMode = 'distance-per-unit' | 'units-per-hundred'

export interface FuelCostResult {
  fuelUsed: number
  totalCost: number
  costPerDistanceUnit: number
  distance: number
}

export function calculateFuelCost(
  mode: EfficiencyMode,
  distance: number,
  efficiency: number,
  fuelPrice: number,
): FuelCostResult {
  const fuelUsed =
    mode === 'distance-per-unit' ? distance / efficiency : (distance * efficiency) / 100
  const totalCost = fuelUsed * fuelPrice

  return {
    fuelUsed,
    totalCost,
    // A zero-distance trip costs nothing; dividing by it would give NaN.
    costPerDistanceUnit: distance === 0 ? 0 : totalCost / distance,
    distance,
  }
}

export function evaluateFuelCost(
  mode: EfficiencyMode,
  rawDistance: string,
  rawEfficiency: string,
  rawFuelPrice: string,
): CalculatorOutcome<FuelCostResult> {
  if (anyBlank(rawDistance, rawEfficiency, rawFuelPrice)) return { state: 'empty' }

  const parsed = parseNumbers(rawDistance, rawEfficiency, rawFuelPrice)
  if (!parsed) return invalid('Please enter numbers only.')

  const [distance, efficiency, fuelPrice] = parsed
  if (distance < 0) return invalid('The distance cannot be negative.')
  if (fuelPrice < 0) return invalid('The fuel price cannot be negative.')
  if (efficiency <= 0) return invalid('Fuel efficiency must be greater than zero.')

  return ok(calculateFuelCost(mode, distance, efficiency, fuelPrice))
}
