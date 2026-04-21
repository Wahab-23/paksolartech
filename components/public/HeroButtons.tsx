"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroButtons() {
    return (
        <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: "400ms" }}>
            <Link href="/contact">
                <Button size="lg" className="gap-2 glow text-base">
                    Get A Quote
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </Link>
            <Link href="/services">
                <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 text-base border-primary/30 hover:bg-primary/10"
                >
                    Our Services
                </Button>
            </Link>
        </div>
    );
}
