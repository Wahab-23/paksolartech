import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sun, Zap } from "lucide-react";
import { getCalculatorSettings } from "@/app/models/calculator-settings.model";
import SolarCalculatorClient from "@/components/calculator/SolarCalculatorClient";
import type { InputMode, SystemType } from "@/lib/calculatorEngine";

export const metadata: Metadata = {
    title: "Solar Savings Calculator — PakSolarTech",
    description:
        "Calculate your ideal solar system size, installation cost, monthly savings, and payback period based on NEPRA tariff slabs and Karachi peak sun data.",
    keywords:
        "solar calculator Pakistan, solar savings estimate, NEPRA tariff calculator, net metering savings",
};

// Re-validate settings every 60 seconds so changes from the admin panel
// are reflected without a full deployment.
export const revalidate = 60;

interface PageProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CalculatorPage({ searchParams }: PageProps) {
    // Fetch admin-configured settings from DB (falls back to defaults)
    const settings = await getCalculatorSettings();

    // Resolve query params (passed from homepage redirect)
    const params = await searchParams;
    const sp = (key: string) =>
        Array.isArray(params[key]) ? params[key]![0] : (params[key] as string | undefined);

    const initialMode = (sp("mode") === "units" ? "units" : "bill") as InputMode;
    const initialSysType = (sp("sysType") === "hybrid" ? "hybrid" : "ongrid") as SystemType;
    const initialBill = sp("bill") ?? "";
    const initialUnits = sp("units") ?? "";
    const initialRoof = sp("roof") ?? "";
    const autoCalculate = sp("autoCalc") === "1";

    return (
        <main className="min-h-screen bg-background">
            {/* ── Page Header ──────────────────────────────────── */}
            <div className="relative mx-auto max-w-5xl px-4 pt-32">
                <div className="mx-auto max-w-5xl px-4 py-6 ">
                    <Link
                        href="/"
                        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to Home
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                            <Sun className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Solar Savings Calculator
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Estimate system size, cost &amp; payback — based on live NEPRA tariff data
                            </p>
                        </div>
                    </div>

                    {/* Quick stats row */}
                    <div className="mt-5 flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <Zap className="h-3.5 w-3.5 text-primary" />
                            {settings.peak_sun_hours} peak sun hrs/day (Karachi avg)
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Zap className="h-3.5 w-3.5 text-primary" />
                            Net metering export @ Rs. {settings.export_rate}/kWh
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Zap className="h-3.5 w-3.5 text-primary" />
                            On-grid @ Rs. {(settings.ongrid_cost_per_kw / 1000).toFixed(0)}k/kW &bull; Hybrid @ Rs. {(settings.hybrid_cost_per_kw / 1000).toFixed(0)}k/kW
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Calculator Body ──────────────────────────────── */}
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <SolarCalculatorClient
                    settings={settings}
                    initialMode={initialMode}
                    initialBill={initialBill}
                    initialUnits={initialUnits}
                    initialSysType={initialSysType}
                    initialRoof={initialRoof}
                    autoCalculate={autoCalculate}
                    redirectMode={false}
                />
            </div>
        </main>
    );
}
