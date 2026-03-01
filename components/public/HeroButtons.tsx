"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HeroButtons() {
    const scrollToContact = () => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    };

    const scrollToServices = () => {
        document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: "400ms" }}>
            <Button size="lg" className="gap-2 glow text-base" onClick={scrollToContact}>
                Get Free Quote
                <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
                size="lg"
                variant="outline"
                className="gap-2 text-base border-primary/30 hover:bg-primary/10"
                onClick={scrollToServices}
            >
                Our Services
            </Button>
        </div>
    );
}
