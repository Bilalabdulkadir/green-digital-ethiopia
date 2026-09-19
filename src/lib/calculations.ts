import { ScenarioInputs, ScenarioCompleteResult, EnergyBreakdown, WaterMetrics, EmissionBreakdown } from '../types/sustainability';
import { EMISSION_FACTORS } from './emissionFactors';

export function calculatePUE(inputs: ScenarioInputs): number {
  let baseCoolingOverhead = 0.15;

  switch (inputs.coolingType) {
    case 'air_free_cooling':
      baseCoolingOverhead = 0.12;
      break;
    case 'evaporative':
      baseCoolingOverhead = 0.18;
      break;
    case 'closed_chilled_water':
      baseCoolingOverhead = 0.32;
      break;
    case 'direct_liquid':
      baseCoolingOverhead = 0.08;
      break;
  }

  const tempDelta = Math.max(0, inputs.ambientTempMeanC - 18);
  const tempPenalty = tempDelta * 0.008;
  const electricalLosses = 0.07;
  const auxLightingSecurity = 0.02;

  const totalOverhead = baseCoolingOverhead + tempPenalty + electricalLosses + auxLightingSecurity;
  return Number((1.0 + totalOverhead).toFixed(3));
}

export function calculateEnergy(inputs: ScenarioInputs, pue: number): EnergyBreakdown {
  const hoursPerYear = 8760;
  const utilizationFactor = 0.6 + (inputs.averageServerUtilizationPct / 100) * 0.4;
  const averageITLoadMW = inputs.itCapacityMW * utilizationFactor;

  const annualITElectricityGWh = (averageITLoadMW * hoursPerYear) / 1000;
  const totalAnnualElectricityGWh = annualITElectricityGWh * pue;
  const overheadGWh = totalAnnualElectricityGWh - annualITElectricityGWh;

  const annualCoolingElectricityGWh = overheadGWh * 0.65;
  const annualPowerSystemLossesGWh = overheadGWh * 0.25;
  const annualLightingAuxGWh = overheadGWh * 0.10;

  return {
    annualITElectricityGWh: Number(annualITElectricityGWh.toFixed(2)),
    annualCoolingElectricityGWh: Number(annualCoolingElectricityGWh.toFixed(2)),
    annualPowerSystemLossesGWh: Number(annualPowerSystemLossesGWh.toFixed(2)),
    annualLightingAuxGWh: Number(annualLightingAuxGWh.toFixed(2)),
    totalAnnualElectricityGWh: Number(totalAnnualElectricityGWh.toFixed(2)),
    effectivePUE: pue
  };
}

export function calculateWater(inputs: ScenarioInputs, energy: EnergyBreakdown): WaterMetrics {
  let waterRatePerKWhCooling = EMISSION_FACTORS.WATER_EVAPORATIVE_L_PER_KWH_COOLING;
  if (inputs.coolingType === 'air_free_cooling') {
    waterRatePerKWhCooling = 0.10;
  } else if (inputs.coolingType === 'closed_chilled_water') {
    waterRatePerKWhCooling = EMISSION_FACTORS.WATER_CLOSED_LOOP_L_PER_KWH_COOLING;
  } else if (inputs.coolingType === 'direct_liquid') {
    waterRatePerKWhCooling = EMISSION_FACTORS.WATER_DIRECT_LIQUID_L_PER_KWH_COOLING;
  }

  const coolingKWh = energy.annualCoolingElectricityGWh * 1_000_000;
  const annualWaterConsumptionLiters = coolingKWh * waterRatePerKWhCooling;
  const annualWaterConsumptionM3 = annualWaterConsumptionLiters / 1000;

  const itEnergyKWh = energy.annualITElectricityGWh * 1_000_000;
  const effectiveWUE = itEnergyKWh > 0 ? Number((annualWaterConsumptionLiters / itEnergyKWh).toFixed(3)) : 0;

  return {
    annualWaterConsumptionLiters: Math.round(annualWaterConsumptionLiters),
    annualWaterConsumptionM3: Number(annualWaterConsumptionM3.toFixed(1)),
    effectiveWUE
  };
}

