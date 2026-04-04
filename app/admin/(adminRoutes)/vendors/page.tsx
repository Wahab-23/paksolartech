'use client';

import { useEffect, useState } from 'react';

import { CheckCircle, XCircle, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Vendor {
    id: number;
    business_name: string;
    name: string;
    email: string;
    is_approved: boolean;
    commission_rate: number;
    created_at: string;
}

export default function AdminVendorsPage() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/vendors')
            .then(r => r.json())
            .then(data => { setVendors(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const handleApprove = async (id: number, approve: boolean) => {
        await fetch(`/api/admin/vendors/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_approved: approve }),
        });
        setVendors(prev => prev.map(v => v.id === id ? { ...v, is_approved: approve } : v));
    };

    const handleCommission = async (id: number, rate: number) => {
        await fetch(`/api/admin/vendors/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ commission_rate: rate }),
        });
        setVendors(prev => prev.map(v => v.id === id ? { ...v, commission_rate: rate } : v));
    };

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Vendors</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Manage vendor registrations and commissions.</p>
                </div>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-16 rounded-xl border border-border/50 bg-card/50 animate-pulse" />
                    ))}
                </div>
            ) : vendors.length === 0 ? (
                <div className="rounded-xl border border-border/50 bg-card/50 p-12 text-center">
                    <p className="text-muted-foreground">No vendors registered yet.</p>
                </div>
            ) : (
                <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="border-b border-border/50 bg-muted/30">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Business</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Owner</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Commission %</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {vendors.map((vendor) => (
                                <tr key={vendor.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-4 py-3 font-medium">{vendor.business_name}</td>
                                    <td className="px-4 py-3">
                                        <div>{vendor.name}</div>
                                        <div className="text-xs text-muted-foreground">{vendor.email}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {vendor.is_approved ? (
                                            <span className="inline-flex items-center gap-1 text-xs text-green-400"><CheckCircle className="h-3 w-3" /> Approved</span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-xs text-yellow-400"><Clock className="h-3 w-3" /> Pending</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <input
                                            type="number"
                                            min={0}
                                            max={100}
                                            defaultValue={vendor.commission_rate}
                                            className="w-20 rounded-lg border border-border/50 bg-background px-2 py-1 text-sm"
                                            onBlur={(e) => handleCommission(vendor.id, Number(e.target.value))}
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            {!vendor.is_approved ? (
                                                <button
                                                    onClick={() => handleApprove(vendor.id, true)}
                                                    className="text-xs rounded-lg px-3 py-1.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                                                >
                                                    Approve
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleApprove(vendor.id, false)}
                                                    className="text-xs rounded-lg px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                                >
                                                    Revoke
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}
