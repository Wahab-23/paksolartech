import { Skeleton } from '@/components/ui/skeleton';

export default function PageSkeleton() {
    return (
        <main className="min-h-screen bg-background pt-32 pb-20">
            {/* Hero Skeleton */}
            <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16 text-center flex flex-col items-center">
                <Skeleton className="h-8 w-40 rounded-full mb-6" />
                <Skeleton className="h-12 w-2/3 max-w-lg rounded-xl mb-4" />
                <Skeleton className="h-5 w-full max-w-xl rounded-lg" />
            </section>

            {/* Content Cards Skeleton */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="rounded-3xl border border-border/40 bg-card/40 p-8 space-y-4">
                            <Skeleton className="h-10 w-10 rounded-xl" />
                            <Skeleton className="h-6 w-1/2 rounded-md" />
                            <Skeleton className="h-4 w-full rounded-md" />
                            <Skeleton className="h-4 w-4/5 rounded-md" />
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
