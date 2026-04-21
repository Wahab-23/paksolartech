import { Metadata } from 'next';
import { getAllFAQs } from '@/app/models/faq.model';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Manage FAQs — Admin',
};

export default async function AdminFAQsPage() {
    const faqs = await getAllFAQs();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">FAQs</h1>
                    <p className="text-muted-foreground">
                        Manage frequently asked questions displayed on the homepage.
                    </p>
                </div>
                <Link href="/admin/faqs/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add FAQ
                    </Button>
                </Link>
            </div>

            <div className="rounded-xl border border-border bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-border bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Question</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider text-center">Order</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {faqs.map((faq) => (
                                <tr key={faq.id} className="transition-colors hover:bg-muted/30">
                                    <td className="px-6 py-4 font-medium">{faq.question}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline">{faq.category || 'Uncategorized'}</Badge>
                                    </td>
                                    <td className="px-6 py-4 text-center">{faq.display_order}</td>
                                    <td className="px-6 py-4 text-center">
                                        {faq.is_active ? (
                                            <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-none">Active</Badge>
                                        ) : (
                                            <Badge variant="secondary">Inactive</Badge>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/faqs/${faq.id}/edit`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {faqs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        No FAQs found. Add your first one to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
