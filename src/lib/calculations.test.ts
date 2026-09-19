import { describe, it, expect } from 'vitest';
import { calculatePUE, calculateEnergy, calculateWater, calculateEmissions, calculateCompleteScenario } from './calculations';
import { ScenarioInputs } from '../types/sustainability';

const mockInputs: ScenarioInputs = {
  facilityName: 'Test Facility',
  location: 'Addis Ababa (Bole ICT Park)',
  itCapacityMW: 10,
  averageServerUtilizationPct: 50,
  coolingType: 'air_free_cooling',
  ambientTempMeanC: 16.5,
  gridEmissionFactorKgPerKWh: 0.018,
  marginalGridFactorKgPerKWh: 0.145,
  gridReliabilityPct: 99.0,
  backupGeneratorHours: 100,
  dieselEmissionFactorKgPerLitre: 2.68,
  backupFuelConsumptionLPerKWh: 0.28,
  hardwareLifespanYears: 4,
  serverCount: 5000,
  embodiedCarbonPerServerKgCO2e: 1200,
  circularityRecyclingPct: 30,
  wasteHeatReusePct: 10,
  evidenceClasses: {}
};

describe('Sustainability Calculation Engine', () => {
  it('calculates PUE with valid lower bound for air free cooling', () => {
    const pue = calculatePUE(mockInputs);
    expect(pue).toBeGreaterThan(1.0);
    expect(pue).toBeLessThan(1.40);
  });

  it('penalizes higher ambient temperatures in PUE calculation', () => {
    const baseline = calculatePUE({ ...mockInputs, ambientTempMeanC: 16 });
    const warm = calculatePUE({ ...mockInputs, ambientTempMeanC: 28 });
    expect(warm).toBeGreaterThan(baseline);
  });

  it('computes annual energy breakdown deterministically', () => {
    const pue = calculatePUE(mockInputs);
    const energy = calculateEnergy(mockInputs, pue);
    expect(energy.totalAnnualElectricityGWh).toBeGreaterThan(energy.annualITElectricityGWh);
    expect(energy.effectivePUE).toBe(pue);
  });

  it('computes water consumption and non-zero WUE for evaporative systems', () => {
    const pue = calculatePUE(mockInputs);
    const energy = calculateEnergy(mockInputs, pue);
    const water = calculateWater({ ...mockInputs, coolingType: 'evaporative' }, energy);
    expect(water.effectiveWUE).toBeGreaterThan(0);
    expect(water.annualWaterConsumptionM3).toBeGreaterThan(0);
  });

  it('calculates Scope 1, 2, and 3 emissions correctly', () => {
    const res = calculateCompleteScenario(mockInputs);
    expect(res.emissions.scope1DieselEmissionsMtCO2e).toBeGreaterThan(0);
    expect(res.emissions.scope2GridEmissionsMtCO2e).toBeGreaterThan(0);
    expect(res.emissions.scope3EmbodiedAmortizedMtCO2e).toBeGreaterThan(0);
    expect(res.metrics.cue).toBeGreaterThan(0);
  });
});
