'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Upload, Image as ImageIcon, Pencil, Save, FileText, User, Tag, Calendar, Clock, Star, Plus, Trash2, HelpCircle, MessageSquare } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import BlockNoteEditor, { type BlockNoteEditorRef } from '@/components/blocknote/blocknoteEditor';

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
        author: '',
        is_published: true,
        is_featured: false,
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        reading_time: 0,
        published_at: '',
        tags: [] as string[],
        faqs: [] as { question: string; answer: string }[],
    });
    const [tagInput, setTagInput] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
    const headers: HeadersInit = { Authorization: `Bearer ${token}` };
    const editorRef = useRef<BlockNoteEditorRef>(null);

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const handleTitleChange = (title: string) => {
        setForm({ ...form, title, slug: form.slug || generateSlug(title) });
    };

    const addTag = () => {
        if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
            setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setForm({ ...form, tags: form.tags.filter(tag => tag !== tagToRemove) });
    };

    const estimateReadingTime = (content: string) => {
        const wordsPerMinute = 200;
        const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    };

    const addFaq = () => setForm({ ...form, faqs: [...form.faqs, { question: '', answer: '' }] });
    const removeFaq = (idx: number) => setForm({ ...form, faqs: form.faqs.filter((_, i) => i !== idx) });
    const updateFaq = (idx: number, field: string, val: string) => {
        const newFaqs = [...form.faqs] as any;
        newFaqs[idx][field] = val;
        setForm({ ...form, faqs: newFaqs });
    };

    useEffect(() => {
        fetch(`/api/blogs/${id}`, { headers })
            .then((r) => r.json())
            .then((blog) => {
                setForm({
                    title: blog.title || '',
                    slug: blog.slug || '',
                    excerpt: blog.excerpt || '',
                    content: blog.content || '',
                    author: blog.author || '',
                    is_published: blog.is_published ?? true,
                    is_featured: blog.is_featured ?? false,
                    meta_title: blog.meta_title || '',
                    meta_description: blog.meta_description || '',
                    meta_keywords: blog.meta_keywords || '',
                    reading_time: blog.reading_time || 0,
                    published_at: blog.published_at ? new Date(blog.published_at).toISOString().slice(0, 16) : '',
                    tags: blog.tags ? (typeof blog.tags === 'string' ? JSON.parse(blog.tags) : blog.tags) : [],
                    faqs: blog.faqs ? (typeof blog.faqs === 'string' ? JSON.parse(blog.faqs) : blog.faqs) : [],
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
        const editorContent = await editorRef.current?.getContent() || form.content;
        
        if (!form.title || !editorContent) {
            toast.error('Title and content are required');
            return;
        }
        
        const readingTime = estimateReadingTime(editorContent);
        
        setSubmitting(true);
        try {
            const res = await fetch(`/api/blogs/${id}`, {
                method: 'PUT',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    content: editorContent,
                    cover_image: coverImage || null,
                    reading_time: readingTime,
                    tags: JSON.stringify(form.tags),
                    published_at: form.published_at || new Date().toISOString(),
                }),
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
        <div className="mx-auto max-w-5xl space-y-8 pb-20">
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
                    <div className="flex items-center gap-2">
                        <Switch
                            id="featured"
                            checked={form.is_featured}
                            onCheckedChange={(checked) => setForm({ ...form, is_featured: checked })}
                        />
                        <Label htmlFor="featured" className="cursor-pointer text-sm flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            Featured
                        </Label>
                    </div>
                    <Button variant="outline" onClick={() => router.push('/admin/blogs')}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} className="gap-2 glow" disabled={submitting}>
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column — Main Content */}
                <div className="md:col-span-2 space-y-8">
                    {/* Basic Info */}
                    <div className="rounded-xl border border-border/50 bg-card/50 p-6 space-y-6">
                        <h2 className="font-semibold text-lg flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            Basic Information
                        </h2>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label>Post Title *</Label>
                                <Input
                                    value={form.title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    placeholder="Enter an engaging blog post title..."
                                    className="text-lg font-medium"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>URL Slug</Label>
                                <Input
                                    value={form.slug}
                                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                    placeholder="url-friendly-slug"
                                    className="font-mono text-sm"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Excerpt</Label>
                                <Textarea
                                    value={form.excerpt}
                                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                                    placeholder="A compelling summary that appears in previews..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SEO Metadata */}
                    <div className="rounded-xl border border-border/50 bg-card/50 p-6 space-y-4">
                        <h2 className="font-semibold text-lg">SEO & Meta</h2>
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Meta Title</Label>
                                <Input
                                    value={form.meta_title}
                                    onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                                    placeholder="Custom title for search engines..."
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Meta Description</Label>
                                <Textarea
                                    value={form.meta_description}
                                    onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                                    placeholder="Description for search engine snippets..."
                                    rows={3}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Meta Keywords</Label>
                                <Input
                                    value={form.meta_keywords}
                                    onChange={(e) => setForm({ ...form, meta_keywords: e.target.value })}
                                    placeholder="keyword1, keyword2, keyword3"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div className="rounded-xl border border-border/50 bg-card/50 p-6 space-y-4">
                        <h2 className="font-semibold text-lg">Cover Image</h2>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                        {coverImage ? (
                            <div className="relative overflow-hidden rounded-xl border border-border/50">
                                <img src={coverImage} alt="Cover" className="w-full max-h-48 object-cover" />
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
                                className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/50 bg-muted/20 py-8 text-muted-foreground transition-colors hover:border-primary/30 hover:bg-muted/30"
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

                    {/* Rich Content Editor */}
                    <div className="rounded-xl border border-border/50 bg-card/50 p-6 space-y-4">
                        <h2 className="font-semibold text-lg">Content</h2>
                        <div className="rounded-lg border border-border/50 bg-background/50 overflow-hidden text-foreground">
                            <BlockNoteEditor
                                ref={editorRef}
                                initialContent={form.content}
                                placeholder="Start writing your blog post content..."
                            />
                        </div>
                    </div>

                    {/* FAQs */}
                    <div className="rounded-xl border border-border/50 bg-card/50 p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-lg flex items-center gap-2">
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
                                                placeholder="e.g. What is the benefit of solar energy?" 
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
                                <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border-2 border-dashed border-border/50">
                                    <HelpCircle className="h-10 w-10 text-muted-foreground/30 mb-2" />
                                    <p className="text-sm text-muted-foreground font-medium text-center">No FAQs added for this blog post.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column — Settings & Meta */}
                <div className="space-y-8">

                    {/* Author & Tags */}
                    <div className="rounded-xl border border-border/50 bg-card/50 p-6 space-y-4">
                        <h2 className="font-semibold text-lg flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            Author & Tags
                        </h2>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label>Author</Label>
                                <Input
                                    value={form.author}
                                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                                    placeholder="Post author name"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Tags</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                        placeholder="Add a tag..."
                                        className="flex-1"
                                    />
                                    <Button type="button" onClick={addTag} size="sm">
                                        <Tag className="h-4 w-4" />
                                    </Button>
                                </div>
                                {form.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {form.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(tag)}
                                                    className="ml-1 hover:text-destructive"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Publishing Options */}
                    <div className="rounded-xl border border-border/50 bg-card/50 p-6 space-y-4">
                        <h2 className="font-semibold text-lg flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            Publishing
                        </h2>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label>Publish Date</Label>
                                <Input
                                    type="datetime-local"
                                    value={form.published_at}
                                    onChange={(e) => setForm({ ...form, published_at: e.target.value })}
                                    placeholder="Leave empty for immediate publish"
                                />
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    Estimated reading time: {estimateReadingTime(form.content || '')} min
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
