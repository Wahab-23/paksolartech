'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function EditCategoryPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
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
        const fetchCategory = async () => {
            try {
                const res = await fetch(`/api/admin/categories/${id}`);
                const data = await res.json();
                if (data) {
                    setForm({
                        name: data.name || '',
                        slug: data.slug || '',
                        description: data.description || '',
                        icon: data.icon || '',
                        meta_title: data.meta_title || '',
                        meta_description: data.meta_description || '',
                        meta_keywords: data.meta_keywords || ''
                    });
                }
            } catch (err) {
                console.error("Error fetching category:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategory();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`/api/admin/categories/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (!res.ok) throw new Error("Failed to update");
            router.push('/admin/categories');
        } catch (err) {
            alert('Failed to save category');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold tracking-tight mb-6">Edit Category</h1>
            <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border/50 bg-card/80 p-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label>Category Name</Label>
                        <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="grid gap-2">
                        <Label>Slug</Label>
                        <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Icon (Emoji/URL)</Label>
                        <Input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} />
                    </div>
                </div>
                
                <div className="grid gap-2">
                    <Label>Description</Label>
                    <textarea
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        rows={3}
                        className="rounded-lg border border-border/50 bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>

                <div className="space-y-4 pt-4 border-t border-border/50">
                    <h3 className="font-semibold">SEO Metadata</h3>
                    <div className="grid gap-2">
                        <Label>Meta Title</Label>
                        <Input value={form.meta_title} onChange={e => setForm({ ...form, meta_title: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Meta Description</Label>
                        <textarea
                            value={form.meta_description}
                            onChange={e => setForm({ ...form, meta_description: e.target.value })}
                            rows={2}
                            className="rounded-lg border border-border/50 bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>

                <div className="flex gap-4 pt-2">
                    <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Update Category'}</Button>
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/categories')}>Cancel</Button>
                </div>
            </form>
        </div>
    );
}
