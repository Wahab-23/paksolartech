import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getServiceBySlug, getAllServices } from '@/app/models/service.model';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, Sun, Zap, Battery, Wrench, BarChart3, Shield, Globe2, Clock, Settings, Heart, DollarSign, Info, Headphones, MessageSquare, HelpCircle, ArrowDown } from 'lucide-react';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Icon mapping helper
const iconMap: Record<string, any> = {
  Sun, Zap, Battery, Wrench, BarChart3, Shield, CheckCircle2, Heart, TrendingUp: ArrowRight, Clock, Settings, Headphones, Globe2, DollarSign, Info
};

function getIcon(name: string) {
  return iconMap[name] || Sun;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) return { title: 'Service Not Found' };

  return {
    title: `${service.title} — PakSolarTech`,
    description: service.short_desc,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const Icon = getIcon(service.icon);

  return (
    <main className="min-h-screen bg-background pt-32 pb-20">
      {/* ── HERO SECTION ── */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge variant="outline" className="mb-6 gap-2 border-primary/30 bg-primary/5 px-4 py-1.5 text-primary">
              <Icon className="h-3.5 w-3.5" />
              Service Details
            </Badge>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {service.title.split(' ').map((word, i, arr) => (
                <span key={i}>
                  {i === arr.length - 1 ? <span className="text-gradient">{word}</span> : word + ' '}
                </span>
              ))}
            </h1>
            <p className="mb-8 text-xl leading-relaxed text-muted-foreground">
              {service.long_desc}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact">
                <Button size="lg" className="rounded-full px-8">
                  Get a Free Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/calculator">
                <Button variant="outline" size="lg" className="rounded-full px-8">
                  Calculate Savings
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 rounded-3xl bg-linear-to-r from-primary/20 to-chart-2/20 blur-xl opacity-50 transition duration-500 group-hover:opacity-75" />
            <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card aspect-video">
              <img
                src={service.image_url}
                alt={service.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-background/60 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="section-padding bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Key <span className="text-gradient">Features</span></h2>
            <p className="mt-4 text-muted-foreground">What makes our {service.title.toLowerCase()} the best choice for you.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {service.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-4 rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
                <CheckCircle2 className="h-6 w-6 shrink-0 text-primary" />
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS SECTION ── */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Main <span className="text-gradient">Benefits</span></h2>
            <p className="mt-4 text-muted-foreground">The impact of switching to {service.title.toLowerCase()} with PakSolarTech.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {service.benefits.map((benefit, i) => {
              const BenIcon = getIcon(benefit.icon);
              return (
                <div key={i} className="group rounded-2xl border border-border/50 bg-card/50 p-8 transition-all hover:border-primary/30 hover:bg-card">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <BenIcon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold">{benefit.title}</h3>
                  <p className="leading-relaxed text-muted-foreground">{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PROCESS SECTION (IF AVAILABLE) ── */}
      {service.process && service.process.length > 0 && (
        <section className="section-padding bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our <span className="text-gradient">Process</span></h2>
              <p className="mt-4 text-muted-foreground">A smooth, transparent journey from consultation to power generation.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {service.process.map((step, i) => (
                <div key={i} className="relative">
                  {i < (service.process?.length || 0) - 1 && (
                    <div className="absolute right-0 top-1/2 hidden h-px w-full translate-x-1/2 bg-border/50 lg:block" />
                  )}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border-4 border-background bg-primary text-xl font-black text-primary-foreground shadow-lg">
                      {step.step}
                    </div>
                    <h3 className="mb-2 text-lg font-bold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* ── FAQ SECTION ── */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="section-padding">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <Badge variant="outline" className="mb-4 gap-2 border-primary/30 bg-primary/5 px-4 py-1.5 text-primary">
                <HelpCircle className="h-3.5 w-3.5" />
                Common Questions
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Frequently Asked <span className="text-gradient">Questions</span></h2>
              <p className="mt-4 text-muted-foreground">Everything you need to know about our {service.title.toLowerCase()}.</p>
            </div>
            <div className="rounded-2xl border border-border/50 bg-card/30 p-6 md:p-8 backdrop-blur-sm">
              <Accordion type="single" collapsible className="w-full">
                {service.faqs.map((faq, i) => (
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
        </section>
      )}

      {/* ── FINAL CTA ── */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-20">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary to-chart-2 px-8 py-16 text-center text-white shadow-2xl">
          <div className="relative z-10">
            <h2 className="mb-6 text-3xl font-bold sm:text-4xl">Ready to get started?</h2>
            <p className="mx-auto mb-10 max-w-xl text-lg text-white/80">
              Join thousands of happy customers and start your journey towards sustainable energy today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="rounded-full px-10 font-bold">
                  Contact Us Now
                </Button>
              </Link>
              <Link href="/calculator">
                <Button size="lg" variant="outline" className="rounded-full border-white/30 px-10 text-white bg-white/5 hover:bg-white/10">
                  Try Calculator
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        </div>
      </section>
    </main>
  );
}

export async function generateStaticParams() {
  const services = await getAllServices();
  return services.map((s) => ({
    slug: s.slug,
  }));
}

