import { PUEResult, EnergySavingsResult, CarbonEmissionsResult, HardwareLifecycleResult, ScenarioInputs, ScenarioCompleteResult } from '../types/sustainability';
import { getEmissionFactorById } from './emissionFactors';

export function calculatePUE(facilityEnergyKWh:number,itEnergyKWh:number):PUEResult {
  if (![facilityEnergyKWh,itEnergyKWh].every(Number.isFinite)) return {pue:0,itEnergyKWh:0,facilityEnergyKWh:0,overheadKWh:0,overheadPercentage:0,isValid:false,error:'Energy inputs must be valid finite numbers'};
  if (itEnergyKWh<=0) return {pue:0,itEnergyKWh,facilityEnergyKWh,overheadKWh:0,overheadPercentage:0,isValid:false,error:'IT Equipment Energy must be strictly greater than 0'};
  if (facilityEnergyKWh<itEnergyKWh) return {pue:0,itEnergyKWh,facilityEnergyKWh,overheadKWh:0,overheadPercentage:0,isValid:false,error:'Total Facility Energy cannot be less than IT Equipment Energy (PUE cannot be < 1.0)'};
  const overheadKWh=Math.round((facilityEnergyKWh-itEnergyKWh)*100)/100;
  return {pue:Math.round((facilityEnergyKWh/itEnergyKWh)*1000)/1000,itEnergyKWh,facilityEnergyKWh,overheadKWh,overheadPercentage:Math.round((overheadKWh/facilityEnergyKWh)*1000)/10,isValid:true};
}

export function calculateEnergySavings(servers:number,wattsSavedPerServer:number,operatingHoursPerDay=24):EnergySavingsResult {
  if (![servers,wattsSavedPerServer,operatingHoursPerDay].every(Number.isFinite)) return {annualKWhSaved:0,dailyKWhSaved:0,isValid:false,error:'Inputs must be valid finite numbers'};
  if (servers<0||wattsSavedPerServer<0||operatingHoursPerDay<0) return {annualKWhSaved:0,dailyKWhSaved:0,isValid:false,error:'Servers, watts saved, and operating hours cannot be negative'};
  if (operatingHoursPerDay>24) return {annualKWhSaved:0,dailyKWhSaved:0,isValid:false,error:'Operating hours per day cannot exceed 24 hours'};
  const daily=servers*wattsSavedPerServer*operatingHoursPerDay/1000;
  return {dailyKWhSaved:Math.round(daily*100)/100,annualKWhSaved:Math.round(daily*365*100)/100,isValid:true};
}

export function calculateCarbon(energyKWh:number,emissionFactorKgPerKWh:number,sourceDescription='Specified Factor'):CarbonEmissionsResult {
  if (![energyKWh,emissionFactorKgPerKWh].every(Number.isFinite)) return {operationalKgCO2e:0,operationalTonsCO2e:0,emissionFactorUsed:0,emissionFactorSource:sourceDescription,isValid:false,error:'Energy and emission factor must be valid finite numbers'};
  if (energyKWh<0||emissionFactorKgPerKWh<0) return {operationalKgCO2e:0,operationalTonsCO2e:0,emissionFactorUsed:emissionFactorKgPerKWh,emissionFactorSource:sourceDescription,isValid:false,error:'Energy and emission factor cannot be negative'};
  const kg=energyKWh*emissionFactorKgPerKWh;
  return {operationalKgCO2e:Math.round(kg*100)/100,operationalTonsCO2e:Math.round(kg/1000*1000)/1000,emissionFactorUsed:emissionFactorKgPerKWh,emissionFactorSource:sourceDescription,isValid:true};
}

export function calculateAvoidedCarbon(baselineCarbonKg:number,scenarioCarbonKg:number) { const avoidedKg=Math.max(0,baselineCarbonKg-scenarioCarbonKg); return {avoidedKg:Math.round(avoidedKg*100)/100,avoidedTons:Math.round(avoidedKg/1000*1000)/1000,percentReduction:baselineCarbonKg>0?Math.round((baselineCarbonKg-scenarioCarbonKg)/baselineCarbonKg*1000)/10:0}; }

