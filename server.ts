import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

// API Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Green Digital Ethiopia Research Platform',
    version: '0.2.0',
    timestamp: new Date().toISOString()
  });
});

// Lazy-initialized Gemini AI Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// AI Policy Advisory Endpoint
app.post('/api/ai/advisor', async (req: Request, res: Response): Promise<void> => {
  try {
    const { scenarioInputs, scenarioResults, focusArea } = req.body;

    const client = getGeminiClient();
    if (!client) {
      const fallbackAdvisories: Record<string, any> = {
        pue_optimization: {
          title: 'Altitude & Free-Cooling PUE Optimization',
          recommendations: [
            'Leverage Addis Ababa and high-plateau diurnal temperature swings (avg 15-22°C dry bulb) for direct-air economizer cycles, reducing mechanical chiller runtimes by up to 65%.',
            'Mandate ASHRAE TC 9.9 Thermal Guidelines (Class A1 Recommended: 18-27°C allowable) across federal colocation tenders.',
            'Incorporate closed-loop adiabatic evaporative cooling for dry-season peaks to maintain WUE below 0.5 L/kWh.'
          ],
          tradeoffs: 'Tradeoff between mechanical energy reduction and air filtration maintenance against fine volcanic particulate matter.',
          evidenceGaps: 'Empirical field instrumentation data from operational high-density HPC racks in Addis Ababa is sparse.',
          immediateActions: ['Require real-time continuous PUE telemetry on all public data center tenders.']
        },
        grid_integration: {
          title: 'Renewable Balancing & Captive Geothermal/Hydro Integration',
          recommendations: [
            'Establish interruptible load tariff agreements with Ethiopian Electric Power (EEP) in exchange for wholesale rate discounts.',
            'Mandate Tier 3/4 facilities near the Rift Valley to evaluate captive microgrids pairing base-load geothermal with GERD hydro balancing.',
            'Install utility-scale Battery Energy Storage Systems (BESS) for peak shaving to eliminate daily diesel genset cold starts.'
          ],
          tradeoffs: 'High initial capital expenditure for BESS vs. long-term fuel import vulnerabilities and transmission congestion.',
          evidenceGaps: 'EEP transmission feeder reliability statistics under extreme seasonal drought conditions.',
          immediateActions: ['Form joint EEP-MINT data center power scheduling committee.']
        },
        lifecycle_circularity: {
          title: 'Hardware Life Extension & Circular E-Waste Stewardship',
          recommendations: [
            'Extend federal server refresh cycles from 3 to 5 years paired with secondary market refurbishments.',
            'Incentivize local component reclamation and e-waste recycling hubs within ICT Park.',
            'Implement mandatory material passports and Scope 3 lifecycle accounting for hyperscale deployments.'
          ],
          tradeoffs: 'Potential server efficiency losses in years 4-5 vs. immediate avoidance of high embodied manufacturing emissions.',
          evidenceGaps: 'Formal domestic secondary server market size and local component testing accreditation.',
          immediateActions: ['Publish national guidelines for public sector server decommissioning.']
        },
        national_policy: {
          title: 'Digital Ethiopia 2025 Green Data Sovereignty',
          recommendations: [
            'Require all new facilities above 5MW IT load to achieve PUE ≤ 1.30 and WUE ≤ 0.8 L/kWh by year 2 of operation.',
            'Enact Green Public Procurement (GPP) rules favoring cloud services running on audited green infrastructure.',
            'Introduce tax incentives for waste-heat reuse partnerships with industrial agro-parks and district heating.'
          ],
          tradeoffs: 'Risk of deterring low-capital international hosting providers against establishing long-term regional leadership in green compute.',
          evidenceGaps: 'Cross-border data latency and energy pricing competitiveness models across East Africa.',
          immediateActions: ['Draft national Green Data Center Regulatory Standard under the Ministry of Innovation & Technology.']
        }
      };

      const selected = fallbackAdvisories[focusArea] || fallbackAdvisories.national_policy;
      res.json({
        ...selected,
        isAIGenerated: false,
        source: 'Deterministic Regional Policy Corpus (Digital Ethiopia 2025 & UNEP Framework)'
      });
      return;
    }

    const prompt = `You are the Lead Sustainability Policy Advisor for the Ministry of Innovation and Technology (MInT) and Ethiopian Electric Power (EEP).
Analyze the following data center sustainability scenario and provide rigorous, actionable policy and technical advisory:

SCENARIO METRICS:
- Facility Capacity: ${scenarioInputs?.itCapacityMW || 10} MW IT Load
- PUE Target: ${scenarioResults?.metrics?.pue || 1.35}
- WUE: ${scenarioResults?.metrics?.wue || 0.4} L/kWh
- Annual Electricity Consumption: ${scenarioResults?.energy?.totalAnnualElectricityGWh || 0} GWh/yr
- Annual Carbon Emissions: ${scenarioResults?.emissions?.totalAnnualEmissionsMtCO2e || 0} MtCO2e
- Grid Carbon Intensity: ${scenarioInputs?.gridEmissionFactorKgPerKWh || 0.018} kg CO2e/kWh
- Backup Diesel Run: ${scenarioInputs?.backupGeneratorHours || 120} hrs/yr
- Cooling Tech: ${scenarioInputs?.coolingType || 'evaporative'}
- Regional Location: ${scenarioInputs?.location || 'Addis Ababa'}

FOCUS AREA: ${focusArea}

Respond with valid JSON formatted strictly as:
{
  "title": "Short strategic title",
  "recommendations": ["Point 1", "Point 2", "Point 3"],
  "tradeoffs": "Detailed discussion of engineering and economic tradeoffs",
  "evidenceGaps": "Known data limitations and empirical verification gaps",
  "immediateActions": ["Action item 1", "Action item 2"]
}`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      ...parsed,
      isAIGenerated: true,
      source: 'Gemini 2.5 Policy Synthesis'
    });
  } catch (error: any) {
    console.error('AI Advisor error:', error);
    res.status(500).json({ error: 'Failed to generate policy advice', details: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Green Digital Ethiopia Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
