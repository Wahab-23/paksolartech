import Link from 'next/link';
import { Sun, Zap, MapPin, Phone, Mail } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const solarSolutions = [
    { href: '/services/residential-solar', label: 'Residential Solar' },
    { href: '/services/commercial-solar', label: 'Commercial Solar' },
    { href: '/services/battery-storage', label: 'Battery Storage' },
    { href: '/services/maintenance-repair', label: 'Solar Maintenance' },
    { href: '/services/energy-consulting', label: 'Energy Consulting' },
];

const quickLinks = [
    { href: '/', label: 'Home' },
    { href: '/solar-calculator-pakistan', label: 'Solar Calculator' },
    { href: '/blog', label: 'Blog' },
    { href: '/services', label: 'All Services' },
];

const companyLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/careers', label: 'Careers' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms & Conditions' },
];


export default function Footer() {
    return (
        <footer className="border-t border-border bg-card/50">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
                    {/* Brand */}
                    <div className="space-y-4 lg:col-span-1 sm:col-span-2 lg:sm:col-span-1">
                        <Link href="/" className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                                <Sun className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-lg font-bold">
                                <span className="text-gradient">Pak</span>SolarTech
                            </span>
                        </Link>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            Pakistan&apos;s leading solar energy company powering a sustainable
                            future with cutting-edge solar technology.
                        </p>
                    </div>

                    {/* Solar Solutions */}
                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
                            Solar Solutions
                        </h4>
                        <ul className="space-y-2.5">
                            {solarSolutions.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
                            Quick Links
                        </h4>
                        <ul className="space-y-2.5">
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
                            Company
                        </h4>
                        <ul className="space-y-2.5">
                            {companyLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
                            Contact Info
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                Karachi, Pakistan
                            </li>
                            <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4 shrink-0 text-primary" />
                                +92 311 1096664
                            </li>
                            <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4 shrink-0 text-primary" />
                                info@paksolartech.com
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="my-8 bg-border/50" />

                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} PakSolarTech. All rights reserved.
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span>Powered by</span>
                        <Zap className="h-3 w-3 text-primary" />
                        <span className="text-gradient font-medium">Solar Energy</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
