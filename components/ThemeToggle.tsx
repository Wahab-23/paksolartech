'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
                <div className="h-4 w-4" />
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-primary transition-colors"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? (
                <Sun className="h-4 w-4 transition-transform hover:rotate-45" />
            ) : (
                <Moon className="h-4 w-4 transition-transform hover:-rotate-12" />
            )}
        </Button>
    );
}
