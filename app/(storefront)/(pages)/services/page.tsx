import { Metadata } from 'next';
import { servicesData } from '@/lib/services';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe2, ArrowRight, CheckCircle2, Shield, Zap, Sun } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Our Services — PakSolarTech',
  description: 'Comprehensive solar energy solutions in Pakistan. From residential and commercial installations to battery storage and energy consulting.',
  keywords: 'solar services Pakistan, residential solar, commercial solar, battery storage Karachi, solar maintenance',
};

const valueProps = [
  {
    icon: Shield,
    title: 'Certified Quality',
    desc: 'Tier-1 solar panels and top-grade inverters with local warranties.'
  },
  {
    icon: Zap,
    title: 'Fast Execution',
    desc: 'Professional installation team ensuring quick turnaround times.'
  },
  {
    icon: Sun,
    title: 'Optimized Design',
    desc: 'Systems engineered specifically for Pakistan\'s unique climate.'
  }
];

export default function AllServicesPage() {
  const services = Object.values(servicesData);

  return (
    <main className="min-h-screen bg-background pt-32 pb-20">
      {/* ── HERO SECTION ── */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-24 text-center">
        <Badge variant="outline" className="mb-6 gap-2 border-primary/30 bg-primary/5 px-4 py-1.5 text-primary">
          <Globe2 className="h-3.5 w-3.5" />
          What We Offer
        </Badge>
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          End-to-End <span className="text-gradient">Solar Solutions</span>
        </h1>
        <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground">
          Whether you&apos;re a homeowner looking to slash bills or a business seeking energy independence, 
          we have the expertise to power your transition to clean energy.
        </p>
      </section>

      {/* ── SERVICES GRID ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-32">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link 
              key={s.slug} 
              href={`/services/${s.slug}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border/50 bg-card/50 transition-all duration-300 hover:border-primary/30 hover:bg-card hover:shadow-2xl hover:shadow-primary/5"
            >
              {/* Image Header */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img 
                  src={s.image} 
                  alt={s.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg">
                    <s.icon className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-8">
                <h3 className="mb-3 text-2xl font-bold transition-colors group-hover:text-primary">
                  {s.title}
                </h3>
                <p className="mb-6 flex-1 leading-relaxed text-muted-foreground">
                  {s.shortDesc}
                </p>
                <div className="flex items-center gap-2 font-bold text-primary">
                  <span>View Details</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── WHY CHOOSE US / VALUE PROPS ── */}
      <section className="section-padding bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                The PakSolarTech <span className="text-gradient">Advantage</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                We don&apos;t just install panels; we build long-term relationships with our clients, 
                ensuring their investment in solar energy continues to pay off for decades.
              </p>
              
              <div className="mt-10 space-y-4">
                {[
                  'Customized engineering for every roof',
                  'Hassle-free net metering documentation',
                  'Remote monitoring app for system performance',
                  'Dedicated after-sales maintenance team'
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <Link href="/contact">
                  <Button size="lg" className="rounded-full px-10">
                    Get Started Today
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {valueProps.map((prop, i) => (
                <div key={i} className="flex items-start gap-6 rounded-2xl border border-border/50 bg-card p-8 shadow-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <prop.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{prop.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{prop.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-24">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary to-chart-2 px-8 py-16 text-center text-white shadow-2xl">
          <div className="relative z-10">
            <h2 className="mb-6 text-3xl font-bold sm:text-4xl">Ready to switch to clean energy?</h2>
            <p className="mx-auto mb-10 max-w-xl text-lg text-white/80">
              Calculate your potential savings or request a free site visit from our certified engineers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/calculator">
                <Button size="lg" variant="secondary" className="rounded-full px-10 font-bold">
                  Try Solar Calculator
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="rounded-full border-white/30 px-10 text-white hover:bg-white/10">
                  Request a Quote
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
