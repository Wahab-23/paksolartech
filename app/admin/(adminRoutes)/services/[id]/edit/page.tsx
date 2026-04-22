'use client';

import { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
    ArrowLeft, Loader2, Save, Sun, Zap, Battery, Wrench, 
    BarChart3, Shield, Plus, Trash2, Image as ImageIcon, Upload,
    CheckCircle2, Info, Headphones, Globe2, Heart, TrendingUp, Clock, Settings,
    Layout, Sparkles, Target, Layers, HelpCircle, MessageSquare
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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

interface Props {
    params: Promise<{ id: string }>;
}

export default function EditServicePage({ params }: Props) {
    const { id } = use(params);
    const router = useRouter();
    const fileRef = useRef<HTMLInputElement>(null);
    
    const [loading, setLoading] = useState(true);
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
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        faqs: [] as { question: string; answer: string }[]
    });


    useEffect(() => {
        const loadService = async () => {
            try {
                const res = await fetch(`/api/services/${id}`);
                if (!res.ok) throw new Error();
                const data = await res.json();
                setForm(data);
            } catch (err) {
                toast.error('Failed to load service');
                router.push('/admin/services');
            } finally {
                setLoading(false);
            }
        };
        loadService();
    }, [id, router]);

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
        setSubmitting(true);
        try {
            const res = await fetch(`/api/services/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                toast.success('Service updated successfully');
                router.push('/admin/services');
            } else {
                throw new Error();
            }
        } catch {
            toast.error('Failed to update service');
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

    if (loading) return (
        <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="mx-auto max-w-6xl space-y-8 pb-20 fade-in">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 z-30 bg-background/95 backdrop-blur-md px-6 py-4 border-b border-border transition-all duration-300">
                <div className="flex items-center gap-6">
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => router.push('/admin/services')}
                        className="rounded-full"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight">Edit Service</h1>
                            <Badge variant="outline" className="bg-muted text-foreground border-border">Admin</Badge>
                        </div>
                        <p className="text-xs font-medium text-muted-foreground">
                            {form.title || 'Untitled Service'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-muted/50 px-3 py-1.5 rounded-full border border-border">
                        <Switch 
                            checked={form.is_active} 
                            onCheckedChange={(val) => setForm({ ...form, is_active: val })} 
                        />
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                            {form.is_active ? 'Live' : 'Draft'}
                        </span>
                    </div>
                    <Separator orientation="vertical" className="h-8 mx-2" />
                    <div className="flex items-center gap-3">
                        <Button type="button" variant="ghost" onClick={() => router.push('/admin/services')} className="font-semibold px-6">Cancel</Button>
                        <Button type="submit" disabled={submitting} className="gap-2 px-8 font-bold">
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            Save Changes
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3 px-6">
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                                    <Info className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle>General Information</CardTitle>
                                    <CardDescription>Basic details about your service</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Service Title</Label>
                                    <Input 
                                        id="title"
                                        value={form.title} 
                                        onChange={(e) => setForm({ ...form, title: e.target.value })} 
                                        placeholder="Residential Solar Solutions"
                                        className="h-11 bg-muted/20 border-border/50 focus:bg-background transition-all"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="slug" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Slug (URL)</Label>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <Input 
                                                id="slug"
                                                value={form.slug} 
                                                onChange={(e) => setForm({ ...form, slug: e.target.value })} 
                                                placeholder="residential-solar"
                                                className="h-11 bg-muted/20 border-border/50 focus:bg-background transition-all font-mono text-sm"
                                            />
                                        </div>
                                        <Badge variant="secondary" className="h-11 px-4 font-mono text-xs text-muted-foreground border-border/50">/services/</Badge>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="short_desc" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Short Description</Label>
                                    <Textarea 
                                        id="short_desc"
                                        value={form.short_desc} 
                                        onChange={(e) => setForm({ ...form, short_desc: e.target.value })} 
                                        placeholder="Brief summary for list views..."
                                        className="bg-muted/20 border-border/50 focus:bg-background transition-all min-h-[100px]"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="long_desc" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Long Description (Content)</Label>
                                    <Textarea 
                                        id="long_desc"
                                        value={form.long_desc} 
                                        onChange={(e) => setForm({ ...form, long_desc: e.target.value })} 
                                        placeholder="Full details about this service..."
                                        rows={10}
                                        className="bg-muted/20 border-border/50 focus:bg-background transition-all"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* SEO Metadata */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                                    <Globe2 className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle>SEO & Meta</CardTitle>
                                    <CardDescription>Search engine optimization settings</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="meta_title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Meta Title</Label>
                                    <Input 
                                        id="meta_title"
                                        value={form.meta_title} 
                                        onChange={(e) => setForm({ ...form, meta_title: e.target.value })} 
                                        placeholder="Custom title for search engines..."
                                        className="h-11 bg-muted/20 border-border/50 focus:bg-background transition-all"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="meta_description" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Meta Description</Label>
                                    <Textarea 
                                        id="meta_description"
                                        value={form.meta_description} 
                                        onChange={(e) => setForm({ ...form, meta_description: e.target.value })} 
                                        placeholder="Description for search engine snippets..."
                                        className="bg-muted/20 border-border/50 focus:bg-background transition-all min-h-[100px]"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="meta_keywords" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Meta Keywords</Label>
                                    <Input 
                                        id="meta_keywords"
                                        value={form.meta_keywords} 
                                        onChange={(e) => setForm({ ...form, meta_keywords: e.target.value })} 
                                        placeholder="keyword1, keyword2, keyword3"
                                        className="h-11 bg-muted/20 border-border/50 focus:bg-background transition-all"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>


                    {/* Features */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                                        <Zap className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle>Key Features</CardTitle>
                                        <CardDescription>Core capabilities and offerings</CardDescription>
                                    </div>
                                </div>
                                <Button type="button" variant="outline" size="sm" onClick={addFeature} className="gap-1">
                                    <Plus className="h-4 w-4" /> Add Feature
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-3">
                                {form.features.map((feature, i) => (
                                    <div key={i} className="flex gap-3 items-center">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted font-mono text-xs font-bold">
                                            {i + 1}
                                        </div>
                                        <Input 
                                            value={feature} 
                                            onChange={(e) => updateFeature(i, e.target.value)} 
                                            placeholder="e.g. 25-year performance warranty"
                                            className="h-10"
                                        />
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => removeFeature(i)} 
                                            className="text-destructive hover:bg-destructive/10 shrink-0"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {form.features.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-8 px-4 rounded-xl border-2 border-dashed border-border">
                                        <Layers className="h-10 w-10 text-muted-foreground/30 mb-2" />
                                        <p className="text-sm text-muted-foreground font-medium text-center">No features added yet.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Process */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                                        <Target className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle>Implementation Process</CardTitle>
                                        <CardDescription>Step-by-step delivery workflow</CardDescription>
                                    </div>
                                </div>
                                <Button type="button" variant="outline" size="sm" onClick={addProcess} className="gap-1">
                                    <Plus className="h-4 w-4" /> Add Step
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-8 relative before:absolute before:left-7 before:top-2 before:bottom-2 before:w-px before:bg-border">
                                {form.process.map((p, i) => (
                                    <div key={i} className="relative pl-14">
                                        <div className="absolute left-0 top-0 flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-background bg-muted font-bold text-foreground shadow-sm z-10">
                                            {p.step}
                                        </div>
                                        <div className="relative rounded-xl border border-border p-5 space-y-4 bg-muted/20 group/step transition-all hover:bg-muted/30">
                                            <Button 
                                                type="button" 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => removeProcess(i)} 
                                                className="absolute top-2 right-2 text-destructive h-8 w-8 hover:bg-destructive/10 opacity-0 group-hover/step:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <div className="grid gap-4">
                                                <div className="grid grid-cols-6 gap-4">
                                                    <div className="col-span-1">
                                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">ID</Label>
                                                        <Input value={p.step} onChange={(e) => updateProcess(i, 'step', e.target.value)} className="h-9 bg-background" />
                                                    </div>
                                                    <div className="col-span-5">
                                                        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Title</Label>
                                                        <Input value={p.title} onChange={(e) => updateProcess(i, 'title', e.target.value)} placeholder="Step title" className="h-9 bg-background" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Description</Label>
                                                    <Textarea value={p.desc} onChange={(e) => updateProcess(i, 'desc', e.target.value)} placeholder="What happens in this step?" rows={2} className="bg-background min-h-[80px]" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* FAQs */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                                        <HelpCircle className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle>FAQ&apos;s</CardTitle>
                                        <CardDescription>Manage frequently asked questions for this service</CardDescription>
                                    </div>
                                </div>
                                <Button type="button" variant="outline" size="sm" onClick={addFaq} className="gap-1">
                                    <Plus className="h-4 w-4" /> Add FAQ
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                {form.faqs.map((faq, i) => (
                                    <div key={i} className="relative rounded-xl border border-border p-5 space-y-4 bg-muted/20 group/faq transition-all hover:bg-muted/30">
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => removeFaq(i)} 
                                            className="absolute top-2 right-2 text-destructive h-8 w-8 hover:bg-destructive/10 opacity-0 group-faq:opacity-100 transition-opacity"
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
                                                    className="h-10 bg-background"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Answer</Label>
                                                <Textarea 
                                                    value={faq.answer} 
                                                    onChange={(e) => updateFaq(i, 'answer', e.target.value)} 
                                                    placeholder="Detailed answer..." 
                                                    rows={3} 
                                                    className="bg-background"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {form.faqs.length > 0 && (
                                    <div className="mt-8 pt-6 border-t border-border">
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
                                    <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border-2 border-dashed border-border">
                                        <HelpCircle className="h-10 w-10 text-muted-foreground/30 mb-2" />
                                        <p className="text-sm text-muted-foreground font-medium text-center">No FAQs added for this service.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    {/* Media & Icon */}
                    <Card className="border-border/50 shadow-sm animate-slide-up [animation-delay:200ms] group overflow-hidden">
                        <CardHeader className="pb-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                                <ImageIcon className="h-24 w-24" />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <ImageIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle>Visuals</CardTitle>
                                    <CardDescription>Icon and cover image</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            {/* Icon Selection */}
                            <div className="space-y-4">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Service Icon</Label>
                                <div className="grid grid-cols-4 gap-2">
                                    {iconOptions.map((opt) => (
                                        <button
                                            key={opt.name}
                                            type="button"
                                            onClick={() => setForm({ ...form, icon: opt.name })}
                                            className={`flex flex-col items-center justify-center rounded-xl border p-3 transition-all duration-300 ${
                                                form.icon === opt.name 
                                                ? 'border-primary bg-primary/10 text-primary shadow-sm scale-105' 
                                                : 'border-border/50 hover:border-primary/30 hover:bg-muted/30'
                                            }`}
                                        >
                                            <opt.icon className={`h-6 w-6 mb-2 transition-transform duration-300 ${form.icon === opt.name ? 'scale-110' : ''}`} />
                                            <span className="text-[10px] uppercase font-bold tracking-tight">{opt.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Separator className="bg-border/50" />

                            {/* Image Upload */}
                            <div className="space-y-4">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cover Image</Label>
                                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                {form.image_url ? (
                                    <div className="group/img relative aspect-[16/10] overflow-hidden rounded-xl border border-border/50 shadow-inner">
                                        <img src={form.image_url} alt="Cover" className="h-full w-full object-cover transition-transform duration-500 group-hover/img:scale-110" />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover/img:opacity-100 backdrop-blur-[2px]">
                                            <Button type="button" size="sm" variant="secondary" onClick={() => fileRef.current?.click()} className="gap-2 font-bold ring-2 ring-white/20">
                                                <Upload className="h-4 w-4" /> Change Image
                                            </Button>
                                            <p className="mt-2 text-[10px] font-medium text-white/70">JPG, PNG or WEBP (Max 2MB)</p>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => fileRef.current?.click()}
                                        className="flex h-48 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/50 bg-muted/20 hover:bg-muted/30 hover:border-primary/30 transition-all group/upload"
                                    >
                                        <div className="p-4 rounded-full bg-background/50 group-hover/upload:scale-110 transition-transform">
                                            {uploading ? <Loader2 className="h-8 w-8 animate-spin text-primary" /> : <Upload className="h-8 w-8 text-primary" />}
                                        </div>
                                        <span className="mt-4 text-sm font-bold">Upload Cover Image</span>
                                        <span className="mt-1 text-xs text-muted-foreground px-8 text-center">High quality images work best for service pages</span>
                                    </button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Benefits */}
                    <Card className="border-border/50 shadow-sm animate-slide-up [animation-delay:250ms] group overflow-hidden">
                        <CardHeader className="pb-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                                <Heart className="h-24 w-24" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <Heart className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle>Benefits</CardTitle>
                                        <CardDescription>Value proposition for customers</CardDescription>
                                    </div>
                                </div>
                                <Button type="button" variant="outline" size="sm" onClick={addBenefit} className="gap-1 border-primary/20 hover:bg-primary/5 text-primary">
                                    <Plus className="h-4 w-4" /> Add
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4">
                                {form.benefits.map((b, i) => (
                                    <div key={i} className="rounded-xl border border-border/50 p-5 space-y-4 bg-muted/20 relative group/benefit transition-all hover:bg-muted/30 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                                         <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={() => removeBenefit(i)} 
                                            className="absolute top-2 right-2 text-destructive h-8 w-8 hover:bg-destructive/10 opacity-0 group-hover/benefit:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <div className="grid gap-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Benefit Title</Label>
                                                <Input 
                                                    value={b.title} 
                                                    onChange={(e) => updateBenefit(i, 'title', e.target.value)} 
                                                    placeholder="Benefit Title" 
                                                    className="font-bold text-sm h-9 bg-background/50 border-border/50"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Description</Label>
                                                <Textarea 
                                                    value={b.desc} 
                                                    onChange={(e) => updateBenefit(i, 'desc', e.target.value)} 
                                                    placeholder="Description" 
                                                    className="text-xs h-20 bg-background/50 border-border/50 resize-none"
                                                />
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground shrink-0">Icon:</Label>
                                                <select 
                                                    value={b.icon} 
                                                    onChange={(e) => updateBenefit(i, 'icon', e.target.value)}
                                                    className="flex-1 rounded-md border border-border/50 bg-background/50 px-3 py-1 text-xs font-medium h-8 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                >
                                                    {iconOptions.map(opt => <option key={opt.name} value={opt.name}>{opt.name}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {form.benefits.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-8 px-4 rounded-xl border-2 border-dashed border-border/50 bg-muted/10">
                                        <Heart className="h-10 w-10 text-muted-foreground/30 mb-2" />
                                        <p className="text-sm text-muted-foreground font-medium text-center">No benefits listed. Show the value of your service!</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
