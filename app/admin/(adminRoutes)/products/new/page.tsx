'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Save, Package, Plus } from 'lucide-react';
import BlockNoteEditor, { type BlockNoteEditorRef } from '@/components/blocknote/blocknoteEditor';
import MultiImageUpload from '@/components/admin/MultiImageUpload';

export default function NewProductPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);

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
        meta_keywords: '',
        image_url: '' // Legacy/Primary
    });

    const [images, setImages] = useState<string[]>([]);
    const [specs, setSpecs] = useState<{ label: string, value: string }[]>([{ label: '', value: '' }]);
    const editorRef = useRef<BlockNoteEditorRef>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name.trim()) {
            toast.error('Product name is required');
            return;
        }

        setSaving(true);

        // Get the latest content from the editor
        const editorContent = editorRef.current ? await editorRef.current.getContent() : form.description;

        const payload = {
            ...form,
            description: editorContent,
            image_url: images.length > 0 ? images[0] : null,
            images: images,
            price_from: parseFloat(form.price_from as string) || 0,
            price_to: form.price_to ? parseFloat(form.price_to as string) : null,
            wattage: form.wattage ? parseInt(form.wattage as string) : null,
            category_id: form.category_id ? Number(form.category_id) : null,
            specs: specs.filter(s => s.label && s.value),
            is_featured: form.is_featured ? 1 : 0
        };

        try {
            const res = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Failed to create product');

            toast.success('Product created successfully!');
            router.push('/admin/products');
        } catch (err) {
            toast.error('Failed to save product');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="mx-auto max-w-5xl space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-muted-foreground"
                        onClick={() => router.push('/admin/products')}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Package className="h-6 w-6 text-primary" />
                        Create New Product
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => router.push('/admin/products')}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} className="gap-2 glow" disabled={saving}>
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Publish Product
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column — Core Details */}
                <div className="md:col-span-2 space-y-8">
                    {/* Basic Info */}
                    <div className="rounded-xl border border-border/50 bg-card/50 p-6 space-y-6">
                        <h2 className="font-semibold text-lg flex items-center gap-2">
                            <Package className="h-5 w-5 text-primary" />
                            Basic Info
                        </h2>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label>Product Name *</Label>
                                <Input
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    placeholder="e.g. Longi Hi-MO 6 Explorer"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Short Description</Label>
                                <Textarea
                                    value={form.short_desc}
                                    onChange={e => setForm({ ...form, short_desc: e.target.value })}
                                    placeholder="A brief catchy summary for product cards..."
                                    rows={2}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Category</Label>
                                <select
                                    value={form.category_id}
                                    onChange={e => setForm({ ...form, category_id: e.target.value })}
                                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    <option value="">Uncategorized</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Brand</Label>
                                <Input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} placeholder="e.g. Longi, Canadian Solar" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Badge</Label>
                                <Input value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })} placeholder="e.g. Best Seller, New" />
                            </div>
                        </div>
                    </div>

                     {/* Media Management */}
                    <div className="rounded-xl border border-border/50 bg-card/50 p-6 space-y-4">
                        <h2 className="font-semibold text-lg">Product Media</h2>
                        <MultiImageUpload
                            images={images}
                            onChange={(newImages) => setImages(newImages)}
                            uploadPath="products"
                        />
                    </div>

                    {/* Rich Description (BlockNote) */}
                    <div className="rounded-xl border border-border/50 bg-card/50 p-6 space-y-4">
                        <h2 className="font-semibold text-lg">Product Story & Full Description</h2>
                        <div className="rounded-lg border border-border/50 bg-background/50 overflow-hidden text-foreground">
                            <BlockNoteEditor
                                ref={editorRef}
                                initialContent=""
                                placeholder="Write a detailed product description..."
                            />
                        </div>
                    </div>

                    {/* Specifications */}
                    <div className="rounded-xl border border-border/50 bg-card/50 p-6 space-y-4">
                        <h2 className="font-semibold text-lg">Technical Specifications</h2>
                        <div className="space-y-3">
                            {specs.map((spec, i) => (
                                <div key={i} className="flex gap-4 items-center">
                                    <Input
                                        placeholder="Label (e.g. Efficiency)"
                                        value={spec.label}
                                        onChange={e => {
                                            const newSpecs = [...specs]; newSpecs[i].label = e.target.value; setSpecs(newSpecs);
                                        }}
                                        className="flex-1"
                                    />
                                    <Input
                                        placeholder="Value (e.g. 22.5%)"
                                        value={spec.value}
                                        onChange={e => {
                                            const newSpecs = [...specs]; newSpecs[i].value = e.target.value; setSpecs(newSpecs);
                                        }}
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setSpecs(specs.filter((_, idx) => idx !== i))}
                                        className="text-muted-foreground hover:text-destructive"
                                    >
                                        <ArrowLeft className="h-4 w-4 rotate-45" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={() => setSpecs([...specs, { label: '', value: '' }])}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Specification
                        </Button>
                    </div>
                </div>

                {/* Right Column — Secondary Details */}
                <div className="space-y-8">
                    {/* Pricing & Logistics */}
                    <div className="rounded-xl border border-border/50 bg-card/50 p-6 space-y-4">
                        <h2 className="font-semibold text-lg text-primary">Price & Detail</h2>
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Base Price (PKR)</Label>
                                <Input type="number" value={form.price_from} onChange={e => setForm({ ...form, price_from: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Max Price (PKR)</Label>
                                <Input type="number" value={form.price_to} onChange={e => setForm({ ...form, price_to: e.target.value })} placeholder="Optional range" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Wattage (W)</Label>
                                <Input type="number" value={form.wattage} onChange={e => setForm({ ...form, wattage: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                                <Label>Status</Label>
                                <select
                                    value={form.status}
                                    onChange={e => setForm({ ...form, status: e.target.value })}
                                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <Switch
                                    id="featured"
                                    checked={form.is_featured}
                                    onCheckedChange={(checked) => setForm({ ...form, is_featured: checked })}
                                />
                                <Label htmlFor="featured" className="cursor-pointer">Featured Product</Label>
                            </div>
                        </div>
                    </div>

                    {/* SEO Metadata */}
                    <div className="rounded-xl border border-border/50 bg-card/50 p-6 space-y-4">
                        <h2 className="font-semibold text-lg">SEO & Meta Fields</h2>
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Meta Title</Label>
                                <Input value={form.meta_title} onChange={e => setForm({ ...form, meta_title: e.target.value })} placeholder="Browser tab title..." />
                            </div>
                            <div className="grid gap-2">
                                <Label>Meta Description</Label>
                                <Textarea
                                    value={form.meta_description}
                                    onChange={e => setForm({ ...form, meta_description: e.target.value })}
                                    placeholder="Search engine snippet..."
                                    rows={3}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Keywords (comma separated)</Label>
                                <Input value={form.meta_keywords} onChange={e => setForm({ ...form, meta_keywords: e.target.value })} placeholder="solar, panels, efficiency" />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
