"use client";

import React, { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sun, Zap, TrendingUp, Calculator, ArrowRight, ShieldCheck, Info } from 'lucide-react';

interface CalculatorState {
    kw: number;
    units: number;
    annualSavings: number;
    monthlyBill: number;
}

/**
 * calculationAction handles the solar estimation logic.
 * By defining the state type explicitly, we fix the "known properties" TS error.
 */
async function calculateSolarAction(prevState: CalculatorState | null, formData: FormData): Promise<CalculatorState | null> {
    const bill = Number(formData.get('bill'));
    if (!bill || isNaN(bill)) return null;

    // Average cost per unit in Pakistan (including taxes/delivery chars) is approx ~55 PKR
    const avgUnitCost = 55;
    const monthlyUnits = bill / avgUnitCost;

    // Average generation: 1kW solar yields ~120 units/month in Pakistan
    const recommendedKw = Math.ceil((monthlyUnits / 120) * 10) / 10;

    // Annual savings estimation (assuming 90% offset)
    const annualSavings = monthlyUnits * avgUnitCost * 12 * 0.9;

    return {
        kw: recommendedKw,
        units: Math.round(monthlyUnits),
        annualSavings: Math.round(annualSavings),
        monthlyBill: bill,
    };
}

export default function SolarCalculatorClient() {
    // Fixes: Object literal may only specify known properties, and 'kw' does not exist in type '(prevState: null) => null'
    // By providing the generic type <CalculatorState | null>
    const [state, action, isPending] = useActionState<CalculatorState | null, FormData>(calculateSolarAction, null);

    return (
        <div className="w-full max-w-7xl mx-auto p-1 py-12">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card/80">
                {/* Decorative Background Blob - Reduced blur for performance */}
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-[60px]" />
                <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-primary/5 blur-[40px]" />

                <div className="relative grid gap-0 md:grid-cols-5">
                    {/* Left Side: Input Form */}
                    <div className="p-8 md:col-span-2 border-b md:border-b-0 md:border-r border-border/50">
                        <div className="mb-8">
                            <Badge variant="outline" className="mb-4 gap-1.5 border-primary/20 bg-primary/5 px-3 py-1 text-primary">
                                <Calculator className="h-3.5 w-3.5" />
                                Solar ROI Estimator
                            </Badge>
                            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                                Calculate <span className="text-primary">Your Savings</span>
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Enter your average monthly electricity bill to estimate the ideal solar system size for your home.
                            </p>
                        </div>

                        <form action={action} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="bill" className="text-sm font-medium text-foreground flex items-center gap-2">
                                    Monthly Bill (Avg. PKR)
                                    <Info className="h-3.5 w-3.5 text-muted-foreground/60" />
                                </label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">Rs.</span>
                                    <Input
                                        id="bill"
                                        name="bill"
                                        type="number"
                                        placeholder="e.g. 25000"
                                        defaultValue={state?.monthlyBill}
                                        className="h-14 pl-12 bg-background/50 border-border text-foreground text-lg focus:ring-primary focus:border-primary transition-all group-hover:border-primary/50"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 gap-2"
                            >
                                {isPending ? (
                                    <>Calculating...</>
                                ) : (
                                    <>
                                        Calculate Now
                                        <ArrowRight className="h-5 w-5" />
                                    </>
                                )}
                            </Button>

                            <div className="pt-4 flex items-center justify-center gap-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                                <div className="flex items-center gap-1">
                                    <ShieldCheck className="h-3 w-3 text-primary" />
                                    Free Site Survey
                                </div>
                                <div className="h-1 w-1 rounded-full bg-border" />
                                <div className="flex items-center gap-1">
                                    <Sun className="h-3 w-3 text-primary" />
                                    Net Metering Ready
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Right Side: Results Visualization */}
                    <div className="p-8 md:col-span-3 bg-muted/20">
                        {!state ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                <div className="mb-6 rounded-full bg-primary/5 p-6 transform hover:scale-110 transition-transform">
                                    <Sun className="h-16 w-16 text-primary/40" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground/80 mb-2">Ready to see results?</h3>
                                <p className="text-sm text-muted-foreground max-w-xs">
                                    Fill in your monthly consumption to see how much you can save with PakSolarTech.
                                </p>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col justify-between">
                                <div className="grid gap-4 grid-cols-2 mb-8">
                                    {/* System Size Card */}
                                    <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/15 to-transparent border border-primary/20 group hover:border-primary/40 transition-all">
                                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                                            <Zap className="h-5 w-5 text-primary" />
                                        </div>
                                        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Recommended Size</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-black text-foreground">{state.kw}</span>
                                            <span className="text-sm text-muted-foreground font-bold uppercase">kW</span>
                                        </div>
                                    </div>

                                    {/* Monthly Units Card */}
                                    <div className="p-6 rounded-2xl bg-background/50 border border-border/50 hover:border-border transition-all">
                                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50">
                                            <Sun className="h-5 w-5 text-yellow-500" />
                                        </div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Estimated Units</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-black text-foreground">{state.units}</span>
                                            <span className="text-sm text-muted-foreground font-bold uppercase">kWh</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Annual Savings Mega Card - Simplified transitions */}
                                <div className="relative p-8 rounded-3xl bg-primary overflow-hidden">
                                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                        <div>
                                            <div className="flex items-center gap-2 text-white/90 font-bold text-sm uppercase tracking-widest mb-2">
                                                <TrendingUp className="h-4 w-4" />
                                                Annual Savings
                                            </div>
                                            <div className="text-4xl md:text-5xl font-black text-white">
                                                Rs. {state.annualSavings.toLocaleString()}
                                            </div>
                                            <p className="mt-2 text-white/70 text-sm font-medium">
                                                Based on current electricity tariffs in Pakistan
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-border pt-6">
                                    <div className="text-xs text-muted-foreground italic max-w-[200px]">
                                        * These are estimates. A site survey is required for accurate sizing.
                                    </div>
                                    <Button variant="link" className="text-primary hover:text-primary/80 font-bold uppercase tracking-widest text-[10px] h-auto p-0">
                                        View Detailed Specs
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}