export function calculateEmissions(
  inputs: ScenarioInputs,
  energy: EnergyBreakdown
): EmissionBreakdown {
  const generatorCapacityKW = inputs.itCapacityMW * 1000 * 1.25;
  const annualDieselGeneratedKWh = generatorCapacityKW * inputs.backupGeneratorHours;
  const fuelBurnedLitres = annualDieselGeneratedKWh * inputs.backupFuelConsumptionLPerKWh;
  const scope1DieselEmissionsKg = fuelBurnedLitres * inputs.dieselEmissionFactorKgPerLitre;
  const scope1DieselEmissionsMtCO2e = Number((scope1DieselEmissionsKg / 1000).toFixed(2));

  const gridElectricityKWh = Math.max(0, (energy.totalAnnualElectricityGWh * 1_000_000) - annualDieselGeneratedKWh);
  const scope2GridEmissionsKg = gridElectricityKWh * inputs.gridEmissionFactorKgPerKWh;
  const scope2GridEmissionsMtCO2e = Number((scope2GridEmissionsKg / 1000).toFixed(2));

  const scope2MarginalEmissionsKg = gridElectricityKWh * inputs.marginalGridFactorKgPerKWh;
  const scope2MarginalEmissionsMtCO2e = Number((scope2MarginalEmissionsKg / 1000).toFixed(2));

  const totalEmbodiedServerKg = inputs.serverCount * inputs.embodiedCarbonPerServerKgCO2e;
  const recyclingCreditMultiplier = Math.max(0.70, 1.0 - (inputs.circularityRecyclingPct / 100) * 0.35);
  const netEmbodiedServerKg = totalEmbodiedServerKg * recyclingCreditMultiplier;
  const annualAmortizedScope3Kg = netEmbodiedServerKg / Math.max(1, inputs.hardwareLifespanYears);
  const scope3EmbodiedAmortizedMtCO2e = Number((annualAmortizedScope3Kg / 1000).toFixed(2));

  const heatAvailableGWh = energy.annualITElectricityGWh * 0.70;
  const heatUtilizedGWh = heatAvailableGWh * (inputs.wasteHeatReusePct / 100);
  const avoidedEmissionsKg = heatUtilizedGWh * 1_000_000 * 0.20;
  const annualAvoidedEmissionsHeatReuseMtCO2e = Number((avoidedEmissionsKg / 1000).toFixed(2));

  const totalAnnualEmissionsMtCO2e = Number(
    (scope1DieselEmissionsMtCO2e + scope2GridEmissionsMtCO2e + scope3EmbodiedAmortizedMtCO2e - annualAvoidedEmissionsHeatReuseMtCO2e).toFixed(2)
  );

  const totalITMWh = energy.annualITElectricityGWh * 1000;
  const emissionsIntensityPerMWhIT = totalITMWh > 0 ? Number(((totalAnnualEmissionsMtCO2e * 1000) / totalITMWh).toFixed(2)) : 0;

  return {
    scope1DieselEmissionsMtCO2e,
    scope2GridEmissionsMtCO2e,
    scope2MarginalEmissionsMtCO2e,
    scope3EmbodiedAmortizedMtCO2e,
    annualAvoidedEmissionsHeatReuseMtCO2e,
    totalAnnualEmissionsMtCO2e,
    emissionsIntensityPerMWhIT
  };
}

export function calculateCompleteScenario(inputs: ScenarioInputs): ScenarioCompleteResult {
  const pue = calculatePUE(inputs);
  const energy = calculateEnergy(inputs, pue);
  const water = calculateWater(inputs, energy);
  const emissions = calculateEmissions(inputs, energy);

  const itEnergyKWh = energy.annualITElectricityGWh * 1_000_000;
  const cue = itEnergyKWh > 0 ? Number(((emissions.totalAnnualEmissionsMtCO2e * 1000) / itEnergyKWh).toFixed(4)) : 0;

  return {
    inputs,
    metrics: {
      pue,
      wue: water.effectiveWUE,
      cue,
      annualGridLoadGWh: energy.totalAnnualElectricityGWh
    },
    energy,
    water,
    emissions,
    timestamp: new Date().toISOString()
  };
}
