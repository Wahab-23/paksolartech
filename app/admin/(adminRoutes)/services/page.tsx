import { Metadata } from 'next';
import { getAllServices } from '@/app/models/service.model';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Edit, ExternalLink, Sun, Zap, Battery, Wrench, BarChart3, Shield, Trash2 } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Manage Services — Admin',
};

const iconMap: any = { Sun, Zap, Battery, Wrench, BarChart3, Shield };

export default async function AdminServicesPage() {
    const services = await getAllServices();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Services</h1>
                    <p className="text-muted-foreground">
                        Configure the solar services offered on your platform.
                    </p>
                </div>
                <Link href="/admin/services/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Service
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {services.map((service) => {
                    const Icon = iconMap[service.icon] || Sun;
                    return (
                        <div key={service.id} className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-md">
                            <div className="aspect-video w-full overflow-hidden">
                                <img 
                                    src={service.image_url} 
                                    alt={service.title}
                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                />
                            </div>
                            <div className="p-5">
                                <div className="mb-3 flex items-center justify-between">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                        <Icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/admin/services/${service.id}/edit`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <h3 className="mb-1 font-bold">{service.title}</h3>
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                                    {service.short_desc}
                                </p>
                                <div className="flex items-center justify-between border-t border-border pt-4">
                                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                                        {service.slug}
                                    </Badge>
                                    {service.is_active ? (
                                        <span className="flex items-center gap-1.5 text-xs text-green-500">
                                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                            Live
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                                            Draft
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
