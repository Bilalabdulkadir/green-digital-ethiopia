import React, { useState } from 'react';
import { Sparkles, AlertCircle, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { ScenarioInputs, ScenarioCompleteResult, AIAdvisorResponse } from '../types/sustainability';

interface AIAdvisorProps {
  scenarioInputs: ScenarioInputs;
  scenarioResults: ScenarioCompleteResult;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ scenarioInputs, scenarioResults }) => {
  const [focusArea, setFocusArea] = useState<'pue_optimization' | 'grid_integration' | 'lifecycle_circularity' | 'national_policy'>('pue_optimization');
  const [loading, setLoading] = useState(false);
  const [advisory, setAdvisory] = useState<AIAdvisorResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateAdvisory = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioInputs,
          scenarioResults,
          focusArea
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data: AIAdvisorResponse = await response.json();
      setAdvisory(data);
    } catch (err: any) {
      console.error('Failed to generate AI advisory:', err);
      setError('Unable to contact advisory service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-stone-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#c5a059]">AI Policy Advisor</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Ground Truth Enforced</span>
          </div>
          <h2 className="text-2xl font-bold text-[#162e25] mt-1">Grounded Advisory</h2>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select value={focusArea} onChange={(e) => setFocusArea(e.target.value as any)} className="text-xs bg-[#f6f4ee] border border-stone-300 rounded px-3 py-2 font-medium text-stone-800 focus:outline-none">
            <option value="pue_optimization">Focus: PUE &amp; Ambient Cooling</option>
            <option value="grid_integration">Focus: Renewable Grid &amp; PPAs</option>
            <option value="lifecycle_circularity">Focus: Lifecycle &amp; E-Waste</option>
            <option value="national_policy">Focus: National Governance &amp; Strategy</option>
          </select>

          <button onClick={handleGenerateAdvisory} disabled={loading} className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#162e25] hover:bg-[#203f33] text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin text-[#c5a059]" /><span>Synthesizing...</span></> : <><Sparkles className="w-4 h-4 text-[#c5a059]" /><span>Run Advisory Synthesis</span></>}
          </button>
        </div>
      </div>

      {advisory ? (
        <div className="mt-6 space-y-6">
          <div className="bg-[#f6f4ee] p-3 rounded-lg border border-[#e2ddd1] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-stone-700">
              <ShieldCheck className="w-4 h-4 text-[#162e25]" />
              <span className="font-semibold text-[#162e25]">Grounding Notice:</span>
              <span>{advisory.evidenceGaps}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#162e25]">Strategic Interventions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {advisory.recommendations.map((recommendation, index) => (
                <div key={index} className="bg-[#fcfbf7] p-4 rounded-lg border border-stone-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#162e25]">Priority {index + 1}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-stone-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#162e25]">Tradeoffs</h4>
              <p className="text-xs text-stone-600 leading-relaxed mt-1">{advisory.tradeoffs}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-stone-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#162e25]">Immediate Actions</h4>
              <ul className="mt-1 text-xs text-stone-600 leading-relaxed list-disc ml-4">
                {advisory.immediateActions.map((action, index) => <li key={index}>{action}</li>)}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 text-center py-12 px-4 rounded-xl border border-dashed border-stone-300 bg-[#fcfbf7]">
          <Sparkles className="w-8 h-8 text-[#c5a059] mx-auto mb-2" />
          <h3 className="text-base font-bold text-[#162e25]">No Advisory Generated Yet</h3>
          <p className="text-xs text-stone-600 max-w-md mx-auto mt-1">Select a policy focus and synthesize an advisory for the current scenario.</p>
          <button onClick={handleGenerateAdvisory} disabled={loading} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#162e25] text-white text-xs font-bold hover:bg-[#203f33] transition-all shadow-xs">
            <Sparkles className="w-4 h-4 text-[#c5a059]" />
            <span>Generate Initial Advisory</span>
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
