'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Upload, Image as ImageIcon, Pencil } from 'lucide-react';
import { LexicalEditor, type LexicalEditorRef } from '@/components/lexical/LexicalEditor';

interface Props {
    params: Promise<{ id: string }>;
}

export default function EditBlogPage({ params }: Props) {
    const { id } = use(params);
    const router = useRouter();
    const fileRef = useRef<HTMLInputElement>(null);
    const [form, setForm] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        is_published: true,
    });
    const [coverImage, setCoverImage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
    const headers: HeadersInit = { Authorization: `Bearer ${token}` };
    const editorRef = useRef<LexicalEditorRef>(null);

    useEffect(() => {
        fetch(`/api/blogs/${id}`, { headers })
            .then((r) => r.json())
            .then((blog) => {
                setForm({
                    title: blog.title || '',
                    slug: blog.slug || '',
                    excerpt: blog.excerpt || '',
                    content: blog.content || '',
                    is_published: blog.is_published ?? true,
                });
                setCoverImage(blog.cover_image || '');
                setLoading(false);
            })
            .catch(() => {
                toast.error('Failed to load blog');
                setLoading(false);
            });
    }, [id]);

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
        
        const editorContent = editorRef.current?.getContent() || form.content;
        
        setSubmitting(true);
        try {
            const res = await fetch(`/api/blogs/${id}`, {
                method: 'PUT',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, content: editorContent, cover_image: coverImage || null }),
            });
            if (res.ok) {
                toast.success('Blog updated!');
                router.push('/admin/blogs');
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to update');
            }
        } catch { toast.error('Something went wrong'); }
        finally { setSubmitting(false); }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            {/* Header bar */}
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
                        <Pencil className="h-6 w-6 text-primary" />
                        Edit Blog Post
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
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* Meta fields */}
            <div className="grid gap-4 rounded-xl border border-border/50 bg-card/50 p-5">
                <div className="grid gap-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                        id="title"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="text-lg font-medium"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                            id="slug"
                            value={form.slug}
                            onChange={(e) => setForm({ ...form, slug: e.target.value })}
                            className="font-mono text-sm"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <Textarea
                            id="excerpt"
                            rows={1}
                            value={form.excerpt}
                            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                        />
                    </div>
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
                            <img src={coverImage} alt="Cover" className="w-full max-h-52 object-cover" />
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
                            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/50 bg-muted/20 py-8 text-muted-foreground transition-colors hover:border-primary/30"
                        >
                            {uploading
                                ? <Loader2 className="mb-2 h-8 w-8 animate-spin text-primary" />
                                : <ImageIcon className="mb-2 h-8 w-8" />
                            }
                            <span className="text-sm font-medium">{uploading ? 'Uploading…' : 'Click to upload cover image'}</span>
                        </button>
                    )}
                </div>
            </div>

            {/* ── Lexical Editor lives OUTSIDE the form to prevent submit-on-drag ── */}
            <div className="grid gap-2">
                <Label className="text-sm font-medium">Content *</Label>
                <LexicalEditor
                    ref={editorRef}
                    initialContent={form.content}
                    placeholder="Write your blog post content..."
                />
            </div>
        </div>
    );
}
