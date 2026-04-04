'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Upload, Image as ImageIcon, FileText } from 'lucide-react';
import { CraftEditor } from '@/components/craft/editor/CraftEditor';

export default function NewBlogPage() {
    const router = useRouter();
    const fileRef = useRef<HTMLInputElement>(null);
    const [form, setForm] = useState({
        title: '',
        excerpt: '',
        content: '',
        is_published: true,
    });
    const [coverImage, setCoverImage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (res.ok) { setCoverImage(data.url); toast.success('Image uploaded'); }
            else toast.error(data.error || 'Upload failed');
        } catch { toast.error('Upload failed'); }
        finally { setUploading(false); }
    };

    const handleSubmit = async () => {
        if (!form.title || !form.content) {
            toast.error('Title and content are required');
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch('/api/blogs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...form, cover_image: coverImage || null }),
            });
            if (res.ok) {
                toast.success('Blog post created!');
                router.push('/admin/blogs');
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to create post');
            }
        } catch { toast.error('Something went wrong'); }
        finally { setSubmitting(false); }
    };

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-muted-foreground"
                        onClick={() => router.push('/admin/blogs')}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <FileText className="h-6 w-6 text-primary" />
                        New Blog Post
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Switch
                            id="published"
                            checked={form.is_published}
                            onCheckedChange={(checked) => setForm({ ...form, is_published: checked })}
                        />
                        <Label htmlFor="published" className="cursor-pointer text-sm">
                            {form.is_published ? 'Published' : 'Draft'}
                        </Label>
                    </div>
                    <Button variant="outline" onClick={() => router.push('/admin/blogs')}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} className="gap-2 glow" disabled={submitting}>
                        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                        Publish Post
                    </Button>
                </div>
            </div>

            {/* Meta fields */}
            <div className="grid gap-4 rounded-xl border border-border/50 bg-card/50 p-5">
                <div className="grid gap-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                        id="title"
                        placeholder="Enter post title…"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="text-lg font-medium"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                        id="excerpt"
                        placeholder="A short summary of the post…"
                        rows={2}
                        value={form.excerpt}
                        onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    />
                </div>

                {/* Cover Image */}
                <div className="grid gap-2">
                    <Label>Cover Image</Label>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                    />
                    {coverImage ? (
                        <div className="relative overflow-hidden rounded-xl border border-border/50">
                            <img src={coverImage} alt="Cover" className="w-full max-h-60 object-cover" />
                            <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                className="absolute bottom-3 right-3 gap-2"
                                onClick={() => fileRef.current?.click()}
                            >
                                <Upload className="h-3.5 w-3.5" /> Change
                            </Button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/50 bg-muted/20 py-10 text-muted-foreground transition-colors hover:border-primary/30 hover:bg-muted/30"
                        >
                            {uploading
                                ? <Loader2 className="mb-2 h-8 w-8 animate-spin text-primary" />
                                : <ImageIcon className="mb-2 h-8 w-8" />
                            }
                            <span className="text-sm font-medium">{uploading ? 'Uploading…' : 'Click to upload cover image'}</span>
                            <span className="mt-1 text-xs">PNG, JPG, WebP up to 5MB</span>
                        </button>
                    )}
                </div>
            </div>

            {/* ── CraftJS Editor lives OUTSIDE the form to prevent submit-on-drag ── */}
            <div className="grid gap-2">
                <Label className="text-sm font-medium">Content *</Label>
                <CraftEditor
                    onNodesChange={(json: string) => setForm(prev => ({ ...prev, content: json }))}
                />
            </div>
        </div>
    );
}
