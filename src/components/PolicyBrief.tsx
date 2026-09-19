import React from 'react';
import { ScenarioInputs, ScenarioCompleteResult } from '../types/sustainability';

interface PolicyBriefProps {
  scenarioInputs: ScenarioInputs;
  scenarioResults: ScenarioCompleteResult;
}

export const PolicyBrief: React.FC<PolicyBriefProps> = ({ scenarioInputs, scenarioResults }) => {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-stone-100 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#c5a059]">Policy Brief</span>
          <h2 className="text-2xl font-bold text-[#162e25] mt-1">Green Digital Ethiopia Evidence Summary</h2>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#fcfbf7] p-4 rounded-lg border border-stone-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#162e25]">Scenario Summary</h3>
          <ul className="mt-3 text-xs text-stone-600 space-y-2 leading-relaxed">
            <li><strong>Facility:</strong> {scenarioInputs.facilityName}</li>
            <li><strong>Location:</strong> {scenarioInputs.location}</li>
            <li><strong>IT Capacity:</strong> {scenarioInputs.itCapacityMW} MW</li>
            <li><strong>Cooling Type:</strong> {scenarioInputs.coolingType}</li>
            <li><strong>Average Server Utilization:</strong> {scenarioInputs.averageServerUtilizationPct}%</li>
          </ul>
        </div>

        <div className="bg-[#fcfbf7] p-4 rounded-lg border border-stone-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#162e25]">Deterministic Outputs</h3>
          <ul className="mt-3 text-xs text-stone-600 space-y-2 leading-relaxed">
            <li><strong>PUE:</strong> {scenarioResults.metrics.pue.toFixed(3)}</li>
            <li><strong>WUE:</strong> {scenarioResults.metrics.wue.toFixed(3)} L/kWh</li>
            <li><strong>CUE:</strong> {scenarioResults.metrics.cue.toFixed(3)} kgCO2e/kWh IT</li>
            <li><strong>Annual Grid Load:</strong> {scenarioResults.metrics.annualGridLoadGWh.toFixed(2)} GWh</li>
            <li><strong>Total Annual Emissions:</strong> {scenarioResults.emissions.totalAnnualEmissionsMtCO2e.toFixed(2)} MtCO2e</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
