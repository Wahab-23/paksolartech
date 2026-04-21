'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FAQ {
    id: number;
    question: string;
    answer: string;
}

interface Props {
    faqs: FAQ[];
}

export default function FAQSection({ faqs }: Props) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    if (!faqs || faqs.length === 0) return null;

    return (
        <section id="faq" className="section-padding bg-muted/10">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <Badge variant="outline" className="mb-4 gap-2 border-primary/30 bg-primary/5 px-4 py-1.5 text-primary">
                        <HelpCircle className="h-3.5 w-3.5" />
                        Common Questions
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Everything You <span className="text-gradient">Need To Know</span>
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        Have more questions? Chat with our experts on WhatsApp for instant answers.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div
                            key={faq.id}
                            className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                                openIndex === i 
                                ? 'border-primary/30 bg-card shadow-lg' 
                                : 'border-border/50 bg-card/50 hover:border-primary/20'
                            }`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="flex w-full items-center justify-between px-6 py-5 text-left"
                            >
                                <span className="text-lg font-semibold text-foreground">{faq.question}</span>
                                {openIndex === i ? (
                                    <ChevronUp className="h-5 w-5 text-primary" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                )}
                            </button>
                            <div
                                className={`transition-all duration-300 ${
                                    openIndex === i ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                                }`}
                            >
                                <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
