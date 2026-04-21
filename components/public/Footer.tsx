import Link from 'next/link';
import { Sun, Zap, MapPin, Phone, Mail } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const quickLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About Us' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
];

export default function Footer() {
    return (
        <footer className="border-t border-border bg-card/50">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="space-y-4">
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

                    {/* Services */}
                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
                            Services
                        </h4>
                        <ul className="space-y-2.5 text-sm text-muted-foreground">
                            <li><Link href="/services/residential-solar" className="hover:text-primary transition-colors">Residential Solar</Link></li>
                            <li><Link href="/services/commercial-solar" className="hover:text-primary transition-colors">Commercial Solar</Link></li>
                            <li><Link href="/services/battery-storage" className="hover:text-primary transition-colors">Battery Storage</Link></li>
                            <li><Link href="/services/maintenance-repair" className="hover:text-primary transition-colors">Solar Maintenance</Link></li>
                            <li><Link href="/services/energy-consulting" className="hover:text-primary transition-colors">Energy Consulting</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
                            Contact Us
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                Karachi, Sindh, Pakistan
                            </li>
                            <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4 shrink-0 text-primary" />
                                +92 300 1234567
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
