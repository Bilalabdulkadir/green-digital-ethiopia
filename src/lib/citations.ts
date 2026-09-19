export interface CitationItem {
  id: string;
  title: string;
  authors: string;
  source: string;
  year: number;
  category: 'Grid & Energy' | 'Cooling & Infrastructure' | 'National Policy' | 'Life Cycle Assessment';
  summary: string;
  doiOrUrl?: string;
}

export const CITATIONS: CitationItem[] = [
  {
    id: 'EEP-2023-GRID',
    title: 'Ethiopian Electric Power Annual Statistical Bulletin 2022/2023',
    authors: 'Ethiopian Electric Power (EEP)',
    source: 'Federal Democratic Republic of Ethiopia',
    year: 2023,
    category: 'Grid & Energy',
    summary: 'Primary empirical source validating Ethiopia 96%+ hydro/wind generation mix and average grid intensity baseline of 0.018 kg CO2e/kWh.'
  },
  {
    id: 'MINT-2020-DIGITAL',
    title: 'Digital Ethiopia 2025: A Digital Strategy for Ethiopia Inclusive Prosperity',
    authors: 'Ministry of Innovation and Technology (MInT)',
    source: 'FDRE Council of Ministers Directive',
    year: 2020,
    category: 'National Policy',
    summary: 'National roadmap outlining infrastructure modernization, ICT park expansions, and sovereign cloud data residency goals.'
  },
  {
    id: 'ASHRAE-TC99-2021',
    title: 'Thermal Guidelines for Data Processing Environments, 5th Edition',
    authors: 'ASHRAE Technical Committee 9.9',
    source: 'ASHRAE Datacom Series',
    year: 2021,
    category: 'Cooling & Infrastructure',
    summary: 'Global engineering standards for allowable intake temperatures, economizer thresholds, and thermal compliance in high-altitude environments.'
  },
  {
    id: 'ISO-30134-2',
    title: 'ISO/IEC 30134-2: Information Technology — Data Centres Key Performance Indicators — Power Usage Effectiveness (PUE)',
    authors: 'ISO/IEC JTC 1/SC 39',
    source: 'International Organization for Standardization',
    year: 2016,
    category: 'Cooling & Infrastructure',
    summary: 'Formal mathematical formulation for category-specific PUE calculation and measurement boundaries.'
  },
  {
    id: 'UNEP-2024-CIRCULAR',
    title: 'Global E-Waste Monitor 2024: Electronic Waste Flows in Developing Digital Hubs',
    authors: 'United Nations Environment Programme (UNEP) & ITU',
    source: 'United Nations Publications',
    year: 2024,
    category: 'Life Cycle Assessment',
    summary: 'Documents embodied server emissions and formal recycling infrastructure challenges across East African ICT corridors.'
  }
];
