'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard, MessageSquare, FileText, LogOut,
    Sun, Menu, X, ChevronRight, Store, Package, Users, Settings2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import ThemeToggle from '@/components/ThemeToggle';

const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/vendors', label: 'Vendors', icon: Store },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/categories', label: 'Categories', icon: FileText },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
    { href: '/admin/services', label: 'Services', icon: Sun },
    { href: '/admin/faqs', label: 'FAQs', icon: MessageSquare },
    { href: '/admin/blogs', label: 'Blog Posts', icon: FileText },
    { href: '/admin/calculator-settings', label: 'Calculator Settings', icon: Settings2 },
];

interface AdminUser {
    id: number;
    name: string;
    email: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [admin, setAdmin] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Validate via cookie-based session (HttpOnly cookie set by server)
                const res = await fetch('/api/auth/me');
                if (!res.ok) {
                    router.push('/admin/login');
                    return;
                }
                const data = await res.json();
                if (!data.user || !['super_admin', 'admin'].includes(data.user.role)) {
                    router.push('/admin/login');
                    return;
                }
                setAdmin(data.user);
            } catch {
                router.push('/admin/login');
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        localStorage.removeItem('admin_user');
        router.push('/admin/login');
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
        );
    }

    const SidebarContent = () => (
        <div className="flex h-screen flex-col sticky top-0">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-4 py-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                    <Sun className="h-4 w-4 text-primary" />
                </div>
                <div>
                    <span className="text-lg font-bold">
                        <span className="text-gradient">Pak</span>Solar
                    </span>
                    <p className="text-[10px] uppercase leading-none tracking-widest text-muted-foreground">Admin Panel</p>
                </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Nav */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navItems.map((item) => {
                    const active = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${active
                                ? 'bg-primary/10 text-primary'
                                : 'text-muted-foreground hover:bg-primary/5 hover:text-foreground'
                                }`}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                            {active && <ChevronRight className="ml-auto h-3.5 w-3.5" />}
                        </Link>
                    );
                })}
            </nav>

            <Separator className="bg-border/50" />

            {/* User + Logout */}
            <div className="px-3 py-4 space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                    <span className="text-xs text-muted-foreground">Theme</span>
                    <ThemeToggle />
                </div>
                <div className="rounded-lg bg-muted/50 px-3 py-2.5">
                    <p className="text-sm font-medium truncate">{admin?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{admin?.email}</p>
                </div>
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
                    onClick={handleLogout}
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen">
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 shrink-0 border-r border-border/50 bg-card/50 md:block">
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col">
                {/* Mobile Header */}
                <header className="flex items-center justify-between border-b border-border/50 bg-card/50 px-4 py-3 md:hidden">
                    <div className="flex items-center gap-2">
                        <Sun className="h-5 w-5 text-primary" />
                        <span className="text-lg font-bold">
                            <span className="text-gradient">Pak</span>Solar
                        </span>
                    </div>
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 border-border bg-card p-0">
                            <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
                            <SidebarContent />
                        </SheetContent>
                    </Sheet>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
