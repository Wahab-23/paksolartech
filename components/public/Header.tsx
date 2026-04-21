'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Sun, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import ThemeToggle from '@/components/ThemeToggle';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
];

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled
                ? 'glass shadow-lg shadow-black/20'
                : 'bg-transparent'
                }`}
        >
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="group flex items-center gap-2.5">
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:bg-primary/20 group-hover:glow">
                        <Sun className="h-5 w-5 text-primary transition-transform duration-500 group-hover:rotate-180" />
                        <Zap className="absolute -right-1 -top-1 h-3.5 w-3.5 text-yellow-400 animate-pulse-glow" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">
                        <span className="text-gradient">Pak</span>
                        <span className="text-foreground">SolarTech</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden items-center gap-1 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <ThemeToggle />
                    <Link href="/contact">
                        <Button
                            size="sm"
                            className="ml-2 gap-2 glow"
                        >
                            <Zap className="h-3.5 w-3.5" />
                            Get A Quote
                        </Button>
                    </Link>
                </nav>

                {/* Mobile Hamburger */}
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-72 border-border bg-card">
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                        <div className="flex items-center gap-2.5 mb-8 mt-3 px-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                                <Sun className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-lg font-bold">
                                <span className="text-gradient">Pak</span>SolarTech
                            </span>
                        </div>
                        <nav className="flex flex-col gap-1 px-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/50 px-4 py-2">
                                <span className="text-sm text-muted-foreground">Theme</span>
                                <ThemeToggle />
                            </div>
                            <Link href="/contact" onClick={() => setMobileOpen(false)}>
                                <Button
                                    className="mt-4 w-full gap-2 glow"
                                >
                                    <Zap className="h-3.5 w-3.5" />
                                    Get A Quote
                                </Button>
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
