'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, FileText, Eye, EyeOff } from 'lucide-react';

interface Stats {
    totalInquiries: number;
    unreadInquiries: number;
    totalBlogs: number;
    publishedBlogs: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        const headers: HeadersInit = { Authorization: `Bearer ${token}` };

        Promise.all([
            fetch('/api/inquiries', { headers }).then((r) => r.ok ? r.json() : []),
            fetch('/api/blogs', { headers }).then((r) => r.ok ? r.json() : []),
        ]).then(([inquiries, blogs]) => {
            const unread = Array.isArray(inquiries) ? inquiries.filter((i: { is_read: boolean }) => !i.is_read).length : 0;
            setStats({
                totalInquiries: Array.isArray(inquiries) ? inquiries.length : 0,
                unreadInquiries: unread,
                totalBlogs: Array.isArray(blogs) ? blogs.length : 0,
                publishedBlogs: Array.isArray(blogs) ? blogs.filter((b: { is_published: boolean }) => b.is_published).length : 0,
            });
        });
    }, []);

    const cards = stats
        ? [
            { label: 'Total Inquiries', value: stats.totalInquiries, icon: MessageSquare, color: 'text-primary' },
            { label: 'Unread Inquiries', value: stats.unreadInquiries, icon: EyeOff, color: 'text-yellow-400' },
            { label: 'Total Posts', value: stats.totalBlogs, icon: FileText, color: 'text-chart-2' },
            { label: 'Published Posts', value: stats.publishedBlogs, icon: Eye, color: 'text-green-400' },
        ]
        : [];

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Overview of your solar business admin.</p>
            </div>

            {!stats ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="rounded-xl border border-border/50 bg-card/50 p-5">
                            <div className="h-4 w-24 animate-pulse rounded bg-muted mb-3" />
                            <div className="h-8 w-12 animate-pulse rounded bg-muted" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card) => (
                        <div
                            key={card.label}
                            className="group rounded-xl border border-border/50 bg-card/50 p-5 transition-all hover:border-primary/30 hover:bg-card"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">{card.label}</p>
                                <card.icon className={`h-4 w-4 ${card.color}`} />
                            </div>
                            <p className="text-3xl font-bold">{card.value}</p>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