export function calculateHardwareLifecycle(deviceCount:number,baselineLifespanYears:number,extendedLifespanYears:number,embodiedKgCO2ePerDevice=1250,weightKgPerDevice=22.5):HardwareLifecycleResult {
  const empty={deviceCount,baselineLifespanYears,extendedLifespanYears,baselineAnnualReplacements:0,extendedAnnualReplacements:0,annualDevicesSaved:0,avoidedEmbodiedKgCO2eAnnual:0,avoidedEmbodiedTonsCO2eAnnual:0,avoidedEWasteKgAnnual:0,avoidedEWasteTonsAnnual:0};
  if (![deviceCount,baselineLifespanYears,extendedLifespanYears,embodiedKgCO2ePerDevice,weightKgPerDevice].every(Number.isFinite)) return {...empty,isValid:false,error:'Device count and lifespans must be valid numbers'};
  if(deviceCount<0||baselineLifespanYears<=0||extendedLifespanYears<=0) return {...empty,isValid:false,error:'Device count cannot be negative and lifespans must be strictly greater than 0'};
  if(extendedLifespanYears<baselineLifespanYears) return {...empty,isValid:false,error:'Extended lifespan cannot be shorter than baseline lifespan'};
  const base=deviceCount/baselineLifespanYears, ext=deviceCount/extendedLifespanYears, saved=Math.max(0,base-ext), embodied=saved*embodiedKgCO2ePerDevice, waste=saved*weightKgPerDevice;
  return {deviceCount,baselineLifespanYears,extendedLifespanYears,baselineAnnualReplacements:Math.round(base*10)/10,extendedAnnualReplacements:Math.round(ext*10)/10,annualDevicesSaved:Math.round(saved*10)/10,avoidedEmbodiedKgCO2eAnnual:Math.round(embodied*100)/100,avoidedEmbodiedTonsCO2eAnnual:Math.round(embodied)/1000,avoidedEWasteKgAnnual:Math.round(waste*100)/100,avoidedEWasteTonsAnnual:Math.round(waste)/1000,isValid:true};
}

export function calculateCompleteScenario(inputs:ScenarioInputs):ScenarioCompleteResult {
  const pue=calculatePUE(inputs.totalFacilityEnergyKWh,inputs.itEquipmentEnergyKWh); const energySavings=calculateEnergySavings(inputs.serverCount,inputs.wattsSavedPerServer,inputs.operatingHoursPerDay); const factor=getEmissionFactorById(inputs.gridEmissionFactorId);
  const baselineCarbon=calculateCarbon(inputs.totalFacilityEnergyKWh,factor.value,factor.name); let optimizedFacilityKWh=inputs.totalFacilityEnergyKWh;
  if(pue.isValid&&inputs.targetPUE>=1&&inputs.targetPUE<pue.pue) optimizedFacilityKWh=Math.max(inputs.itEquipmentEnergyKWh,inputs.itEquipmentEnergyKWh*inputs.targetPUE-energySavings.annualKWhSaved); else optimizedFacilityKWh=Math.max(inputs.itEquipmentEnergyKWh,inputs.totalFacilityEnergyKWh-energySavings.annualKWhSaved);
  const ppa=Math.min(1,Math.max(0,inputs.renewablePPAFraction)); const optimizedCarbon=calculateCarbon(optimizedFacilityKWh,factor.value*(1-ppa),`Optimized Mix (${(ppa*100).toFixed(0)}% Dedicated Clean PPA + EEP Grid)`); const lifecycle=calculateHardwareLifecycle(inputs.deviceCount,inputs.baselineLifespanYears,inputs.extendedLifespanYears,inputs.embodiedCarbonPerDeviceKg,inputs.deviceWeightKg);
  return {scenarioId:`GDE-SCENARIO-${Date.now().toString(36).toUpperCase()}`,timestamp:new Date().toISOString(),pue,energySavings,baselineCarbon,optimizedCarbon,lifecycle,netAvoidedCarbonTonsAnnual:Math.round((Math.max(0,baselineCarbon.operationalTonsCO2e-optimizedCarbon.operationalTonsCO2e)+lifecycle.avoidedEmbodiedTonsCO2eAnnual)*1000)/1000,metadata:{methodologyVersion:'NEXUS-GDE-Methodology-v0.2-Deterministic',calculationEngine:'TypeScript-PureMath-ISO-30134-2-Compliant',author:'Bilal Abdulkadir Muhammed'}};
}
