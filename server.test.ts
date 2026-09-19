export type EvidenceClass = 'empirical' | 'regional_benchmark' | 'model_assumption';

export interface EvidenceClassification {
  category: EvidenceClass;
  source: string;
  confidenceScore: number;
  notes: string;
}

export interface ScenarioInputs {
  facilityName: string;
  location: string;
  itCapacityMW: number;
  averageServerUtilizationPct: number;
  coolingType: 'air_free_cooling' | 'evaporative' | 'closed_chilled_water' | 'direct_liquid';
  ambientTempMeanC: number;
  gridEmissionFactorKgPerKWh: number;
  marginalGridFactorKgPerKWh: number;
  gridReliabilityPct: number;
  backupGeneratorHours: number;
  dieselEmissionFactorKgPerLitre: number;
  backupFuelConsumptionLPerKWh: number;
  hardwareLifespanYears: number;
  serverCount: number;
  embodiedCarbonPerServerKgCO2e: number;
  circularityRecyclingPct: number;
  wasteHeatReusePct: number;
  evidenceClasses: Record<string, EvidenceClass>;
}

export interface EnergyBreakdown {
  annualITElectricityGWh: number;
  annualCoolingElectricityGWh: number;
  annualPowerSystemLossesGWh: number;
  annualLightingAuxGWh: number;
  totalAnnualElectricityGWh: number;
  effectivePUE: number;
}

export interface WaterMetrics {
  annualWaterConsumptionM3: number;
  annualWaterConsumptionLiters: number;
  effectiveWUE: number;
}

export interface EmissionBreakdown {
  scope1DieselEmissionsMtCO2e: number;
  scope2GridEmissionsMtCO2e: number;
  scope2MarginalEmissionsMtCO2e: number;
  scope3EmbodiedAmortizedMtCO2e: number;
  annualAvoidedEmissionsHeatReuseMtCO2e: number;
  totalAnnualEmissionsMtCO2e: number;
  emissionsIntensityPerMWhIT: number;
}

export interface ScenarioCompleteResult {
  inputs: ScenarioInputs;
  metrics: {
    pue: number;
    wue: number;
    cue: number;
    annualGridLoadGWh: number;
  };
  energy: EnergyBreakdown;
  water: WaterMetrics;
  emissions: EmissionBreakdown;
  timestamp: string;
}

export interface AIAdvisorResponse {
  title: string;
  recommendations: string[];
  tradeoffs: string;
  evidenceGaps: string;
  immediateActions: string[];
  isAIGenerated?: boolean;
  source?: string;
}
