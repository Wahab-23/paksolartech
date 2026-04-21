/**
 * Default calculator settings — no DB imports.
 * Safe to import in both client and server contexts.
 */

import type { CalculatorSettings } from "@/lib/calculatorEngine";

export const DEFAULT_SETTINGS: CalculatorSettings = {
    tariff_slabs: [
        { limit: 100, rate: 25.0 },
        { limit: 200, rate: 32.0 },
        { limit: 300, rate: 40.0 },
        { limit: 400, rate: 50.0 },
        { limit: 500, rate: 55.0 },
        { limit: 600, rate: 58.0 },
        { limit: 700, rate: 62.0 },
        { limit: 999999, rate: 68.0 },
    ],
    export_rate: 21.0,
    ongrid_cost_per_kw: 95000,
    hybrid_cost_per_kw: 155000,
    peak_sun_hours: 5.5,
    system_efficiency: 0.8,
    panel_degradation: 0.005,
    tariff_increase_rate: 0.1,
    days_per_month: 30,
    sqft_per_kw: 80,
    ongrid_tariff_rate: 55.0,
    hybrid_tariff_rate: 50.0,
};
