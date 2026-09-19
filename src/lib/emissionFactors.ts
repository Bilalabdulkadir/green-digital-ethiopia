export const EMISSION_FACTORS = {
  ETHIOPIA_GRID_AVERAGE_KG_CO2E_KWH: 0.018,
  ETHIOPIA_GRID_MARGINAL_KG_CO2E_KWH: 0.145,
  REGIONAL_COMPARATOR_KG_CO2E_KWH: 0.520,
  DIESEL_KG_CO2E_PER_LITRE: 2.68,
  DIESEL_LITRES_PER_KWH: 0.28,
  EMBODIED_SERVER_KG_CO2E: 1250,
  WATER_EVAPORATIVE_L_PER_KWH_COOLING: 1.8,
  WATER_CLOSED_LOOP_L_PER_KWH_COOLING: 0.25,
  WATER_DIRECT_LIQUID_L_PER_KWH_COOLING: 0.15
};

export const ETHIOPIAN_LOCATIONS: Record<string, { name: string; altMeters: number; meanTempC: number; description: string }> = {
  addis_ababa: {
    name: 'Addis Ababa (Bole ICT Park)',
    altMeters: 2355,
    meanTempC: 16.5,
    description: 'High-altitude, cool plateau. Ideal for free-air economizers 9 months of the year.'
  },
  hawassa: {
    name: 'Hawassa Industrial Park',
    altMeters: 1708,
    meanTempC: 20.2,
    description: 'Moderate Rift Valley climate with direct lake water access & grid proximity.'
  },
  dire_dawa: {
    name: 'Dire Dawa Free Trade Zone',
    altMeters: 1260,
    meanTempC: 25.8,
    description: 'Arid climate requiring hybrid closed-loop cooling and solar PV integration.'
  }
};
