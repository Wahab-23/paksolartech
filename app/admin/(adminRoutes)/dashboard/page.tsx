'use client';

import { useEffect, useState } from 'react';

import { 
    Users, Store, ShoppingBag, MessageSquare, TrendingUp, 
    FileText, Package, DollarSign, RefreshCw, CheckCircle2 
} from 'lucide-react';
import Link from 'next/link';

interface MarketplaceStats {
    total_revenue: number;
    total_users: number;
    active_vendors: number;
    total_orders: number;
    total_views: number;
    totalInquiries?: number;
    unreadInquiries?: number;
    totalBlogs?: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<MarketplaceStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const [statsRes, inquiriesRes, blogsRes] = await Promise.all([
                    fetch('/api/admin/stats'),
                    fetch('/api/inquiries'),
                    fetch('/api/blogs'),
                ]);

                const marketStats = statsRes.ok ? await statsRes.json() : {};
                const inquiries = inquiriesRes.ok ? await inquiriesRes.json() : [];
                const blogs = blogsRes.ok ? await blogsRes.json() : [];

                setStats({
                    ...marketStats,
                    totalInquiries: Array.isArray(inquiries) ? inquiries.length : 0,
                    unreadInquiries: Array.isArray(inquiries) ? inquiries.filter((i: { is_read: boolean }) => !i.is_read).length : 0,
                    totalBlogs: Array.isArray(blogs) ? blogs.length : 0,
                });
            } catch (e) {
                console.error('Dashboard stats error:', e);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    const statCards = [
        { label: 'Total Revenue', value: `Rs. ${Number(stats?.total_revenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-400/10' },
        { label: 'Total Users', value: stats?.total_users ?? '—', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { label: 'Active Vendors', value: stats?.active_vendors ?? '—', icon: Store, color: 'text-purple-400', bg: 'bg-purple-400/10' },
        { label: 'Total Orders', value: stats?.total_orders ?? '—', icon: ShoppingBag, color: 'text-primary', bg: 'bg-primary/10' },
        { label: 'Page Views', value: stats?.total_views ?? '—', icon: TrendingUp, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        { label: 'Inquiries', value: stats?.totalInquiries ?? '—', icon: MessageSquare, color: 'text-pink-400', bg: 'bg-pink-400/10' },
        { label: 'Unread Inquiries', value: stats?.unreadInquiries ?? '—', icon: MessageSquare, color: 'text-orange-400', bg: 'bg-orange-400/10' },
        { label: 'Blog Posts', value: stats?.totalBlogs ?? '—', icon: FileText, color: 'text-chart-2', bg: 'bg-chart-2/10' },
    ];

    const quickLinks = [
        { href: '/admin/vendors', label: 'Manage Vendors', icon: Store, desc: 'Approve & configure vendors' },
        { href: '/admin/products', label: 'Manage Products', icon: Package, desc: 'Global product registry' },
        { href: '/admin/users', label: 'Manage Users', icon: Users, desc: 'All users & roles' },
        { href: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare, desc: 'Customer messages' },
    ];

    return (
        <>
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight">Marketplace Dashboard</h1>
                <p className="mt-1 text-sm text-muted-foreground">Full overview of the PakSolarTech multi-vendor platform.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {loading
                    ? Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="rounded-xl border border-border/50 bg-card/50 p-5 animate-pulse">
                            <div className="h-4 w-24 rounded bg-muted mb-4" />
                            <div className="h-8 w-16 rounded bg-muted" />
                        </div>
                    ))
                    : statCards.map((card) => (
                        <div key={card.label} className="group rounded-xl border border-border/50 bg-card/50 p-5 transition-all hover:border-primary/30 hover:bg-card">
                            <div className="mb-3 flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">{card.label}</p>
                                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${card.bg}`}>
                                    <card.icon className={`h-3.5 w-3.5 ${card.color}`} />
                                </div>
                            </div>
                            <p className="text-2xl font-bold">{card.value}</p>
                        </div>
                    ))}
            </div>

            {/* Quick Links */}
            <div className="mb-8">
                <h2 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Quick Actions</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {quickLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="group rounded-xl border border-border/50 bg-card/50 p-5 transition-all hover:border-primary/40 hover:bg-card"
                        >
                            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                                <link.icon className="h-4 w-4 text-primary" />
                            </div>
                            <p className="font-semibold text-sm">{link.label}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{link.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* System Management */}
            <div className="mt-12">
                <h2 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">System Management</h2>
                <div className="rounded-2xl border border-border/50 bg-card/30 p-6 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-lg font-bold">Cache Management</h3>
                            <p className="text-sm text-muted-foreground mt-1">If updates aren't showing on the live site, use these buttons to clear the static cache.</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <RevalidateButton type="all" label="Clear Whole Site" icon={RefreshCw} />
                            <RevalidateButton type="tag" tag="blogs" label="Refresh Blogs" icon={FileText} />
                            <RevalidateButton type="tag" tag="services" label="Refresh Services" icon={Package} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function RevalidateButton({ type, tag, label, icon: Icon }: { type: string, tag?: string, label: string, icon: any }) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleRevalidate = async () => {
        setStatus('loading');
        try {
            const res = await fetch('/api/admin/revalidate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, tag }),
            });
            if (res.ok) {
                setStatus('success');
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                setStatus('error');
            }
        } catch (e) {
            setStatus('error');
        }
    };

    return (
        <button
            onClick={handleRevalidate}
            disabled={status === 'loading'}
            className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all
                ${status === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                  status === 'error' ? 'bg-destructive/20 text-destructive border border-destructive/30' :
                  'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'}
                disabled:opacity-50
            `}
        >
            {status === 'loading' ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
            ) : status === 'success' ? (
                <CheckCircle2 className="h-4 w-4" />
            ) : (
                <Icon className="h-4 w-4" />
            )}
            {label}
        </button>
    );
}
