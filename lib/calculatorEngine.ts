/**
 * Pure calculation engine for the solar calculator.
 * Shared between client components and server-side code.
 * No React imports — safe for server and client use.
 */

import type { CalculatorSettings, TariffSlab } from '@/app/models/calculator-settings.model';

export type { CalculatorSettings };

export type SystemType = 'ongrid' | 'hybrid';
export type InputMode = 'bill' | 'units';

export interface BarPoint {
    year: number;
    cumulative: number;
}

export interface CalcResult {
    kwh: number;
    sizeKw: number;
    totalCost: number;
    monthlyGen: number;
    selfConsume: number;
    exported: number;
    monthlySavings: number;
    annualSavings: number;
    payback: number;
    totalLifeSavings: number;
    roi: number;
    roofNeeded: number;
    barData: BarPoint[];
    slabLabel: string;
    roofConstrained: boolean;
}

// ─── Tariff helpers ────────────────────────────────────────────────────────────

export function getKwhFromBill(bill: number, slabs: TariffSlab[]): number {
    let cost = 0;
    for (let i = 0; i < slabs.length; i++) {
        const from = i === 0 ? 0 : slabs[i - 1].limit;
        const to = slabs[i].limit;
        const isLast = i === slabs.length - 1;
        const slabCost = isLast ? Infinity : (to - from) * slabs[i].rate;

        if (cost + slabCost >= bill) {
            return Math.round((bill - cost) / slabs[i].rate + from);
        }
        cost += isLast ? 0 : slabCost;
    }
    return Math.round(bill / 8);
}

export function getSlabLabel(kwh: number, slabs: TariffSlab[]): string {
    for (let i = 0; i < slabs.length; i++) {
        const from = i === 0 ? 1 : slabs[i - 1].limit + 1;
        const to = slabs[i].limit >= 999999 ? '∞' : slabs[i].limit;
        if (kwh <= slabs[i].limit) {
            return `Slab ${i + 1} (${from}–${to} units) @ Rs. ${slabs[i].rate}/kWh`;
        }
    }
    return `@ Rs. ${slabs[slabs.length - 1].rate}/kWh`;
}

export function fmt(n: number): string {
    return Math.round(n).toLocaleString('en-PK');
}

// ─── Main calculation engine ───────────────────────────────────────────────────

export function runCalculation(
    kwh: number,
    sysType: SystemType,
    roofVal: number,
    settings: CalculatorSettings
): CalcResult {
    const {
        peak_sun_hours,
        days_per_month,
        system_efficiency,
        sqft_per_kw,
        export_rate,
        ongrid_cost_per_kw,
        hybrid_cost_per_kw,
        ongrid_tariff_rate,
        hybrid_tariff_rate,
        panel_degradation,
        tariff_increase_rate,
        tariff_slabs,
    } = settings;

    let sizeKw = kwh / (peak_sun_hours * days_per_month * system_efficiency);
    sizeKw = Math.ceil(sizeKw * 2) / 2;

    let roofConstrained = false;
    if (roofVal > 0 && roofVal < sizeKw * sqft_per_kw) {
        const maxKw = Math.floor((roofVal / sqft_per_kw) * 2) / 2;
        sizeKw = Math.max(maxKw, 1);
        roofConstrained = true;
    }

    const costPerKw = sysType === 'hybrid' ? hybrid_cost_per_kw : ongrid_cost_per_kw;
    const totalCost = sizeKw * costPerKw;

    const tariff = sysType === 'hybrid' ? hybrid_tariff_rate : ongrid_tariff_rate;
    const monthlyGen = sizeKw * peak_sun_hours * days_per_month * system_efficiency;
    const selfConsume = Math.min(kwh, monthlyGen) * 0.7;
    const exported = sysType === 'hybrid' ? 0 : Math.max(0, monthlyGen - selfConsume);
    const monthlySavings = selfConsume * tariff + exported * export_rate;
    const annualSavings = monthlySavings * 12;
    const payback = annualSavings > 0 ? totalCost / annualSavings : 0;

    // 25-year projection
    let cumSave = 0;
    const barData: BarPoint[] = [];

    for (let y = 1; y <= 25; y++) {
        const factor =
            Math.pow(1 - panel_degradation, y - 1) *
            Math.pow(1 + tariff_increase_rate, y - 1);
        cumSave += annualSavings * factor;
        if (y % 5 === 0) barData.push({ year: y, cumulative: cumSave });
    }

    const totalLifeSavings = cumSave;
    const roi = totalCost > 0 ? ((totalLifeSavings - totalCost) / totalCost) * 100 : 0;

    return {
        kwh,
        sizeKw,
        totalCost,
        monthlyGen,
        selfConsume,
        exported,
        monthlySavings,
        annualSavings,
        payback,
        totalLifeSavings,
        roi,
        roofNeeded: Math.ceil(sizeKw * sqft_per_kw),
        barData,
        slabLabel: getSlabLabel(kwh, tariff_slabs),
        roofConstrained,
    };
}
