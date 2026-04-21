"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, RotateCcw, Plus, Trash2, Settings2, Zap, Sun, DollarSign, TrendingUp } from "lucide-react";
import type { CalculatorSettings, TariffSlab } from "@/app/models/calculator-settings.model";
import { DEFAULT_SETTINGS } from "@/lib/calculatorDefaults";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Status = "idle" | "saving" | "saved" | "error";

// ─── Section wrapper ───────────────────────────────────────────────────────────

function Section({
    icon: Icon,
    title,
    description,
    children,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-border/50 bg-card/50 p-6">
            <div className="mb-5 flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                    <h2 className="font-semibold text-sm">{title}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                </div>
            </div>
            {children}
        </div>
    );
}

// ─── Field wrapper ─────────────────────────────────────────────────────────────

function Field({
    label,
    hint,
    children,
}: {
    label: string;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium">{label}</label>
            {children}
            {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function CalculatorSettingsPage() {
    const [settings, setSettings] = useState<CalculatorSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<Status>("idle");

    useEffect(() => {
        fetch("/api/admin/calculator-settings")
            .then((r) => r.json())
            .then((data) => {
                setSettings({ ...DEFAULT_SETTINGS, ...data });
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    function setField<K extends keyof CalculatorSettings>(key: K, value: CalculatorSettings[K]) {
        setSettings((prev) => ({ ...prev, [key]: value }));
    }

    function setNumField(key: keyof CalculatorSettings, raw: string) {
        const val = parseFloat(raw);
        if (!isNaN(val)) setField(key, val as never);
    }

    // Tariff slab helpers
    function updateSlab(idx: number, field: keyof TariffSlab, raw: string) {
        const val = parseFloat(raw);
        if (isNaN(val)) return;
        const slabs = settings.tariff_slabs.map((s, i) =>
            i === idx ? { ...s, [field]: val } : s
        );
        setField("tariff_slabs", slabs);
    }

    function addSlab() {
        const last = settings.tariff_slabs[settings.tariff_slabs.length - 1];
        const slabs = [
            ...settings.tariff_slabs,
            { limit: (last?.limit ?? 0) + 100, rate: (last?.rate ?? 0) + 2 },
        ];
        setField("tariff_slabs", slabs);
    }

    function removeSlab(idx: number) {
        if (settings.tariff_slabs.length <= 1) return;
        setField("tariff_slabs", settings.tariff_slabs.filter((_, i) => i !== idx));
    }

    async function save() {
        setStatus("saving");
        try {
            const res = await fetch("/api/admin/calculator-settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });
            setStatus(res.ok ? "saved" : "error");
            if (res.ok) setTimeout(() => setStatus("idle"), 2500);
        } catch {
            setStatus("error");
        }
    }

    function resetToDefaults() {
        if (confirm("Reset all settings to factory defaults?")) {
            setSettings(DEFAULT_SETTINGS);
        }
    }

    if (loading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-32 rounded-xl bg-card/50 border border-border/50 animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <>
            {/* Header */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Calculator Settings</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Configure NEPRA tariff slabs, installation costs, and projection parameters.
                        Changes take effect within 60 seconds on the live site.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={resetToDefaults} className="gap-2">
                        <RotateCcw className="h-3.5 w-3.5" />
                        Defaults
                    </Button>
                    <Button
                        size="sm"
                        onClick={save}
                        disabled={status === "saving"}
                        className={`gap-2 ${status === "saved" ? "bg-emerald-600 hover:bg-emerald-600" : status === "error" ? "bg-destructive hover:bg-destructive" : ""}`}
                    >
                        <Save className="h-3.5 w-3.5" />
                        {status === "saving" ? "Saving…" : status === "saved" ? "Saved!" : status === "error" ? "Error" : "Save Changes"}
                    </Button>
                </div>
            </div>

            <div className="space-y-5">
                {/* ── NEPRA Tariff Slabs ─────────────────────────────────── */}
                <Section icon={Zap} title="NEPRA Tariff Slabs" description="Bill-to-kWh conversion table. Last slab is treated as the open-ended top slab (use 999999 as limit).">
                    <div className="space-y-2">
                        {/* Column headers */}
                        <div className="grid grid-cols-[1fr_1fr_40px] gap-2 px-1">
                            <span className="text-xs font-medium text-muted-foreground">Units limit</span>
                            <span className="text-xs font-medium text-muted-foreground">Rate (Rs./kWh)</span>
                            <span />
                        </div>

                        {settings.tariff_slabs.map((slab, idx) => (
                            <div key={idx} className="grid grid-cols-[1fr_1fr_40px] items-center gap-2">
                                <Input
                                    type="number"
                                    value={slab.limit === 999999 ? 999999 : slab.limit}
                                    onChange={(e) => updateSlab(idx, "limit", e.target.value)}
                                    className="h-9 bg-background text-sm"
                                    placeholder="e.g. 200"
                                />
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={slab.rate}
                                    onChange={(e) => updateSlab(idx, "rate", e.target.value)}
                                    className="h-9 bg-background text-sm"
                                    placeholder="e.g. 7.74"
                                />
                                <button
                                    onClick={() => removeSlab(idx)}
                                    disabled={settings.tariff_slabs.length <= 1}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-destructive/50 hover:text-destructive disabled:opacity-30 transition-colors"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        ))}

                        <Button variant="outline" size="sm" onClick={addSlab} className="mt-1 gap-2 h-9">
                            <Plus className="h-3.5 w-3.5" />
                            Add Slab
                        </Button>
                    </div>
                </Section>

                {/* ── Export & Self-Consumption Rates ───────────────────── */}
                <Section icon={DollarSign} title="Tariff Rates" description="Rates used to calculate monetary savings from self-consumed solar and exported energy.">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Field label="On-grid self-consumption rate (Rs./kWh)" hint="Effective saving per kWh consumed from panels">
                            <Input type="number" step="0.01" value={settings.ongrid_tariff_rate}
                                onChange={(e) => setNumField("ongrid_tariff_rate", e.target.value)}
                                className="h-10 bg-background" />
                        </Field>
                        <Field label="Hybrid self-consumption rate (Rs./kWh)" hint="Lower than on-grid as surplus goes to battery">
                            <Input type="number" step="0.01" value={settings.hybrid_tariff_rate}
                                onChange={(e) => setNumField("hybrid_tariff_rate", e.target.value)}
                                className="h-10 bg-background" />
                        </Field>
                        <Field label="Net metering export rate (Rs./kWh)" hint="WAPDA TOU off-peak export buyback rate">
                            <Input type="number" step="0.01" value={settings.export_rate}
                                onChange={(e) => setNumField("export_rate", e.target.value)}
                                className="h-10 bg-background" />
                        </Field>
                    </div>
                </Section>

                {/* ── Installation Costs ────────────────────────────────── */}
                <Section icon={Settings2} title="Installation Costs" description="Average cost per kW installed. Adjust seasonally to reflect current market pricing.">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="On-grid cost per kW (PKR)" hint="Includes panels, inverter, wiring & labour">
                            <Input type="number" step="1000" value={settings.ongrid_cost_per_kw}
                                onChange={(e) => setNumField("ongrid_cost_per_kw", e.target.value)}
                                className="h-10 bg-background" />
                        </Field>
                        <Field label="Hybrid cost per kW (PKR)" hint="On-grid + battery storage premium">
                            <Input type="number" step="1000" value={settings.hybrid_cost_per_kw}
                                onChange={(e) => setNumField("hybrid_cost_per_kw", e.target.value)}
                                className="h-10 bg-background" />
                        </Field>
                    </div>
                </Section>

                {/* ── Solar Resource & System Parameters ───────────────── */}
                <Section icon={Sun} title="Solar Resource & System" description="Physical parameters used in generation estimates.">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Field label="Peak sun hours/day" hint="Karachi average ≈ 5.5">
                            <Input type="number" step="0.1" value={settings.peak_sun_hours}
                                onChange={(e) => setNumField("peak_sun_hours", e.target.value)}
                                className="h-10 bg-background" />
                        </Field>
                        <Field label="System efficiency" hint="Losses from wiring, inverter, heat (0.75–0.85)">
                            <Input type="number" step="0.01" min="0.5" max="1" value={settings.system_efficiency}
                                onChange={(e) => setNumField("system_efficiency", e.target.value)}
                                className="h-10 bg-background" />
                        </Field>
                        <Field label="Days assumed per month">
                            <Input type="number" step="1" min="28" max="31" value={settings.days_per_month}
                                onChange={(e) => setNumField("days_per_month", e.target.value)}
                                className="h-10 bg-background" />
                        </Field>
                        <Field label="Roof sq ft per kW" hint="Typical monocrystalline ≈ 80 sq ft/kW">
                            <Input type="number" step="1" value={settings.sqft_per_kw}
                                onChange={(e) => setNumField("sqft_per_kw", e.target.value)}
                                className="h-10 bg-background" />
                        </Field>
                    </div>
                </Section>

                {/* ── 25-Year Projection Parameters ────────────────────── */}
                <Section icon={TrendingUp} title="25-Year Projection" description="Rates used for the cumulative savings chart and ROI calculation.">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Annual panel degradation" hint="Typical Tier-1 panels ≈ 0.005 (0.5% per year)">
                            <Input type="number" step="0.001" min="0" max="0.05" value={settings.panel_degradation}
                                onChange={(e) => setNumField("panel_degradation", e.target.value)}
                                className="h-10 bg-background" />
                        </Field>
                        <Field label="Annual tariff increase rate" hint="Historical NEPRA avg ≈ 0.08 (8% per year)">
                            <Input type="number" step="0.01" min="0" max="0.5" value={settings.tariff_increase_rate}
                                onChange={(e) => setNumField("tariff_increase_rate", e.target.value)}
                                className="h-10 bg-background" />
                        </Field>
                    </div>
                </Section>
            </div>
        </>
    );
}
