'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table, TableHead, TableHeader, TableRow, TableBody, TableCell,
} from '@/components/ui/table';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Eye, Trash2, Loader2, MessageSquare, Mail, Phone, Calendar } from 'lucide-react';

interface Inquiry {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    message: string;
    is_read: boolean;
    created_at: string;
}

export default function InquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewInquiry, setViewInquiry] = useState<Inquiry | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
    const headers: HeadersInit = { Authorization: `Bearer ${token}` };

    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/inquiries', { headers });
            if (res.ok) setInquiries(await res.json());
        } catch {
            toast.error('Failed to load inquiries');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchInquiries(); }, []);

    const handleMarkRead = async (inquiry: Inquiry) => {
        try {
            await fetch(`/api/inquiries/${inquiry.id}`, { method: 'PUT', headers });
            toast.success('Marked as read');
            fetchInquiries();
        } catch {
            toast.error('Failed to update');
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setSubmitting(true);
        try {
            await fetch(`/api/inquiries/${deleteTarget.id}`, { method: 'DELETE', headers });
            toast.success('Inquiry deleted');
            setDeleteTarget(null);
            fetchInquiries();
        } catch {
            toast.error('Failed to delete');
        } finally {
            setSubmitting(false);
        }
    };

    const openView = (inquiry: Inquiry) => {
        setViewInquiry(inquiry);
        if (!inquiry.is_read) handleMarkRead(inquiry);
    };

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Inquiries</h1>
                    <p className="text-sm text-muted-foreground">Manage contact form submissions.</p>
                </div>
                <Badge variant="outline" className="gap-1.5 px-3 py-1 text-sm">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {inquiries.length} total
                </Badge>
            </div>

            <div className="overflow-hidden rounded-xl border border-border/50 bg-card/50">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead className="font-semibold">Name</TableHead>
                            <TableHead className="font-semibold">Email</TableHead>
                            <TableHead className="font-semibold hidden sm:table-cell">Phone</TableHead>
                            <TableHead className="font-semibold hidden md:table-cell">Date</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="font-semibold text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <TableRow key={i}>
                                    {Array.from({ length: 6 }).map((_, j) => (
                                        <TableCell key={j}>
                                            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : inquiries.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                    No inquiries yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            inquiries.map((inq) => (
                                <TableRow
                                    key={inq.id}
                                    className={`group transition-colors hover:bg-muted/20 ${!inq.is_read ? 'bg-primary/[0.03]' : ''}`}
                                >
                                    <TableCell className="font-medium">{inq.name}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">{inq.email}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm hidden sm:table-cell">{inq.phone || '—'}</TableCell>
                                    <TableCell className="text-muted-foreground text-xs hidden md:table-cell">
                                        {new Date(inq.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={inq.is_read ? 'secondary' : 'default'} className="text-xs">
                                            {inq.is_read ? 'Read' : 'New'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openView(inq)}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                onClick={() => setDeleteTarget(inq)}
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

            {/* View Inquiry Dialog */}
            <Dialog open={!!viewInquiry} onOpenChange={(open) => !open && setViewInquiry(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Inquiry from {viewInquiry?.name}</DialogTitle>
                        <DialogDescription>
                            Inquiry details and contact information
                        </DialogDescription>
                    </DialogHeader>
                    {viewInquiry && (
                        <div className="space-y-4 py-2">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="h-4 w-4 text-primary shrink-0" />
                                <a href={`mailto:${viewInquiry.email}`} className="text-primary hover:underline">{viewInquiry.email}</a>
                            </div>
                            {viewInquiry.phone && (
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone className="h-4 w-4 text-primary shrink-0" />
                                    {viewInquiry.phone}
                                </div>
                            )}
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <Calendar className="h-4 w-4 shrink-0" />
                                {new Date(viewInquiry.created_at).toLocaleString()}
                            </div>
                            <div className="rounded-lg border border-border/50 bg-muted/30 p-4 text-sm leading-relaxed">
                                {viewInquiry.message}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-destructive">Delete Inquiry</DialogTitle>
                        <DialogDescription>
                            Delete inquiry from <strong>{deleteTarget?.name}</strong>? This cannot be undone.
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
