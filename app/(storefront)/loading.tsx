import { Sun } from 'lucide-react';

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
            <div className="relative flex flex-col items-center">
                {/* Glowing Background */}
                <div className="absolute h-16 w-16 rounded-full bg-primary/20 blur-xl animate-pulse" />
                
                {/* Pulsing Icon */}
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-card border border-border/50 shadow-2xl">
                    <Sun className="h-8 w-8 text-primary animate-pulse" />
                </div>
                
                {/* Subtle Text */}
                <p className="mt-4 text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase">
                    PakSolar<span className="text-primary font-black">Tech</span>
                </p>
            </div>
        </div>
    );
}
