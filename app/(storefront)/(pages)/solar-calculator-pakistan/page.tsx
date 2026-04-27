import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sun, Zap, TrendingUp } from "lucide-react";
import { getCalculatorSettings } from "@/app/models/calculator-settings.model";
import SolarCalculatorClient from "@/components/calculator/SolarCalculatorClient";
import type { InputMode, SystemType } from "@/lib/calculatorEngine";

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Solar Savings Calculator Pakistan",
    "operatingSystem": "Web",
    "applicationCategory": "BusinessApplication",
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "PKR"
    },
    "description": "Calculate your solar system size and monthly savings based on NEPRA tariffs."
};


export const metadata: Metadata = {
    title: "Solar Savings Calculator Pakistan — Estimates Costs & ROI",
    description:
        "Calculate your ideal solar system size, installation cost, monthly savings, and payback period based on NEPRA tariff slabs and Karachi peak sun data. Get an accurate ROI estimate for Longi and JA Solar panels.",
    keywords:
        "solar calculator Pakistan, solar savings estimate, NEPRA tariff calculator, net metering savings, solar installation cost Karachi, solar ROI calculator Pakistan, solar panel system size calculator",
    alternates: {
        canonical: '/calculator',
    },
    openGraph: {
        title: "Solar Savings Calculator — PakSolarTech",
        description: "Accurately estimate your solar savings and ROI based on NEPRA rates.",
        type: "website",
        url: "https://paksolartech.com/calculator",
    },
};


// Re-validate settings every 60 seconds so changes from the admin panel
// are reflected without a full deployment.
export const revalidate = 60;

const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://paksolartech.com" },
        { "@type": "ListItem", "position": 2, "name": "Solar Calculator", "item": "https://paksolartech.com/calculator" }
    ]
};

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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script

                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
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

            {/* ── How It Works ──────────────────────────────── */}
            <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How This <span className="text-gradient">Calculator</span> Works</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                        Our calculator uses real-world data to give you the most accurate solar estimate possible.
                    </p>
                </div>
                <div className="grid gap-6 sm:grid-cols-3">
                    {[
                        {
                            step: '1',
                            title: 'Enter Your Bill',
                            desc: 'Input your current monthly electricity bill or unit consumption. We use the latest NEPRA tariff slabs to calculate your actual per-unit cost.'
                        },
                        {
                            step: '2',
                            title: 'System Sizing',
                            desc: 'Based on Karachi\'s 5.5 peak sun hours and your consumption, we calculate the optimal solar panel system size in kilowatts (kW).'
                        },
                        {
                            step: '3',
                            title: 'ROI & Payback',
                            desc: 'We estimate your installation cost, monthly savings, and payback period — factoring in net metering credits and system degradation over 25 years.'
                        }
                    ].map((item) => (
                        <div key={item.step} className="rounded-2xl border border-border/50 bg-card/50 p-6 text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                                {item.step}
                            </div>
                            <h3 className="mb-2 text-lg font-bold">{item.title}</h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Calculator FAQ ──────────────────────────────── */}
            <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Common <span className="text-gradient">Questions</span></h2>
                </div>
                <div className="space-y-4">
                    {[
                        {
                            q: 'How accurate is this solar calculator?',
                            a: 'Our calculator uses live NEPRA tariff slabs, Karachi-specific peak sun hour data (5.5 hours), and current Tier-1 panel pricing from manufacturers like Longi and JA Solar. Results are within 5-10% of a professional site survey estimate.'
                        },
                        {
                            q: 'What is net metering and how does it affect my savings?',
                            a: 'Net metering allows you to sell excess solar electricity back to the grid. Your bi-directional meter tracks what you consume and what you export. NEPRA credits the exported units against your future bills, maximizing your savings.'
                        },
                        {
                            q: 'How much does a solar system cost in Pakistan in 2026?',
                            a: 'A typical residential system ranges from PKR 350,000 to PKR 1,500,000 depending on size (3kW to 15kW). Commercial systems for businesses start from PKR 2,000,000. Prices include Tier-1 panels, inverter, mounting, wiring, and net metering documentation.'
                        },
                        {
                            q: 'How long does it take for solar panels to pay for themselves?',
                            a: 'Most residential systems in Karachi achieve payback within 3-5 years, depending on your current electricity bill and the system size. After payback, you enjoy 20+ years of essentially free electricity.'
                        }
                    ].map((faq, i) => (
                        <details key={i} className="group rounded-2xl border border-border/50 bg-card/30 px-6 py-4">
                            <summary className="flex cursor-pointer items-center justify-between text-base font-bold transition-colors group-open:text-primary">
                                {faq.q}
                                <span className="ml-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-45">+</span>
                            </summary>
                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                        </details>
                    ))}
                </div>
            </section>
        </main>

    );
}
