import { EmissionFactor } from '../types/sustainability';

export const EMISSION_FACTORS: EmissionFactor[] = [
  { id: 'ethiopia_grid_iea_2023', name: 'Ethiopian Electric Power (EEP) National Grid Mix', value: 0.032, unit: 'kgCO2e/kWh', source: 'IEA Africa Energy Outlook (2022/2023) & EEP Generation Mix Baseline', effectiveDate: '2023-01-01', methodologyVersion: 'GHG Protocol Scope 2 Location-Based / IEA Emission Factors v2023', note: 'Reflects generation mix dominated by GERD, Gibe cascade, Adama wind farms, and Aluto Langano geothermal.' },
  { id: 'sub_saharan_africa_avg', name: 'Sub-Saharan Africa Regional Grid Average (Comparative Benchmark)', value: 0.485, unit: 'kgCO2e/kWh', source: 'IEA Regional Energy Balances and Carbon Intensity Baseline', effectiveDate: '2023-01-01', methodologyVersion: 'GHG Protocol Scope 2 Location-Based Benchmark', note: 'Comparative regional baseline.' },
  { id: 'global_dc_grid_average', name: 'Global Average Data Center Grid Carbon Intensity', value: 0.390, unit: 'kgCO2e/kWh', source: 'Uptime Institute Global Data Center Carbon Benchmark / IEA', effectiveDate: '2023-06-01', methodologyVersion: 'Global Fleet Weighted Average Scope 2', note: 'Global reference point.' },
  { id: 'diesel_generator_backup', name: 'Onsite Diesel Generator Backup (Stationary Combustion)', value: 0.810, unit: 'kgCO2e/kWh_electric', source: 'IPCC Guidelines for National GHG Inventories - Stationary Combustion', effectiveDate: '2021-01-01', methodologyVersion: 'IPCC Tier 1 Default Factors (Gas/Diesel Oil)', note: 'Backup generation factor.' },
  { id: 'server_embodied_footprint_1u', name: 'Standard Rack Server Embodied Manufacturing Footprint', value: 1250, unit: 'kgCO2e/unit', source: 'Dell & HPE Life Cycle Assessments (LCA) for Enterprise Rack Servers (averaged)', effectiveDate: '2022-10-01', methodologyVersion: 'ISO 14040/14044 Life Cycle Assessment standard', note: 'Manufacturing and transport footprint.' }
];

export function getEmissionFactorById(id: string): EmissionFactor {
  return EMISSION_FACTORS.find(f => f.id === id) ?? EMISSION_FACTORS[0];
}
