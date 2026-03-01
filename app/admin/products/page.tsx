'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Product {
    id: number;
    name: string;
    slug: string;
    status: string;
    created_at: string;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: '', description: '', status: 'active' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('/api/admin/products')
            .then(r => r.json())
            .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const res = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error || 'Failed to create product'); return; }
            // Refresh
            const updated = await fetch('/api/admin/products').then(r => r.json());
            setProducts(Array.isArray(updated) ? updated : []);
            setShowForm(false);
            setForm({ name: '', description: '', status: 'active' });
        } catch {
            setError('Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Products</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Global product registry. Vendors attach offers to these products.</p>
                </div>
                <Button onClick={() => setShowForm(true)} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Product
                </Button>
            </div>

            {showForm && (
                <div className="mb-6 rounded-xl border border-border/50 bg-card/80 p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-semibold">New Product</h2>
                        <button onClick={() => setShowForm(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
                    </div>
                    {error && <div className="mb-3 text-sm text-destructive">{error}</div>}
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Product Name</Label>
                            <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. 500W Solar Panel" required />
                        </div>
                        <div className="grid gap-2">
                            <Label>Description</Label>
                            <textarea
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                rows={3}
                                className="rounded-lg border border-border/50 bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="Product description..."
                            />
                        </div>
                        <div className="flex gap-3">
                            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Create Product'}</Button>
                            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-14 rounded-xl border border-border/50 bg-card/50 animate-pulse" />
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="rounded-xl border border-border/50 bg-card/50 p-12 text-center">
                    <p className="text-muted-foreground">No products in the registry yet. Add the first one!</p>
                </div>
            ) : (
                <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="border-b border-border/50 bg-muted/30">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Slug</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Created</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-4 py-3 font-medium">{product.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{product.slug}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${product.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-muted text-muted-foreground'}`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground text-xs">
                                        {new Date(product.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
}
