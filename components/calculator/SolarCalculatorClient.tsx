"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Sun, Zap, TrendingUp, BarChart3, ChevronRight,
    Info, AlertCircle, CheckCircle2, RotateCcw,
} from "lucide-react";
import {
    runCalculation, getKwhFromBill, fmt,
    type CalcResult, type SystemType, type InputMode, type CalculatorSettings,
} from "@/lib/calculatorEngine";
import { DEFAULT_SETTINGS } from "@/lib/calculatorDefaults";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ─── Props ─────────────────────────────────────────────────────────────────────

interface Props {
    /** When true, clicking Calculate redirects to /calculator with params instead of showing inline results */
    redirectMode?: boolean;
    /** Pre-populated settings from DB (passed from server component). Falls back to defaults. */
    settings?: CalculatorSettings;
    /** Pre-filled values (from URL query params on the /calculator page) */
    initialMode?: InputMode;
    initialBill?: string;
    initialUnits?: string;
    initialSysType?: SystemType;
    initialRoof?: string;
    /** Auto-run calculation on mount (when redirected with params) */
    autoCalculate?: boolean;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function SolarCalculatorClient({
    redirectMode = false,
    settings,
    initialMode = "bill",
    initialBill = "",
    initialUnits = "",
    initialSysType = "ongrid",
    initialRoof = "",
    autoCalculate = false,
}: Props) {
    const router = useRouter();
    const resolvedSettings = settings ?? DEFAULT_SETTINGS;

    const [mode, setMode] = useState<InputMode>(initialMode);
    const [sysType, setSysType] = useState<SystemType>(initialSysType);
    const [billVal, setBillVal] = useState(initialBill);
    const [unitsVal, setUnitsVal] = useState(initialUnits);
    const [roofVal, setRoofVal] = useState(initialRoof);
    const [result, setResult] = useState<CalcResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    // ── Auto-calculate on mount when navigated from homepage ──────────────────
    useEffect(() => {
        if (autoCalculate) doCalculate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function doCalculate(): CalcResult | null {
        setError(null);
        let kwh = 0;

        if (mode === "bill") {
            const bill = parseFloat(billVal);
            if (!bill || bill < 500) {
                setError("Please enter a valid bill amount (minimum Rs. 500).");
                return null;
            }
            kwh = getKwhFromBill(bill, resolvedSettings.tariff_slabs);
        } else {
            kwh = parseFloat(unitsVal);
            if (!kwh || kwh < 10) {
                setError("Please enter a valid consumption value (minimum 10 kWh).");
                return null;
            }
        }

        const roof = parseFloat(roofVal) || 0;
        const calc = runCalculation(kwh, sysType, roof, resolvedSettings);

        // Sync URL parameters for shareability and "record" persistence
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            params.set("mode", mode);
            params.set("sysType", sysType);
            if (mode === "bill") {
                params.set("bill", billVal);
                params.delete("units");
            } else {
                params.set("units", unitsVal);
                params.delete("bill");
            }
            if (roofVal) params.set("roof", roofVal);
            params.set("autoCalc", "1");
            window.history.replaceState(null, "", `?${params.toString()}`);
        }

        setResult(calc);
        setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
        return calc;
    }

    function handleSubmit() {
        if (redirectMode) {
            // Build query params and navigate to /calculator
            const params = new URLSearchParams({
                mode,
                sysType,
                ...(mode === "bill" && billVal ? { bill: billVal } : {}),
                ...(mode === "units" && unitsVal ? { units: unitsVal } : {}),
                ...(roofVal ? { roof: roofVal } : {}),
                autoCalc: "1",
            });
            router.push(`/calculator?${params.toString()}`);
        } else {
            // If already on the calculator page, just run and update the URL
            doCalculate();
        }
    }

    function reset() {
        setResult(null);
        setError(null);
        setBillVal("");
        setUnitsVal("");
        setRoofVal("");
    }

    const maxCum = result?.barData.at(-1)?.cumulative ?? 1;

    return (
        <div className="w-full space-y-5">
            {/* ── Input Card ─────────────────────────────────── */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Input Method
                </p>

                {/* Mode Toggle */}
                <div className="mb-5 flex gap-2">
                    {(
                        [
                            { id: "bill", label: "Monthly bill (PKR)" },
                            { id: "units", label: "Monthly units (kWh)" },
                        ] as { id: InputMode; label: string }[]
                    ).map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => { setMode(id); setError(null); }}
                            className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition-all duration-150 cursor-pointer ${mode === id
                                ? "border-primary/40 bg-primary/10 text-primary"
                                : "border-border bg-transparent text-muted-foreground hover:border-primary/20 hover:text-foreground"
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Bill / Units Input */}
                {mode === "bill" ? (
                    <div className="mb-4">
                        <label className="mb-1.5 block text-sm text-muted-foreground">
                            Average monthly electricity bill
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                                Rs.
                            </span>
                            <Input
                                id="calc-bill"
                                type="number"
                                value={billVal}
                                onChange={(e) => setBillVal(e.target.value)}
                                placeholder="e.g. 25000"
                                className="pl-10 h-11 bg-background text-base"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="mb-4">
                        <label className="mb-1.5 block text-sm text-muted-foreground">
                            Average monthly units consumed (kWh)
                        </label>
                        <Input
                            id="calc-units"
                            type="number"
                            value={unitsVal}
                            onChange={(e) => setUnitsVal(e.target.value)}
                            placeholder="e.g. 400"
                            className="h-11 bg-background text-base"
                        />
                    </div>
                )}

                {/* System Type + Roof Area */}
                <div className="mb-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label className="mb-1.5 block text-sm text-muted-foreground">
                            System type
                        </label>
                        <select
                            id="calc-systype"
                            value={sysType}
                            onChange={(e) => setSysType(e.target.value as SystemType)}
                            className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            <option value="ongrid">On-grid (net metering)</option>
                            <option value="hybrid">Hybrid (battery backup)</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm text-muted-foreground">
                            Roof area available (sq ft)
                        </label>
                        <Input
                            id="calc-roof"
                            type="number"
                            value={roofVal}
                            onChange={(e) => setRoofVal(e.target.value)}
                            placeholder="e.g. 800"
                            className="h-11 bg-background text-base"
                        />
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5">
                        <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
                        <p className="text-sm text-destructive">{error}</p>
                    </div>
                )}

                <Button
                    id="calc-submit"
                    onClick={handleSubmit}
                    className="w-full h-11 text-base font-semibold rounded-xl"
                >
                    Calculate my solar estimate
                    <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
            </div>

            {/* ── Results (only rendered when not in redirect mode) ──────────── */}
            {!redirectMode && result && (
                <div ref={resultsRef} className="space-y-5 animate-slide-up">

                    {/* Roof constraint warning */}
                    {result.roofConstrained && (
                        <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
                            <Info className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
                            <p className="text-sm text-amber-700 dark:text-amber-400">
                                System size was limited to{" "}
                                <strong>{result.sizeKw.toFixed(1)} kW</strong> due to your
                                available roof space. Consider a smaller, more efficient panel
                                layout.
                            </p>
                        </div>
                    )}

                    <ResultsDisplay
                        key={JSON.stringify({ ...result, barData: [] })}
                        result={result}
                        sysType={sysType}
                        maxCum={maxCum}
                    />

                    {/* WhatsApp CTA */}
                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center animate-slide-up" style={{ animationDelay: '200ms' }}>
                        <h3 className="text-lg font-bold text-foreground">Your estimate is ready.</h3>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                            Want an exact quote for your home or business? Chat with our Karachi solar specialist on WhatsApp — free, no obligation, straight answers.
                        </p>
                        <Link
                            href={`https://wa.me/923001234567?text=${encodeURIComponent(
                                `Hi, I used the calculator on your site. My monthly bill is Rs. ${mode === 'bill' ? billVal : fmt(result.kwh * 50)} and I'm interested in a ${sysType === 'ongrid' ? 'On-grid' : 'Hybrid'} system.`
                            )}`}
                            target="_blank"
                            className="mt-5 block"
                        >
                            <Button className="w-full h-11 gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white border-none shadow-lg shadow-[#25D366]/20">
                                <span className="text-base font-semibold">Chat on WhatsApp</span>
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    <Button variant="outline" onClick={reset} className="w-full rounded-xl">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Start over
                    </Button>
                </div>
            )}
        </div>
    );
}

// ─── Results Display (shared between inline and /calculator page) ──────────────

export function ResultsDisplay({
    result,
    sysType,
    maxCum,
}: {
    result: CalcResult;
    sysType: SystemType;
    maxCum: number;
}) {
    return (
        <>
            {/* Roof constraint warning */}
            {result.roofConstrained && (
                <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
                    <Info className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                        System size was limited to{" "}
                        <strong>{result.sizeKw.toFixed(1)} kW</strong> due to your
                        available roof space. Consider a smaller, more efficient panel layout.
                    </p>
                </div>
            )}

            {/* System Summary */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    System Summary
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <MetricCard label="Recommended size" value={result.sizeKw.toFixed(1)} unit="kW" icon={<Sun className="h-4 w-4" />} />
                    <MetricCard label="Total cost" value={`Rs. ${fmt(result.totalCost)}`} unit="installed" icon={<Zap className="h-4 w-4" />} />
                    <MetricCard label="Monthly savings" value={`Rs. ${fmt(result.monthlySavings)}`} unit="per month" icon={<TrendingUp className="h-4 w-4" />} highlight />
                    <MetricCard label="Payback period" value={result.payback.toFixed(1)} unit="years" icon={<CheckCircle2 className="h-4 w-4" />} highlight />
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2.5">
                    <Info className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                        Estimated consumption:{" "}
                        <strong className="text-foreground">{fmt(result.kwh)} kWh/month</strong>{" "}
                        — {result.slabLabel}
                    </p>
                </div>
            </div>

            {/* 25-Year Bar Chart */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    25-Year Savings Projection
                </p>
                <p className="mb-5 text-xs text-muted-foreground">
                    Cumulative savings with annual tariff increase &amp; panel degradation
                </p>
                <div className="flex items-end gap-3 h-36">
                    {result.barData.map((d) => {
                        const pct = Math.round((d.cumulative / maxCum) * 100);
                        return (
                            <div key={d.year} className="flex flex-1 flex-col items-center gap-1 h-full">
                                <span className="text-[10px] font-medium text-muted-foreground">
                                    {Math.round(d.cumulative / 100000)}L
                                </span>
                                <div className="w-full flex-1 flex items-end">
                                    <div
                                        className="w-full rounded-t-md bg-primary/80 transition-all duration-500"
                                        style={{ height: `${pct}%`, minHeight: "4px" }}
                                    />
                                </div>
                                <span className="text-[10px] text-muted-foreground">Yr {d.year}</span>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-primary/10 border border-primary/20 px-4 py-3">
                        <p className="text-xs text-muted-foreground mb-1">Total 25-yr savings</p>
                        <p className="text-lg font-bold text-primary">Rs. {fmt(result.totalLifeSavings)}</p>
                    </div>
                    <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3">
                        <p className="text-xs text-muted-foreground mb-1">25-yr ROI</p>
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{result.roi.toFixed(0)}%</p>
                    </div>
                </div>
            </div>

            {/* Full Breakdown */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Full Breakdown
                    </p>
                </div>
                <div className="divide-y divide-border">
                    {(
                        [
                            ["System size", `${result.sizeKw.toFixed(1)} kW`],
                            ["System type", sysType === "hybrid" ? "Hybrid (battery backup)" : "On-grid (net metering)"],
                            ["Monthly generation", `${fmt(result.monthlyGen)} kWh`],
                            ["Self-consumed", `${fmt(result.selfConsume)} kWh/month`],
                            ["Exported to grid", sysType === "hybrid" ? "Minimal (battery stores excess)" : `${fmt(result.exported)} kWh/month`],
                            ["Installation cost", `Rs. ${fmt(result.totalCost)}`],
                            ["Bill reduction", `Rs. ${fmt(result.billReduction)}/mo`],
                            ["Export revenue", `Rs. ${fmt(result.exportRevenue)}/mo`],
                            ["Annual benefit", `Rs. ${fmt(result.annualSavings)}`],
                            ["Payback period", `${result.payback.toFixed(1)} years`],
                            ["25-year ROI", `${result.roi.toFixed(0)}%`],
                            ["Roof space needed", `${result.roofNeeded} sq ft`],
                        ] as [string, string][]
                    ).map(([key, val]) => (
                        <div key={key} className="flex items-center justify-between py-2.5">
                            <span className="text-sm text-muted-foreground">{key}</span>
                            <span className="text-sm font-semibold text-foreground">{val}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Disclaimer */}
            <p className="text-xs leading-relaxed text-muted-foreground px-1">
                Estimates are based on NEPRA tariff slabs, net metering export rates, and local solar data.
                Actual costs vary by installer, brand, and site conditions. This is a planning tool — get 3
                quotes before committing.
            </p>
        </>
    );
}

// ─── Metric Card ──────────────────────────────────────────────────────────────

function MetricCard({
    label, value, unit, icon, highlight = false,
}: {
    label: string; value: string; unit: string; icon: React.ReactNode; highlight?: boolean;
}) {
    return (
        <div className={`rounded-xl p-4 ${highlight ? "bg-primary/10 border border-primary/20" : "bg-muted/50 border border-border"}`}>
            <div className={`mb-2 ${highlight ? "text-primary" : "text-muted-foreground"}`}>{icon}</div>
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className={`text-base font-bold leading-tight ${highlight ? "text-primary" : "text-foreground"}`}>{value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{unit}</p>
        </div>
    );
}