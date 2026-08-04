import { Skeleton } from '@/components/ui/skeleton';

export default function ServicesSkeleton() {
    return (
        <main className="min-h-screen bg-background pt-32 pb-20">
            {/* ── HERO SKELETON ── */}
            <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-24 text-center flex flex-col items-center">
                {/* Badge Skeleton */}
                <Skeleton className="h-7 w-36 rounded-full mb-6" />
                {/* Title Skeleton */}
                <Skeleton className="h-12 w-3/4 max-w-xl rounded-xl mb-4 sm:h-14 lg:h-16" />
                {/* Subtitle Skeleton */}
                <Skeleton className="h-6 w-full max-w-2xl rounded-lg mb-2" />
                <Skeleton className="h-6 w-2/3 max-w-lg rounded-lg" />
            </section>

            {/* ── SERVICES GRID SKELETON ── */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-32">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex flex-col overflow-hidden rounded-3xl border border-border/40 bg-card/40 p-0 shadow-sm"
                        >
                            {/* Card Image Header Skeleton */}
                            <div className="relative aspect-[16/10] w-full">
                                <Skeleton className="h-full w-full rounded-none" />
                                <div className="absolute bottom-4 left-4">
                                    <Skeleton className="h-10 w-10 rounded-xl" />
                                </div>
                            </div>

                            {/* Card Content Skeleton */}
                            <div className="flex flex-1 flex-col p-8 space-y-4">
                                <Skeleton className="h-7 w-3/4 rounded-md" />
                                <Skeleton className="h-4 w-full rounded-md" />
                                <Skeleton className="h-4 w-5/6 rounded-md" />

                                <div className="pt-4 flex items-center justify-between">
                                    <Skeleton className="h-5 w-28 rounded-md" />
                                    <Skeleton className="h-4 w-4 rounded-full" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
