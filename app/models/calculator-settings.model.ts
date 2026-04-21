import db from '@/app/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface TariffSlab {
    limit: number;   // Infinity stored as 999999 in DB
    rate: number;
}

export interface CalculatorSettings {
    // Tariff slabs (NEPRA)
    tariff_slabs: TariffSlab[];
    // Net metering export rate (PKR/kWh)
    export_rate: number;
    // On-grid cost per kW installed (PKR)
    ongrid_cost_per_kw: number;
    // Hybrid cost per kW installed (PKR)
    hybrid_cost_per_kw: number;
    // Peak sun hours per day (Karachi avg)
    peak_sun_hours: number;
    // System efficiency factor (0–1)
    system_efficiency: number;
    // Annual panel degradation rate (0–1)
    panel_degradation: number;
    // Annual tariff increase rate (0–1)
    tariff_increase_rate: number;
    // Days per month assumed
    days_per_month: number;
    // Square feet of roof per kW of panels
    sqft_per_kw: number;
    // On-grid tariff rate used for self-consumption savings
    ongrid_tariff_rate: number;
    // Hybrid tariff rate used for self-consumption savings
    hybrid_tariff_rate: number;
}

// ─── Defaults ──────────────────────────────────────────────────────────────────

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

// ─── DB row interface ───────────────────────────────────────────────────────────

interface SettingsRow extends RowDataPacket {
    setting_key: string;
    setting_value: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function rowsToSettings(rows: SettingsRow[]): CalculatorSettings {
    const map: Record<string, string> = {};
    for (const row of rows) map[row.setting_key] = row.setting_value;

    return {
        tariff_slabs: map.tariff_slabs
            ? JSON.parse(map.tariff_slabs)
            : DEFAULT_SETTINGS.tariff_slabs,
        export_rate: map.export_rate
            ? parseFloat(map.export_rate)
            : DEFAULT_SETTINGS.export_rate,
        ongrid_cost_per_kw: map.ongrid_cost_per_kw
            ? parseFloat(map.ongrid_cost_per_kw)
            : DEFAULT_SETTINGS.ongrid_cost_per_kw,
        hybrid_cost_per_kw: map.hybrid_cost_per_kw
            ? parseFloat(map.hybrid_cost_per_kw)
            : DEFAULT_SETTINGS.hybrid_cost_per_kw,
        peak_sun_hours: map.peak_sun_hours
            ? parseFloat(map.peak_sun_hours)
            : DEFAULT_SETTINGS.peak_sun_hours,
        system_efficiency: map.system_efficiency
            ? parseFloat(map.system_efficiency)
            : DEFAULT_SETTINGS.system_efficiency,
        panel_degradation: map.panel_degradation
            ? parseFloat(map.panel_degradation)
            : DEFAULT_SETTINGS.panel_degradation,
        tariff_increase_rate: map.tariff_increase_rate
            ? parseFloat(map.tariff_increase_rate)
            : DEFAULT_SETTINGS.tariff_increase_rate,
        days_per_month: map.days_per_month
            ? parseInt(map.days_per_month)
            : DEFAULT_SETTINGS.days_per_month,
        sqft_per_kw: map.sqft_per_kw
            ? parseFloat(map.sqft_per_kw)
            : DEFAULT_SETTINGS.sqft_per_kw,
        ongrid_tariff_rate: map.ongrid_tariff_rate
            ? parseFloat(map.ongrid_tariff_rate)
            : DEFAULT_SETTINGS.ongrid_tariff_rate,
        hybrid_tariff_rate: map.hybrid_tariff_rate
            ? parseFloat(map.hybrid_tariff_rate)
            : DEFAULT_SETTINGS.hybrid_tariff_rate,
    };
}

// ─── Public API ────────────────────────────────────────────────────────────────

export async function getCalculatorSettings(): Promise<CalculatorSettings> {
    try {
        const [rows] = await db.query<SettingsRow[]>(
            'SELECT setting_key, setting_value FROM calculator_settings'
        );
        if (!rows.length) return DEFAULT_SETTINGS;
        return rowsToSettings(rows);
    } catch {
        // Table may not exist yet — return safe defaults
        return DEFAULT_SETTINGS;
    }
}

export async function upsertCalculatorSettings(
    settings: Partial<CalculatorSettings>
): Promise<void> {
    const entries: [string, string][] = [];

    if (settings.tariff_slabs !== undefined)
        entries.push(['tariff_slabs', JSON.stringify(settings.tariff_slabs)]);
    if (settings.export_rate !== undefined)
        entries.push(['export_rate', String(settings.export_rate)]);
    if (settings.ongrid_cost_per_kw !== undefined)
        entries.push(['ongrid_cost_per_kw', String(settings.ongrid_cost_per_kw)]);
    if (settings.hybrid_cost_per_kw !== undefined)
        entries.push(['hybrid_cost_per_kw', String(settings.hybrid_cost_per_kw)]);
    if (settings.peak_sun_hours !== undefined)
        entries.push(['peak_sun_hours', String(settings.peak_sun_hours)]);
    if (settings.system_efficiency !== undefined)
        entries.push(['system_efficiency', String(settings.system_efficiency)]);
    if (settings.panel_degradation !== undefined)
        entries.push(['panel_degradation', String(settings.panel_degradation)]);
    if (settings.tariff_increase_rate !== undefined)
        entries.push(['tariff_increase_rate', String(settings.tariff_increase_rate)]);
    if (settings.days_per_month !== undefined)
        entries.push(['days_per_month', String(settings.days_per_month)]);
    if (settings.sqft_per_kw !== undefined)
        entries.push(['sqft_per_kw', String(settings.sqft_per_kw)]);
    if (settings.ongrid_tariff_rate !== undefined)
        entries.push(['ongrid_tariff_rate', String(settings.ongrid_tariff_rate)]);
    if (settings.hybrid_tariff_rate !== undefined)
        entries.push(['hybrid_tariff_rate', String(settings.hybrid_tariff_rate)]);

    for (const [key, value] of entries) {
        await db.query<ResultSetHeader>(
            `INSERT INTO calculator_settings (setting_key, setting_value)
             VALUES (?, ?)
             ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
            [key, value]
        );
    }
}
