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
        <div className="w-full space-y-6">
            {/* ── Input Card ─────────────────────────────────── */}
            <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-7 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <p className="mb-5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    🔢 Input Method
                </p>

                {/* Mode Toggle */}
                <div className="mb-6 flex gap-2.5">
                    {(
                        [
                            { id: "bill", label: "Monthly bill (PKR)" },
                            { id: "units", label: "Monthly units (kWh)" },
                        ] as { id: InputMode; label: string }[]
                    ).map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => { setMode(id); setError(null); }}
                            className={`flex-1 rounded-xl border-2 py-3 text-sm font-semibold transition-all duration-200 cursor-pointer ${mode === id
                                ? "border-primary bg-primary/10 text-primary shadow-md shadow-primary/20"
                                : "border-border/50 bg-background text-muted-foreground hover:border-primary/40 hover:bg-muted/50 hover:text-foreground"
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Bill / Units Input */}
                {mode === "bill" ? (
                    <div className="mb-5">
                        <label className="mb-2 block text-sm font-semibold text-foreground">
                            Average monthly electricity bill
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                                Rs.
                            </span>
                            <Input
                                id="calc-bill"
                                type="number"
                                value={billVal}
                                onChange={(e) => setBillVal(e.target.value)}
                                placeholder="e.g. 25000"
                                className="pl-11 h-12 bg-background text-base font-semibold border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="mb-5">
                        <label className="mb-2 block text-sm font-semibold text-foreground">
                            Average monthly units consumed (kWh)
                        </label>
                        <Input
                            id="calc-units"
                            type="number"
                            value={unitsVal}
                            onChange={(e) => setUnitsVal(e.target.value)}
                            placeholder="e.g. 400"
                            className="h-12 bg-background text-base font-semibold border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                )}

                {/* System Type + Roof Area */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-foreground">
                            System type
                        </label>
                        <select
                            id="calc-systype"
                            value={sysType}
                            onChange={(e) => setSysType(e.target.value as SystemType)}
                            className="w-full h-12 rounded-xl border border-border/50 bg-background px-4 text-base font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
                        >
                            <option value="ongrid">On-grid (net metering)</option>
                            <option value="hybrid">Hybrid (battery backup)</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-foreground">
                            Roof area available (sq ft)
                        </label>
                        <Input
                            id="calc-roof"
                            type="number"
                            value={roofVal}
                            onChange={(e) => setRoofVal(e.target.value)}
                            placeholder="e.g. 800"
                            className="h-12 bg-background text-base font-semibold border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-5 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3.5">
                        <AlertCircle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
                        <p className="text-sm text-destructive font-medium">{error}</p>
                    </div>
                )}

                <Button
                    id="calc-submit"
                    onClick={handleSubmit}
                    className="w-full h-12 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    Calculate my solar estimate
                    <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
            </div>

            {/* ── Results (only rendered when not in redirect mode) ──────────── */}
            {!redirectMode && result && (
                <div ref={resultsRef} className="space-y-6 animate-slide-up">

                    {/* Roof constraint warning */}
                    {result.roofConstrained && (
                        <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-4">
                            <Info className="h-5 w-5 mt-0.5 shrink-0 text-amber-600 dark:text-amber-500" />
                            <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
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
                    <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-7 text-center animate-slide-up shadow-lg" style={{ animationDelay: '200ms' }}>
                        <h3 className="text-xl font-bold text-foreground">Your estimate is ready.</h3>
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                            Want an exact quote for your home or business? Chat with our Karachi solar specialist on WhatsApp — free, no obligation, straight answers.
                        </p>
                        <Link
                            href={`https://wa.me/923001234567?text=${encodeURIComponent(
                                `Hi, I used the calculator on your site. My monthly bill is Rs. ${mode === 'bill' ? billVal : fmt(result.kwh * 50)} and I'm interested in a ${sysType === 'ongrid' ? 'On-grid' : 'Hybrid'} system.`
                            )}`}
                            target="_blank"
                            className="mt-6 block"
                        >
                            <Button className="w-full h-12 gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white border-none shadow-lg shadow-[#25D366]/30 font-semibold text-base">
                                <span>Chat on WhatsApp</span>
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>

                    <Button variant="outline" onClick={reset} className="w-full rounded-xl h-11 font-semibold">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Start over
                    </Button>
                </div>
            )}

        </div>
    )
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
                <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-4">
                    <Info className="h-5 w-5 mt-0.5 shrink-0 text-amber-600 dark:text-amber-500" />
                    <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
                        System size was limited to{" "}
                        <strong>{result.sizeKw.toFixed(1)} kW</strong> due to your
                        available roof space. Consider a smaller, more efficient panel layout.
                    </p>
                </div>
            )}

            {/* System Summary */}
            <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-7 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <p className="mb-5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    📊 System Summary
                </p>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <MetricCard label="Recommended size" value={result.sizeKw.toFixed(1)} unit="kW" icon={<Sun className="h-4 w-4" />} />
                    <MetricCard label="Total cost" value={`Rs. ${fmt(result.totalCost)}`} unit="installed" icon={<Zap className="h-4 w-4" />} />
                    <MetricCard label="Monthly savings" value={`Rs. ${fmt(result.monthlySavings)}`} unit="per month" icon={<TrendingUp className="h-4 w-4" />} highlight />
                    <MetricCard label="Payback period" value={result.payback.toFixed(1)} unit="years" icon={<CheckCircle2 className="h-4 w-4" />} highlight />
                </div>
                <div className="mt-5 flex items-center gap-3 rounded-xl bg-muted/50 border border-border/50 px-4 py-3">
                    <Info className="h-4 w-4 shrink-0 text-primary" />
                    <p className="text-sm text-muted-foreground">
                        Estimated consumption:{" "}
                        <strong className="text-foreground">{fmt(result.kwh)} kWh/month</strong>{" "}
                        — {result.slabLabel}
                    </p>
                </div>
            </div>

            {/* 25-Year Bar Chart */}
            <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-7 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    📈 25-Year Savings Projection
                </p>
                <p className="mb-6 text-xs text-muted-foreground">
                    Cumulative savings with annual tariff increase &amp; panel degradation
                </p>
                <div className="flex items-end gap-3 h-40 bg-muted/20 rounded-xl p-4">
                    {result.barData.map((d) => {
                        const pct = Math.round((d.cumulative / maxCum) * 100);
                        return (
                            <div key={d.year} className="flex flex-1 flex-col items-center gap-1.5 h-full justify-end">
                                <span className="text-xs font-semibold text-muted-foreground">
                                    {Math.round(d.cumulative / 100000)}L
                                </span>
                                <div className="w-full flex-1 flex items-end min-h-[4px]">
                                    <div
                                        className="w-full rounded-t-md bg-gradient-to-t from-primary to-primary/60 transition-all duration-500 hover:from-primary hover:to-primary/70 shadow-lg shadow-primary/20"
                                        style={{ height: `${pct}%`, minHeight: "8px" }}
                                    />
                                </div>
                                <span className="text-[10px] font-medium text-muted-foreground">Yr {d.year}</span>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 px-5 py-4 shadow-lg shadow-primary/10">
                        <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">Total 25-yr savings</p>
                        <p className="text-2xl font-bold text-primary">Rs. {fmt(result.totalLifeSavings)}</p>
                    </div>
                    <div className="rounded-xl bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 border border-emerald-500/20 px-5 py-4 shadow-lg shadow-emerald-500/10">
                        <p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">25-yr ROI</p>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{result.roi.toFixed(0)}%</p>
                    </div>
                </div>
            </div>

            {/* Full Breakdown */}
            <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-7 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="mb-6 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <BarChart3 className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Complete Details
                    </p>
                </div>
                <div className="space-y-3">
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
                        <div key={key} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-muted/30 transition-colors">
                            <span className="text-sm text-muted-foreground font-medium">{key}</span>
                            <span className="text-sm font-bold text-foreground">{val}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Disclaimer */}
            <div className="rounded-xl bg-muted/30 border border-border/50 px-4 py-3 backdrop-blur-sm">
                <p className="text-xs leading-relaxed text-muted-foreground">
                    <strong className="text-foreground">Disclaimer:</strong> Estimates are based on NEPRA tariff slabs, net metering export rates, and local solar data.
                    Actual costs vary by installer, brand, and site conditions. This is a planning tool — get 3
                    quotes before committing.
                </p>
            </div>
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
        <div className={`rounded-xl p-5 border transition-all duration-200 ${highlight ? "bg-gradient-to-br from-primary/20 to-primary/10 border-primary/30 shadow-lg shadow-primary/10" : "bg-muted/40 border-border/50 hover:bg-muted/60"}`}>
            <div className={`mb-3 p-2 rounded-lg w-fit ${highlight ? "bg-primary/30 text-primary" : "bg-muted text-muted-foreground"}`}>{icon}</div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">{label}</p>
            <p className={`text-lg font-bold leading-tight mb-1 ${highlight ? "text-primary" : "text-foreground"}`}>{value}</p>
            <p className="text-xs text-muted-foreground font-medium">{unit}</p>
        </div>
    );
}