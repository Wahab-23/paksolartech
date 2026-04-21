import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sun, Zap, TrendingUp } from "lucide-react";
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
        <main className="min-h-screen bg-background relative overflow-hidden">
            {/* Decorative background gradient */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-0 w-72 h-72 bg-primary/3 rounded-full blur-3xl" />
            </div>

            {/* ── Page Header ──────────────────────────────────── */}
            <div className="relative mx-auto max-w-5xl px-4 pt-22 md:pt-32 pb-8">
                <div className="px-2 md:px-8 mt-6">
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold tracking-tight mb-2">
                            Solar Savings Calculator
                        </h1>
                        <p className="text-base text-muted-foreground">
                            Estimate your ideal system size, installation cost, monthly savings, and payback period — based on live NEPRA tariff slabs and Karachi solar data.
                        </p>
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
