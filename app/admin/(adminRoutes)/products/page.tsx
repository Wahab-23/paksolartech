'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/products')
            .then(r => r.json())
            .then(data => { setProducts(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const deleteProduct = async (id: number) => {
        if (!confirm('Delete this product permanently?')) return;
        try {
            await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
            setProducts(products.filter(p => p.id !== id));
        } catch {
            alert("Error deleting product");
        }
    }

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Products</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Full product catalog with pricing, categories, and SEO metadata.</p>
                </div>
                <Link href="/admin/products/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> Add Product
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-14 rounded-xl border border-border/50 bg-card/50 animate-pulse" />
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="rounded-xl border border-border/50 bg-card/50 p-12 text-center">
                    <p className="text-muted-foreground">No products in the registry yet. Add the first one!</p>
                </div>
            ) : (
                <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="border-b border-border/50 bg-muted/30">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Brand</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Base Price</th>
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-4 py-3 font-medium">
                                        {product.name}
                                        {product.is_featured ? <span className="ml-2 text-[10px] bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded-sm">Featured</span> : null}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{product.brand || '-'}</td>
                                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{product.price_from ? `Rs. ${product.price_from}` : '-'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${product.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-muted text-muted-foreground'}`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right space-x-2">
                                         <Link href={`/admin/products/${product.id}/edit`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Pencil className="h-4 w-4" /></Button>
                                         </Link>
                                         <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500/70 hover:text-red-500 hover:bg-red-500/10" onClick={() => deleteProduct(product.id)}><Trash2 className="h-4 w-4" /></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}
