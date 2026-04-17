"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Save, Package } from 'lucide-react';
import { LexicalEditor, type LexicalEditorRef } from '@/components/lexical/LexicalEditor';
import MultiImageUpload from '@/components/admin/MultiImageUpload';

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);

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
    const [specs, setSpecs] = useState<{ label: string, value: string }[]>([]);
    const editorRef = useRef<LexicalEditorRef>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pRes, cRes] = await Promise.all([
                    fetch(`/api/admin/products/${id}`).then(r => r.json()),
                    fetch('/api/admin/categories').then(r => r.json())
                ]);

                setCategories(cRes);

                if (pRes) {
                    setForm({
                        name: pRes.name || '',
                        slug: pRes.slug || '',
                        short_desc: pRes.short_desc || '',
                        description: pRes.description || '',
                        brand: pRes.brand || '',
                        price_from: pRes.price_from || '',
                        price_to: pRes.price_to || '',
                        wattage: pRes.wattage || '',
                        badge: pRes.badge || '',
                        category_id: pRes.category_id || '',
                        status: pRes.status || 'active',
                        is_featured: !!pRes.is_featured,
                        meta_title: pRes.meta_title || '',
                        meta_description: pRes.meta_description || '',
                        meta_keywords: pRes.meta_keywords || '',
                        image_url: pRes.image_url || ''
                    });

                    if (pRes.specs) {
                        const parsedSpecs = typeof pRes.specs === 'string' ? JSON.parse(pRes.specs) : pRes.specs;
                        setSpecs(parsedSpecs.length > 0 ? parsedSpecs : [{ label: '', value: '' }]);
                    }

                    if (pRes.images) {
                        const parsedImages = typeof pRes.images === 'string' ? JSON.parse(pRes.images) : pRes.images;
                        setImages(parsedImages || []);
                    }
                }
            } catch (err) {
                console.error("Error fetching product data:", err);
                toast.error("Failed to load product data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        
        // Get the latest content from the editor
        const editorContent = editorRef.current?.getContent() || form.description;

        // Ensure image_url is synchronized with the first image in the array if empty
        const primaryImage = images.length > 0 ? images[0] : form.image_url;

        const payload = {
            ...form,
            description: editorContent,
            image_url: primaryImage,
            images: images,
            price_from: parseFloat(form.price_from as string) || 0,
            price_to: form.price_to ? parseFloat(form.price_to as string) : null,
            wattage: form.wattage ? parseInt(form.wattage as string) : null,
            category_id: form.category_id ? Number(form.category_id) : null,
            specs: specs.filter(s => s.label && s.value),
            is_featured: form.is_featured ? 1 : 0
        };

        try {
            const res = await fetch(`/api/admin/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error("Failed to update");
            toast.success("Product updated successfully!");
            router.push('/admin/products');
        } catch (err) {
            toast.error("Failed to save product");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex h-[50vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );

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
                        Edit Product: <span className="text-primary/70">{form.name}</span>
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => router.push('/admin/products')}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} className="gap-2 glow" disabled={saving}>
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column — Core Details */}
                <div className="md:col-span-2 space-y-8">
                    {/* Basic Info */}
                    <div className="rounded-xl border border-border/50 bg-card/50 p-6 space-y-6">
                        <h2 className="font-semibold text-lg flex items-center gap-2">
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
                        </div>
                    </div>

                    {/* Rich Description (Lexical) */}
                    <div className="rounded-xl border border-border/50 bg-card/50 p-6 space-y-4">
                        <h2 className="font-semibold text-lg">Product Story & Full Description</h2>
                        <div className="rounded-lg border border-border/50 bg-background/50 overflow-hidden text-foreground">
                            <LexicalEditor
                                ref={editorRef}
                                initialContent={form.description}
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
                            + Add Specification
                        </Button>
                    </div>
                </div>

                {/* Right Column — Secondary Details */}
                <div className="space-y-8">
                    {/* Media Management */}
                    <div className="rounded-xl border border-border/50 bg-card/50 p-6 space-y-4">
                        <h2 className="font-semibold text-lg">Product Media</h2>
                        <MultiImageUpload 
                            images={images} 
                            onChange={(newImages) => setImages(newImages)} 
                        />
                    </div>

                    {/* Pricing & Logistics */}
                    <div className="rounded-xl border border-border/50 bg-card/50 p-6 space-y-4">
                        <h2 className="font-semibold text-lg text-primary">Price & Detail</h2>
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Base Price (PKR)</Label>
                                <Input type="number" value={form.price_from} onChange={e => setForm({ ...form, price_from: e.target.value })} />
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
