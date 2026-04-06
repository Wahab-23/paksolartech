'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function NewProductPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
    
    useEffect(() => {
        fetch('/api/admin/categories').then(r => r.json()).then(data => setCategories(data));
    }, []);

    const [form, setForm] = useState({
        name: '',
        slug: '',
        short_desc: '',
        description: '',
        brand: '',
        price_from: '',
        price_to: '',
        wattage: '',
        badge: '',
        category_id: '',
        status: 'active',
        is_featured: false,
        meta_title: '',
        meta_description: '',
        meta_keywords: ''
    });

    const [specs, setSpecs] = useState([{ label: '', value: '' }]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const payload = {
            ...form,
            price_from: parseFloat(form.price_from) || 0,
            price_to: parseFloat(form.price_to) || null,
            wattage: parseInt(form.wattage) || null,
            category_id: Number(form.category_id) || null,
            specs: specs.filter(s => s.label && s.value)
        };

        try {
            await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            router.push('/admin/products');
        } catch {
            alert('Failed to save product');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl">
            <h1 className="text-2xl font-bold tracking-tight mb-6">Create New Product</h1>
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* General Info */}
                <div className="rounded-xl border border-border/50 bg-card/80 p-6 space-y-4">
                    <h2 className="font-semibold text-lg border-b border-border/50 pb-2">Basic Info</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Product Name</Label>
                            <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                        </div>
                        <div className="grid gap-2">
                            <Label>Category</Label>
                            <select 
                                value={form.category_id} 
                                onChange={e => setForm({...form, category_id: e.target.value})}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                            >
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Brand</Label>
                            <Input value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Short Description</Label>
                            <Input value={form.short_desc} onChange={e => setForm({...form, short_desc: e.target.value})} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Base Price</Label>
                            <Input type="number" value={form.price_from} onChange={e => setForm({...form, price_from: e.target.value})} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Wattage</Label>
                            <Input type="number" value={form.wattage} onChange={e => setForm({...form, wattage: e.target.value})} />
                        </div>
                    </div>
                </div>

                {/* Specs */}
                <div className="rounded-xl border border-border/50 bg-card/80 p-6 space-y-4">
                    <h2 className="font-semibold text-lg border-b border-border/50 pb-2">Product Specifications</h2>
                    {specs.map((spec, i) => (
                        <div key={i} className="flex gap-4">
                            <Input placeholder="Label (e.g. Efficiency)" value={spec.label} onChange={e => {
                                const newSpecs = [...specs]; newSpecs[i].label = e.target.value; setSpecs(newSpecs);
                            }} />
                            <Input placeholder="Value (e.g. 22%)" value={spec.value} onChange={e => {
                                const newSpecs = [...specs]; newSpecs[i].value = e.target.value; setSpecs(newSpecs);
                            }} />
                        </div>
                    ))}
                    <Button type="button" variant="ghost" onClick={() => setSpecs([...specs, {label: '', value: ''}])}>+ Add Spec</Button>
                </div>

                {/* SEO */}
                <div className="rounded-xl border border-border/50 bg-card/80 p-6 space-y-4">
                    <h2 className="font-semibold text-lg border-b border-border/50 pb-2">SEO Meta Data</h2>
                    <div className="grid gap-2">
                        <Label>Meta Title</Label>
                        <Input value={form.meta_title} onChange={e => setForm({...form, meta_title: e.target.value})} />
                    </div>
                    <div className="grid gap-2">
                        <Label>Meta Description</Label>
                        <textarea 
                            className="rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                            rows={2} value={form.meta_description} onChange={e => setForm({...form, meta_description: e.target.value})} />
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button type="submit" disabled={saving} size="lg">{saving ? 'Saving...' : 'Publish Product'}</Button>
                    <Button type="button" variant="outline" size="lg" onClick={() => router.push('/admin/products')}>Cancel</Button>
                </div>
            </form>
        </div>
    );
}
