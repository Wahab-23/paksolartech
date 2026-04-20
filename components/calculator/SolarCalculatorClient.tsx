"use client";

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
    Sun, Zap, TrendingUp, Calculator, ArrowRight, 
    ArrowLeft, ShieldCheck, Info, Lightbulb, 
    Wind, Refrigerator, Tv, CheckCircle2 
} from 'lucide-react';

// --- Types & Constants ---

interface Appliance {
    name: string;
    icon: React.ReactNode;
    watts: number;
    count: number;
}

interface CalculatorState {
    bill: number;
    appliances: Appliance[];
}

const APPLIANCE_DEFAULTS = [
    { name: 'Fans', icon: <Wind className="h-4 w-4" />, watts: 80, count: 0 },
    { name: 'Lights', icon: <Lightbulb className="h-4 w-4" />, watts: 20, count: 0 },
    { name: 'ACs (Inverter)', icon: <Zap className="h-4 w-4" />, watts: 1500, count: 0 },
    { name: 'Fridge', icon: <Refrigerator className="h-4 w-4" />, watts: 300, count: 0 },
    { name: 'LED TV', icon: <Tv className="h-4 w-4" />, watts: 100, count: 0 },
];

export default function SolarStepperCalculator() {
    const [step, setStep] = useState(1);
    const [bill, setBill] = useState<string>("");
    const [appliances, setAppliances] = useState(APPLIANCE_DEFAULTS);

    // --- Logic ---

    const updateApplianceCount = (index: number, delta: number) => {
        const newApps = [...appliances];
        newApps[index].count = Math.max(0, newApps[index].count + delta);
        setAppliances(newApps);
    };

    const calculations = useMemo(() => {
        const monthlyBill = Number(bill) || 0;
        const avgUnitCost = 55; // PKR
        const monthlyUnits = monthlyBill / avgUnitCost;
        
        // 1kW solar yields ~120 units/month in Pakistan
        const recommendedKw = Math.ceil((monthlyUnits / 120) * 10) / 10;
        const annualSavings = monthlyUnits * avgUnitCost * 12 * 0.9;
        
        // Calculate peak load from appliances
        const peakLoadWatts = appliances.reduce((sum, app) => sum + (app.watts * app.count), 0);
        const peakLoadKw = (peakLoadWatts / 1000).toFixed(1);

        return {
            kw: recommendedKw || 0,
            units: Math.round(monthlyUnits) || 0,
            annualSavings: Math.round(annualSavings) || 0,
            peakLoadKw
        };
    }, [bill, appliances]);

    // --- UI Sub-components ---

    const StepIndicator = () => (
        <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((i) => (
                <div 
                    key={i}
                    className={`h-2 rounded-full transition-all duration-300 ${
                        step >= i ? "w-8 bg-primary" : "w-2 bg-muted"
                    }`}
                />
            ))}
        </div>
    );

    return (
        <div className="w-full max-w-7xl mx-auto pt-4">
            <div className="relative overflow-hidden rounded-3xl border border-border shadow-lg bg-transparent">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-[60px]" />
                
                <div className="p-8">
                    <StepIndicator />

                    {/* STEP 1: BILLING */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="text-center">
                                <Badge variant="outline" className="mb-4 bg-primary/5 text-primary">Step 1: Usage</Badge>
                                <h2 className="text-3xl font-bold">What's your <span className="text-primary">Monthly Bill?</span></h2>
                                <p className="text-muted-foreground mt-2">This helps us understand your energy consumption scale.</p>
                            </div>
                            
                            <div className="relative group max-w-sm mx-auto">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-xl">Rs.</span>
                                <Input
                                    type="number"
                                    value={bill}
                                    onChange={(e) => setBill(e.target.value)}
                                    placeholder="e.g. 25000"
                                    className="h-16 pl-14 text-2xl bg-background/50 border-2 focus:ring-primary rounded-2xl"
                                />
                            </div>

                            <Button 
                                onClick={() => setStep(2)} 
                                disabled={!bill}
                                className="w-full h-14 text-lg font-bold rounded-2xl group max-w-sm mx-auto flex items-center justify-center"
                            >
                                Next Step
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    )}

                    {/* STEP 2: APPLIANCES */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="text-center">
                                <Badge variant="outline" className="mb-4 bg-primary/5 text-primary">Step 2: Load Profile</Badge>
                                <h2 className="text-3xl font-bold">Basic <span className="text-primary">Appliances</span></h2>
                                <p className="text-muted-foreground mt-2">What will you be running on solar?</p>
                            </div>

                            <div className="grid gap-3">
                                {appliances.map((app, idx) => (
                                    <div key={app.name} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-background rounded-lg text-primary">{app.icon}</div>
                                            <div>
                                                <p className="font-bold text-sm">{app.name}</p>
                                                <p className="text-[10px] text-muted-foreground uppercase">{app.watts}W each</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button 
                                                onClick={() => updateApplianceCount(idx, -1)}
                                                className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-background"
                                            >-</button>
                                            <span className="font-bold w-4 text-center">{app.count}</span>
                                            <button 
                                                onClick={() => updateApplianceCount(idx, 1)}
                                                className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                                            >+</button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setStep(1)} className="h-14 px-6 rounded-2xl">
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <Button onClick={() => setStep(3)} className="flex-1 h-14 text-lg font-bold rounded-2xl">
                                    Calculate Result
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: RESULTS */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in zoom-in-95">
                            <div className="text-center">
                                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 mb-4">
                                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                                </div>
                                <h2 className="text-3xl font-bold italic">Your Solar Strategy</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-6 rounded-3xl bg-primary text-primary-foreground">
                                    <Zap className="h-6 w-6 mb-2 opacity-80" />
                                    <p className="text-xs uppercase font-bold tracking-wider opacity-80">System Size</p>
                                    <div className="text-4xl font-black">{calculations.kw}<span className="text-lg ml-1">kW</span></div>
                                </div>
                                <div className="p-6 rounded-3xl bg-muted/50 border border-border">
                                    <Sun className="h-6 w-6 mb-2 text-yellow-500" />
                                    <p className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Monthly Units</p>
                                    <div className="text-4xl font-black">{calculations.units}<span className="text-lg ml-1">kWh</span></div>
                                </div>
                            </div>

                            <div className="p-6 rounded-3xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-sm font-bold text-green-700 uppercase tracking-widest">Est. Annual Savings</p>
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                </div>
                                <div className="text-4xl font-black text-green-600">Rs. {calculations.annualSavings.toLocaleString()}</div>
                                <p className="text-xs text-green-700/60 mt-2 font-medium">Based on current NEPRA tariffs</p>
                            </div>

                            <div className="bg-muted/30 rounded-2xl p-4 flex items-start gap-3">
                                <Info className="h-5 w-5 text-primary mt-0.5" />
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Based on your appliance list, your peak instantaneous load is approx <strong>{calculations.peakLoadKw}kW</strong>. 
                                    A {calculations.kw}kW system is ideal for your bill, but ensure your inverter supports your peak load.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-12 rounded-xl">
                                    Edit Details
                                </Button>
                                <Button className="flex-1 h-12 rounded-xl shadow-lg shadow-primary/20">
                                    Book Free Survey
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}   