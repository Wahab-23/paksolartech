import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowLeft, Newspaper, HelpCircle, User, Clock } from 'lucide-react';

import { getBlogBySlug, getAllBlogs } from '@/app/models/blog.model';
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
        title: blog.meta_title || `${blog.title} — PakSolarTech Blog`,
        description: blog.meta_description || blog.excerpt || blog.title,
        keywords: blog.meta_keywords || '',
        openGraph: {
            title: blog.meta_title || blog.title,
            description: blog.meta_description || blog.excerpt || blog.title,
            images: blog.cover_image ? [{ url: blog.cover_image }] : [],
        },
        alternates: {
            canonical: `/blog/${slug}`,
        }
    };
}

export default async function BlogDetailPage({ params }: Props) {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);

    if (!blog || !blog.is_published) {
        notFound();
    }

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": blog.title,
        "description": blog.excerpt || blog.title,
        "image": blog.cover_image,
        "datePublished": blog.published_at || blog.created_at,
        "author": {
            "@type": "Person",
            "name": blog.author || "PakSolarTech Team"
        },
        "publisher": {
            "@type": "Organization",
            "name": "PakSolarTech",
            "logo": {
                "@type": "ImageObject",
                "url": "https://paksolartech.com/Logo/PakSolarTech%20Logo.png"
            }
        }
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://paksolartech.com" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://paksolartech.com/blog" },
            { "@type": "ListItem", "position": 3, "name": blog.title, "item": `https://paksolartech.com/blog/${blog.slug}` }
        ]
    };

    const faqSchema = blog.faqs && blog.faqs.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": blog.faqs.map((faq: any) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    } : null;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
            <main className="min-h-screen pt-32 pb-24">

                <article className="px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl">
                        {/* Back link */}
                        <Link href="/blog">
                            <Button variant="ghost" size="sm" className="mb-6 gap-2 text-muted-foreground hover:text-primary">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Blog
                            </Button>
                        </Link>

                        {/* Header */}
                        <div className="mb-8 space-y-4">
                            <Badge variant="outline" className="gap-2 border-primary/30 bg-primary/5 px-3 py-1 text-primary text-xs">
                                <Newspaper className="h-3 w-3" />
                                Blog Post
                            </Badge>

                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
                                {blog.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(blog.published_at || blog.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </div>
                                {blog.author && (
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        <span>By {blog.author}</span>
                                    </div>
                                )}
                                {blog.reading_time > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>{blog.reading_time} min read</span>
                                    </div>
                                )}
                            </div>

                            {blog.tags && blog.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {blog.tags.map((tag: string, index: number) => (
                                        <span key={index} className="text-xs font-medium text-primary hover:underline cursor-pointer">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Cover Image */}
                        {blog.cover_image && (
                            <div className="relative mb-10 overflow-hidden rounded-2xl border border-border/50 shadow-2xl shadow-primary/5 aspect-[7/5]">
                                <Image
                                    src={blog.cover_image}
                                    alt={blog.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 720px"
                                    priority
                                />
                            </div>
                        )}

                        {/* Content */}
                        <div className="max-w-none">
                            <BlockNoteRenderer data={blog.content} />
                        </div>

                        {/* Author Bio Section */}
                        <div className="mt-12 pt-8 border-t border-border">
                            <div className="flex items-start gap-5 rounded-2xl border border-border/50 bg-card/50 p-6 md:p-8">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <User className="h-7 w-7 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wider text-primary mb-1">Written by</p>
                                    <h3 className="text-lg font-bold">{blog.author || 'PakSolarTech Team'}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        {blog.author
                                            ? `${blog.author} is a solar energy specialist at PakSolarTech with hands-on experience in residential and commercial solar installations across Karachi. All content is reviewed by our certified engineering team.`
                                            : 'The PakSolarTech team comprises certified solar engineers and energy consultants with over 15 years of combined experience in Pakistan\'s renewable energy sector.'}
                                    </p>
                                    <Link href="/about" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                                        Learn more about our team
                                    </Link>
                                </div>
                            </div>
                        </div>

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

export async function generateStaticParams() {
    const blogs = await getAllBlogs({ publishedOnly: true });
    return blogs.map((blog: any) => ({
        slug: blog.slug,
    }));
}


