'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, X, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string;
    description: string;
    meta_title: string;
    meta_description: string;
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        name: '',
        slug: '',
        description: '',
        icon: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        setLoading(true);
        fetch('/api/admin/categories')
            .then(r => r.json())
            .then(data => { setCategories(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const res = await fetch('/api/admin/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error || 'Failed to create category'); return; }
            fetchCategories();
            setShowForm(false);
            setForm({ name: '', slug: '', description: '', icon: '', meta_title: '', meta_description: '', meta_keywords: '' });
        } catch {
            setError('Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Manage your product categories and SEO metadata.</p>
                </div>
                <Button onClick={() => setShowForm(true)} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Category
                </Button>
            </div>

            {showForm && (
                <div className="mb-6 rounded-xl border border-border/50 bg-card/80 p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-semibold">New Category</h2>
                        <button onClick={() => setShowForm(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
                    </div>
                    {error && <div className="mb-3 text-sm text-destructive">{error}</div>}
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Category Name</Label>
                                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Solar Panels" required />
                            </div>
                            <div className="grid gap-2">
                                <Label>Slug (optional)</Label>
                                <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="e.g. solar-panels" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Icon (Emoji/URL)</Label>
                                <Input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="e.g. ☀️" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Meta Title</Label>
                                <Input value={form.meta_title} onChange={e => setForm({ ...form, meta_title: e.target.value })} placeholder="SEO Title" />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Description</Label>
                            <textarea
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                rows={2}
                                className="rounded-lg border border-border/50 bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="Category explanation..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Meta Description</Label>
                            <textarea
                                value={form.meta_description}
                                onChange={e => setForm({ ...form, meta_description: e.target.value })}
                                rows={2}
                                className="rounded-lg border border-border/50 bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="SEO Description..."
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Create Category'}</Button>
                            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-14 rounded-xl border border-border/50 bg-card/50 animate-pulse" />
                    ))}
                </div>
            ) : categories.length === 0 ? (
                <div className="rounded-xl border border-border/50 bg-card/50 p-12 text-center">
                    <p className="text-muted-foreground">No categories defined yet.</p>
                </div>
            ) : (
                <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="border-b border-border/50 bg-muted/30">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-12">Icon</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Slug</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Description</th>
                                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {categories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-4 py-3 text-xl">{cat.icon}</td>
                                    <td className="px-4 py-3 font-medium">{cat.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{cat.slug}</td>
                                    <td className="px-4 py-3 text-muted-foreground text-xs truncate max-w-[200px]">{cat.description}</td>
                                    <td className="px-4 py-3 text-right">
                                         <Link href={`/admin/categories/${cat.id}/edit`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Pencil className="h-4 w-4" /></Button>
                                         </Link>
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
