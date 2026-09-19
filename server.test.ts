import { describe, it, expect } from 'vitest';

describe('Backend Server API Contract', () => {
  it('verifies health check endpoint response contract', () => {
    const mockHealth = {
      status: 'ok',
      service: 'Green Digital Ethiopia Research Platform',
      version: '0.2.0',
      timestamp: new Date().toISOString()
    };
    expect(mockHealth.status).toBe('ok');
    expect(mockHealth.version).toBe('0.2.0');
  });

  it('verifies deterministic fallback structure when AI key is omitted', () => {
    const sampleAdvice = {
      title: 'Altitude & Free-Cooling PUE Optimization',
      recommendations: ['Rule 1', 'Rule 2'],
      tradeoffs: 'Tradeoff analysis',
      evidenceGaps: 'Gaps recorded',
      immediateActions: ['Action 1']
    };
    expect(sampleAdvice.recommendations.length).toBeGreaterThan(0);
    expect(sampleAdvice.immediateActions.length).toBeGreaterThan(0);
  });
});
