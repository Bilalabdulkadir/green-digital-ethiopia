import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { ResearchMaturityBanner } from './components/ResearchMaturityBanner';
import { ConceptualModel } from './components/ConceptualModel';
import { ScenarioLab } from './components/ScenarioLab';
import { EvidenceTable } from './components/EvidenceTable';
import { PolicyFramework } from './components/PolicyFramework';
import { AIAdvisor } from './components/AIAdvisor';
import { PolicyBrief } from './components/PolicyBrief';
import { CitationsSection } from './components/CitationsSection';
import { Footer } from './components/Footer';
import { ScenarioInputs } from './types/sustainability';
import { calculateCompleteScenario } from './lib/calculations';

const defaultInputs: ScenarioInputs = {
  facilityName: 'Addis Bole Hyperscale Campus',
  location: 'Addis Ababa (Bole ICT Park)',
  itCapacityMW: 15,
  averageServerUtilizationPct: 65,
  coolingType: 'air_free_cooling',
  ambientTempMeanC: 16.5,
  gridEmissionFactorKgPerKWh: 0.018,
  marginalGridFactorKgPerKWh: 0.145,
  gridReliabilityPct: 98.2,
  backupGeneratorHours: 120,
  dieselEmissionFactorKgPerLitre: 2.68,
  backupFuelConsumptionLPerKWh: 0.28,
  hardwareLifespanYears: 4,
  serverCount: 7500,
  embodiedCarbonPerServerKgCO2e: 1250,
  circularityRecyclingPct: 35,
  wasteHeatReusePct: 15,
  evidenceClasses: {
    gridEmissionFactor: 'empirical',
    coolingPUE: 'regional_benchmark',
    embodiedHardwareCarbon: 'model_assumption',
    waterConsumption: 'regional_benchmark'
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('scenario');
  const [currentInputs, setCurrentInputs] = useState<ScenarioInputs>(defaultInputs);

  const currentResults = useMemo(() => {
    return calculateCompleteScenario(currentInputs);
  }, [currentInputs]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf7] text-[#162e25] font-sans antialiased selection:bg-[#c5a059] selection:text-[#162e25]">
      <ResearchMaturityBanner />
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'nexus' && <ConceptualModel />}
        {activeTab === 'scenario' && (
          <ScenarioLab
            inputs={currentInputs}
            onInputsChange={setCurrentInputs}
            results={currentResults}
          />
        )}
        {activeTab === 'evidence' && <EvidenceTable />}
        {activeTab === 'policy' && <PolicyFramework />}
        {activeTab === 'advisor' && (
          <AIAdvisor
            scenarioInputs={currentInputs}
            scenarioResults={currentResults}
          />
        )}
        {activeTab === 'brief' && (
          <PolicyBrief
            scenarioInputs={currentInputs}
            scenarioResults={currentResults}
          />
        )}
        {activeTab === 'citations' && <CitationsSection />}
      </main>

      <Footer />
    </div>
  );
}
