import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowLeft, Newspaper, HelpCircle } from 'lucide-react';
import { getBlogBySlug } from '@/app/models/blog.model';
import BlockNoteRenderer from '@/components/blocknote/BlockNoteRenderer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);
    if (!blog) return { title: 'Post Not Found — PakSolarTech' };
    return {
        title: `${blog.title} — PakSolarTech Blog`,
        description: blog.excerpt || blog.title,
    };
}

export default async function BlogDetailPage({ params }: Props) {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);

    if (!blog || !blog.is_published) {
        notFound();
    }

    return (
        <>
            <main className="min-h-screen pt-24">
                <article className="section-padding">
                    <div className="mx-auto max-w-3xl">
                        {/* Back link */}
                        <Link href="/blog">
                            <Button variant="ghost" size="sm" className="mb-6 gap-2 text-muted-foreground hover:text-primary">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Blog
                            </Button>
                        </Link>

                        {/* Header */}
                        <Badge variant="outline" className="mb-4 gap-2 border-primary/30 bg-primary/5 px-3 py-1 text-primary text-xs">
                            <Newspaper className="h-3 w-3" />
                            Blog Post
                        </Badge>

                        <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                            {blog.title}
                        </h1>

                        <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {new Date(blog.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </div>

                        {/* Cover Image */}
                        {blog.cover_image && (
                            <div className="mb-8 overflow-hidden rounded-2xl border border-border/50">
                                <img
                                    src={blog.cover_image}
                                    alt={blog.title}
                                    className="w-full object-cover"
                                />
                            </div>
                        )}

                        {/* Content */}
                        <BlockNoteRenderer data={blog.content} />

                        {/* FAQs Section */}
                        {blog.faqs && blog.faqs.length > 0 && (
                            <div className="mt-16 pt-16 border-t border-border">
                                <div className="mb-10 text-center">
                                    <Badge variant="outline" className="mb-4 gap-2 border-primary/30 bg-primary/5 px-4 py-1.5 text-primary">
                                        <HelpCircle className="h-3.5 w-3.5" />
                                        FAQ&apos;s
                                    </Badge>
                                    <h2 className="text-3xl font-bold tracking-tight">Frequently Asked <span className="text-gradient">Questions</span></h2>
                                    <p className="mt-3 text-muted-foreground">More insights about this topic.</p>
                                </div>
                                <div className="rounded-2xl border border-border/50 bg-card/30 p-6 md:p-8 backdrop-blur-sm">
                                    <Accordion type="single" collapsible className="w-full">
                                        {blog.faqs.map((faq: { question: string; answer: string }, i: number) => (
                                            <AccordionItem key={i} value={`faq-${i}`} className="border-border/50 first:border-t-0">
                                                <AccordionTrigger className="text-left text-lg font-bold hover:text-primary transition-colors py-5">
                                                    {faq.question}
                                                </AccordionTrigger>
                                                <AccordionContent className="text-base leading-relaxed text-muted-foreground pb-6">
                                                    {faq.answer}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </div>
                            </div>
                        )}
                    </div>
                </article>
            </main>
        </>
    );
}
