'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

interface Props {
    params: Promise<{ id: string }>;
}

export default function EditFAQPage({ params }: Props) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        question: '',
        answer: '',
        category: 'General',
        display_order: 0,
        is_active: true
    });

    useEffect(() => {
        const loadFAQ = async () => {
            try {
                const res = await fetch(`/api/faqs/${id}`);
                if (!res.ok) throw new Error();
                const data = await res.json();
                setForm(data);
            } catch (err) {
                toast.error('Failed to load FAQ');
                router.push('/admin/faqs');
            } finally {
                setLoading(false);
            }
        };
        loadFAQ();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch(`/api/faqs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                toast.success('FAQ updated successfully');
                router.push('/admin/faqs');
            } else {
                throw new Error();
            }
        } catch {
            toast.error('Failed to update FAQ');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );

    return (
        <div className="mx-auto max-w-2xl space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push('/admin/faqs')}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit FAQ</h1>
                    <p className="text-sm text-muted-foreground">Manage question and answer details</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="rounded-xl border border-border/50 bg-card p-8 space-y-6">
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="question">Question</Label>
                        <Input 
                            id="question"
                            value={form.question} 
                            onChange={(e) => setForm({ ...form, question: e.target.value })} 
                            placeholder="e.g. How much can I save with solar?"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="answer">Answer</Label>
                        <Textarea 
                            id="answer"
                            value={form.answer} 
                            onChange={(e) => setForm({ ...form, answer: e.target.value })} 
                            placeholder="Provide a clear, helpful answer..."
                            rows={5}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <select 
                                id="category"
                                value={form.category} 
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="General">General</option>
                                <option value="Technical">Technical</option>
                                <option value="Billing">Billing</option>
                                <option value="Process">Process</option>
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="display_order">Display Order</Label>
                            <Input 
                                id="display_order"
                                type="number" 
                                value={form.display_order} 
                                onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) })} 
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                        <Switch 
                            id="active"
                            checked={form.is_active} 
                            onCheckedChange={(val) => setForm({ ...form, is_active: val })} 
                        />
                        <Label htmlFor="active" className="cursor-pointer">Active / Visible on site</Label>
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={submitting} className="flex-1 gap-2">
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Changes
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.push('/admin/faqs')}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
