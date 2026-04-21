'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
    ArrowLeft, Loader2, Plus, Sun, Zap, Battery, Wrench, 
    BarChart3, Shield, Trash2, Upload, Globe2, Heart, 
    Clock, Settings, Headphones, HelpCircle, MessageSquare
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const iconOptions = [
    { name: 'Sun', icon: Sun },
    { name: 'Zap', icon: Zap },
    { name: 'Battery', icon: Battery },
    { name: 'Wrench', icon: Wrench },
    { name: 'BarChart3', icon: BarChart3 },
    { name: 'Shield', icon: Shield },
    { name: 'Globe2', icon: Globe2 },
    { name: 'Heart', icon: Heart },
    { name: 'Clock', icon: Clock },
    { name: 'Settings', icon: Settings },
    { name: 'Headphones', icon: Headphones }
];

export default function NewServicePage() {
    const router = useRouter();
    const fileRef = useRef<HTMLInputElement>(null);
    
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    
    const [form, setForm] = useState({
        title: '',
        slug: '',
        short_desc: '',
        long_desc: '',
        icon: 'Sun',
        image_url: '',
        is_active: true,
        features: [] as string[],
        benefits: [] as { title: string; desc: string; icon: string }[],
        process: [] as { step: string; title: string; desc: string }[],
        faqs: [] as { question: string; answer: string }[]
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (res.ok) { 
                setForm({ ...form, image_url: data.url }); 
                toast.success('Image uploaded'); 
            }
            else toast.error(data.error || 'Upload failed');
        } catch { toast.error('Upload failed'); }
        finally { setUploading(false); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.slug) {
            toast.error('Title and slug are required');
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch('/api/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                toast.success('Service created successfully');
                router.push('/admin/services');
            } else {
                const data = await res.json();
                throw new Error(data.error);
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to create service');
        } finally {
            setSubmitting(false);
        }
    };

    const addFeature = () => setForm({ ...form, features: [...form.features, ''] });
    const removeFeature = (idx: number) => setForm({ ...form, features: form.features.filter((_, i) => i !== idx) });
    const updateFeature = (idx: number, val: string) => {
        const newFeatures = [...form.features];
        newFeatures[idx] = val;
        setForm({ ...form, features: newFeatures });
    };

    const addBenefit = () => setForm({ ...form, benefits: [...form.benefits, { title: '', desc: '', icon: 'CheckCircle2' }] });
    const removeBenefit = (idx: number) => setForm({ ...form, benefits: form.benefits.filter((_, i) => i !== idx) });
    const updateBenefit = (idx: number, field: string, val: string) => {
        const newBenefits = [...form.benefits] as any;
        newBenefits[idx][field] = val;
        setForm({ ...form, benefits: newBenefits });
    };

    const addProcess = () => setForm({ ...form, process: [...form.process, { step: `0${form.process.length + 1}`, title: '', desc: '' }] });
    const removeProcess = (idx: number) => setForm({ ...form, process: form.process.filter((_, i) => i !== idx) });
    const updateProcess = (idx: number, field: string, val: string) => {
        const newProcess = [...form.process] as any;
        newProcess[idx][field] = val;
        setForm({ ...form, process: newProcess });
    };

    const addFaq = () => setForm({ ...form, faqs: [...form.faqs, { question: '', answer: '' }] });
    const removeFaq = (idx: number) => setForm({ ...form, faqs: form.faqs.filter((_, i) => i !== idx) });
    const updateFaq = (idx: number, field: string, val: string) => {
        const newFaqs = [...form.faqs] as any;
        newFaqs[idx][field] = val;
        setForm({ ...form, faqs: newFaqs });
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto max-w-5xl space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 z-20 bg-background/80 py-4 backdrop-blur-sm border-b border-border/50">
                <div className="flex items-center gap-4">
                    <Button type="button" variant="ghost" size="icon" onClick={() => router.push('/admin/services')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Add New Service</h1>
                        <p className="text-sm text-muted-foreground">Create a new solar offering</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 mr-4">
                        <Switch 
                            checked={form.is_active} 
                            onCheckedChange={(val) => setForm({ ...form, is_active: val })} 
                        />
                        <span className="text-sm font-medium">{form.is_active ? 'Live' : 'Draft'}</span>
                    </div>
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/services')}>Cancel</Button>
                    <Button type="submit" disabled={submitting} className="gap-2 glow">
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                        Create Service
                    </Button>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info */}
                    <div className="rounded-xl border border-border/50 bg-card p-6 space-y-6">
                        <h2 className="text-lg font-semibold">General Information</h2>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Service Title *</Label>
                                <Input 
                                    id="title"
                                    value={form.title} 
                                    onChange={(e) => {
                                        const title = e.target.value;
                                        setForm({ 
                                            ...form, 
                                            title, 
                                            slug: form.slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') 
                                        });
                                    }} 
                                    placeholder="e.g. Industrial Solar Solutions"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="slug">Slug (URL) *</Label>
                                <Input 
                                    id="slug"
                                    value={form.slug} 
                                    onChange={(e) => setForm({ ...form, slug: e.target.value })} 
                                    placeholder="industrial-solar"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="short_desc">Short Description</Label>
                                <Textarea 
                                    id="short_desc"
                                    value={form.short_desc} 
                                    onChange={(e) => setForm({ ...form, short_desc: e.target.value })} 
                                    placeholder="Brief summary for list views..."
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="long_desc">Long Description (Content)</Label>
                                <Textarea 
                                    id="long_desc"
                                    value={form.long_desc} 
                                    onChange={(e) => setForm({ ...form, long_desc: e.target.value })} 
                                    placeholder="Full details about this service..."
                                    rows={6}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Key Features</h2>
                            <Button type="button" variant="outline" size="sm" onClick={addFeature} className="gap-1">
                                <Plus className="h-4 w-4" /> Add Feature
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {form.features.map((feature, i) => (
                                <div key={i} className="flex gap-2">
                                    <Input 
                                        value={feature} 
                                        onChange={(e) => updateFeature(i, e.target.value)} 
                                        placeholder="e.g. 25-year performance warranty"
                                    />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(i)} className="text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            {form.features.length === 0 && (
                                <p className="text-xs text-muted-foreground text-center py-4 italic">No features added yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Process */}
                    <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Clock className="h-5 w-5 text-primary" />
                                Implementation Process
                            </h2>
                            <Button type="button" variant="outline" size="sm" onClick={addProcess} className="gap-1">
                                <Plus className="h-4 w-4" /> Add Step
                            </Button>
                        </div>
                        <div className="space-y-6">
                            {form.process.map((p, i) => (
                                <div key={i} className="relative rounded-lg border border-border/50 p-4 space-y-3 bg-muted/20">
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeProcess(i)} className="absolute top-2 right-2 text-destructive h-8 w-8">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <div className="grid grid-cols-6 gap-4">
                                        <div className="col-span-1">
                                            <Label className="text-[10px] uppercase">Step</Label>
                                            <Input value={p.step} onChange={(e) => updateProcess(i, 'step', e.target.value)} />
                                        </div>
                                        <div className="col-span-5">
                                            <Label className="text-[10px] uppercase">Title</Label>
                                            <Input value={p.title} onChange={(e) => updateProcess(i, 'title', e.target.value)} placeholder="Step title" />
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-[10px] uppercase">Description</Label>
                                        <Textarea value={p.desc} onChange={(e) => updateProcess(i, 'desc', e.target.value)} placeholder="What happens in this step?" rows={2} />
                                    </div>
                                </div>
                            ))}
                            {form.process.length === 0 && (
                                <p className="text-xs text-muted-foreground text-center py-4 italic">No process steps added yet.</p>
                            )}
                        </div>
                    </div>

                    {/* FAQs */}
                    <div className="rounded-xl border border-border/50 bg-card p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <HelpCircle className="h-5 w-5 text-primary" />
                                FAQ&apos;s
                            </h2>
                            <Button type="button" variant="outline" size="sm" onClick={addFaq} className="gap-1">
                                <Plus className="h-4 w-4" /> Add FAQ
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {form.faqs.map((faq, i) => (
                                <div key={i} className="relative rounded-xl border border-border p-5 space-y-4 bg-muted/20 group transition-all hover:bg-muted/30">
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => removeFaq(i)} 
                                        className="absolute top-2 right-2 text-destructive h-8 w-8 hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <div className="grid gap-4">
                                        <div className="grid gap-2">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Question</Label>
                                            <Input 
                                                value={faq.question} 
                                                onChange={(e) => updateFaq(i, 'question', e.target.value)} 
                                                placeholder="e.g. How long does installation take?" 
                                                className="h-10"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Answer</Label>
                                            <Textarea 
                                                value={faq.answer} 
                                                onChange={(e) => updateFaq(i, 'answer', e.target.value)} 
                                                placeholder="Detailed answer..." 
                                                rows={3} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {form.faqs.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-border/50">
                                    <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4" />
                                        Preview
                                    </h3>
                                    <Accordion type="single" collapsible className="w-full">
                                        {form.faqs.map((faq, i) => (
                                            <AccordionItem key={i} value={`faq-${i}`}>
                                                <AccordionTrigger className="text-sm font-medium text-left">
                                                    {faq.question || `Question ${i + 1}`}
                                                </AccordionTrigger>
                                                <AccordionContent className="text-sm text-muted-foreground">
                                                    {faq.answer || "No answer provided yet."}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </div>
                            )}

                            {form.faqs.length === 0 && (
                                <p className="text-xs text-muted-foreground text-center py-4 italic">No FAQs added for this service.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Media & Icon */}
                    <div className="rounded-xl border border-border/50 bg-card p-6 space-y-6">
                        <h2 className="text-lg font-semibold">Visuals</h2>
                        
                        {/* Icon Selection */}
                        <div className="space-y-3">
                            <Label>Service Icon</Label>
                            <div className="grid grid-cols-4 gap-2">
                                {iconOptions.map((opt) => (
                                    <button
                                        key={opt.name}
                                        type="button"
                                        onClick={() => setForm({ ...form, icon: opt.name })}
                                        className={`flex flex-col items-center justify-center rounded-lg border p-2 transition-all ${
                                            form.icon === opt.name 
                                            ? 'border-primary bg-primary/10 text-primary shadow-sm' 
                                            : 'border-border/50 hover:border-primary/30'
                                        }`}
                                    >
                                        <opt.icon className="h-5 w-5 mb-1" />
                                        <span className="text-[8px] uppercase font-bold">{opt.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-3">
                            <Label>Cover Image</Label>
                            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            {form.image_url ? (
                                <div className="relative aspect-video overflow-hidden rounded-lg border border-border/50">
                                    <img src={form.image_url} alt="Cover" className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                                        <Button type="button" size="sm" variant="secondary" onClick={() => fileRef.current?.click()}>
                                            Change Image
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => fileRef.current?.click()}
                                    className="flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors"
                                >
                                    {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
                                    <span className="mt-2 text-xs font-medium">Upload Image</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Benefits */}
                    <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Benefits</h2>
                            <Button type="button" variant="outline" size="sm" onClick={addBenefit} className="gap-1">
                                <Plus className="h-4 w-4" /> Add
                            </Button>
                        </div>
                        <div className="space-y-6">
                            {form.benefits.map((b, i) => (
                                <div key={i} className="rounded-lg border border-border/50 p-4 space-y-3 bg-muted/20 relative">
                                     <Button type="button" variant="ghost" size="icon" onClick={() => removeBenefit(i)} className="absolute top-2 right-2 text-destructive h-7 w-7">
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                    <div className="grid gap-3">
                                        <Input 
                                            value={b.title} 
                                            onChange={(e) => updateBenefit(i, 'title', e.target.value)} 
                                            placeholder="Benefit Title" 
                                            className="font-bold text-sm h-8"
                                        />
                                        <Textarea 
                                            value={b.desc} 
                                            onChange={(e) => updateBenefit(i, 'desc', e.target.value)} 
                                            placeholder="Description" 
                                            className="text-xs h-16"
                                        />
                                        <div className="flex items-center gap-2">
                                            <Label className="text-[10px] uppercase">Icon:</Label>
                                            <select 
                                                value={b.icon} 
                                                onChange={(e) => updateBenefit(i, 'icon', e.target.value)}
                                                className="flex-1 rounded-md border border-border/50 bg-background px-2 py-1 text-xs"
                                            >
                                                {iconOptions.map(opt => <option key={opt.name} value={opt.name}>{opt.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {form.benefits.length === 0 && (
                                <p className="text-xs text-muted-foreground text-center py-4 italic">No benefits added yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
