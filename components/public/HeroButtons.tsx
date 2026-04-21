"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroButtons() {
    return (
        <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: "400ms" }}>
            <Link href="/calculator">
                <Button size="lg" className="gap-2 glow text-base">
                    Calculate My Savings
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </Link>
            <Link href="https://wa.me/923001234567" target="_blank">
                <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 text-base border-primary/30 hover:bg-primary/10"
                >
                    Chat With Us on WhatsApp
                </Button>
            </Link>
        </div>
    );
}
