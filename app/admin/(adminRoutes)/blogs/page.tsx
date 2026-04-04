'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table, TableHead, TableHeader, TableRow, TableBody, TableCell,
} from '@/components/ui/table';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, FileText, Calendar, Eye, EyeOff } from 'lucide-react';

interface Blog {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    cover_image: string | null;
    is_published: boolean;
    created_at: string;
}

export default function BlogsPage() {
    const router = useRouter();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
    const headers: HeadersInit = { Authorization: `Bearer ${token}` };

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/blogs', { headers });
            if (res.ok) setBlogs(await res.json());
        } catch {
            toast.error('Failed to load blogs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBlogs(); }, []);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setSubmitting(true);
        try {
            await fetch(`/api/blogs/${deleteTarget.id}`, { method: 'DELETE', headers });
            toast.success('Blog deleted');
            setDeleteTarget(null);
            fetchBlogs();
        } catch {
            toast.error('Failed to delete');
        } finally {
            setSubmitting(false);
        }
    };

    const togglePublish = async (blog: Blog) => {
        try {
            await fetch(`/api/blogs/${blog.id}`, {
                method: 'PUT',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_published: !blog.is_published }),
            });
            toast.success(blog.is_published ? 'Unpublished' : 'Published');
            fetchBlogs();
        } catch {
            toast.error('Failed to update');
        }
    };

    return (
        <>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Blog Posts</h1>
                    <p className="text-sm text-muted-foreground">Create and manage blog content.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="gap-1.5 px-3 py-1 text-sm">
                        <FileText className="h-3.5 w-3.5" />
                        {blogs.length} posts
                    </Badge>
                    <Button className="gap-2 glow" onClick={() => router.push('/admin/blogs/new')}>
                        <Plus className="h-4 w-4" />
                        New Post
                    </Button>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-border/50 bg-card/50">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead className="font-semibold">Title</TableHead>
                            <TableHead className="font-semibold hidden sm:table-cell">Slug</TableHead>
                            <TableHead className="font-semibold hidden md:table-cell">Date</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="font-semibold text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <TableRow key={i}>
                                    {Array.from({ length: 5 }).map((_, j) => (
                                        <TableCell key={j}>
                                            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : blogs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                    No blog posts yet. Create your first post!
                                </TableCell>
                            </TableRow>
                        ) : (
                            blogs.map((blog) => (
                                <TableRow key={blog.id} className="group transition-colors hover:bg-muted/20">
                                    <TableCell className="font-medium max-w-[200px] truncate">{blog.title}</TableCell>
                                    <TableCell className="text-muted-foreground text-xs font-mono hidden sm:table-cell max-w-[150px] truncate">
                                        /{blog.slug}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-xs hidden md:table-cell">
                                        {new Date(blog.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={blog.is_published ? 'default' : 'secondary'}
                                            className="cursor-pointer text-xs"
                                            onClick={() => togglePublish(blog)}
                                        >
                                            {blog.is_published ? (
                                                <><Eye className="mr-1 h-3 w-3" /> Published</>
                                            ) : (
                                                <><EyeOff className="mr-1 h-3 w-3" /> Draft</>
                                            )}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => router.push(`/admin/blogs/${blog.id}/edit`)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                onClick={() => setDeleteTarget(blog)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Delete Confirmation */}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-destructive">Delete Blog Post</DialogTitle>
                        <DialogDescription>
                            Delete &ldquo;{deleteTarget?.title}&rdquo;? This cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={submitting} className="gap-2">
                            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
