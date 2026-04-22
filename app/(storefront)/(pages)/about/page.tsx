import { Metadata } from 'next';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Users, Shield, Award, Zap, ArrowRight, HelpCircle, Sun } from 'lucide-react';
import Link from 'next/link';
import { getAllFAQs } from '@/app/models/faq.model';

export const metadata: Metadata = {
  title: 'About PakSolarTech — Karachi\'s Trusted Solar Energy Company',
  description: 'Learn about PakSolarTech — founded in Karachi with a mission to make solar energy accessible across Pakistan. Tier-1 panels, certified engineers, and 500+ installations.',
  keywords: 'about PakSolarTech, solar company Karachi, solar energy Pakistan, solar installer Karachi, who is PakSolarTech',
  openGraph: {
    title: 'About PakSolarTech — Trusted Solar Energy Company',
    description: 'Karachi-based solar energy company delivering Tier-1 panel installations across Pakistan.',
  },
  alternates: {
    canonical: '/about',
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://paksolartech.com" },
    { "@type": "ListItem", "position": 2, "name": "About", "item": "https://paksolartech.com/about" }
  ]
};

const milestones = [
  { icon: Shield, title: 'Tier-1 Only Policy', desc: 'We exclusively install panels from Longi, JA Solar, and Canadian Solar — no grey market, no compromises.' },
  { icon: Award, title: 'Certified Engineers', desc: 'Our installation teams hold PEC licenses and manufacturer certifications, ensuring every system meets international standards.' },
  { icon: Zap, title: 'Full Net Metering Support', desc: 'We handle the entire NEPRA net metering application — paperwork, inspections, and meter installation — so you don\'t have to.' },
  { icon: Users, title: 'Dedicated Aftercare', desc: 'Every client gets post-installation monitoring, annual maintenance checks, and priority support for the lifetime of their system.' },
];

export default async function AboutPage() {
  const faqs = await getAllFAQs();

  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <main className="min-h-screen bg-background pt-32 pb-20">
        {/* ── HERO SECTION ── */}
        <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge variant="outline" className="mb-6 gap-2 border-primary/30 bg-primary/5 px-4 py-1.5 text-primary">
                <Users className="h-3.5 w-3.5" />
                About Us
              </Badge>
              <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Powering Pakistan&apos;s <br />
                <span className="text-gradient">Solar Future</span>
              </h1>
              <p className="mb-6 text-lg text-foreground/80">
                PakSolarTech was founded in Karachi with a clear mission: make clean, reliable solar energy
                accessible to every household and business in Pakistan. We don&apos;t just install panels, we
                build long-term energy partnerships.
              </p>
              <p className="mb-8 leading-relaxed text-foreground/80">
                From a family rooftop to a 500 kW commercial installation, our team of certified engineers
                designs every system to maximize savings under real Pakistani conditions factoring in
                Karachi&apos;s 5.5 peak sun hours, NEPRA tariff slabs, and local grid reliability.
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

            {/* Stats Column */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { number: '500+', label: 'Systems Installed' },
                { number: '25yr', label: 'Panel Warranty' },
                { number: '5.5h', label: 'Peak Sun (Karachi)' },
                { number: '90%', label: 'Max Bill Reduction' },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-card/50 p-8 text-center transition-all hover:border-primary/30">
                  <p className="text-4xl font-extrabold text-gradient">{stat.number}</p>
                  <p className="mt-2 text-sm font-medium text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT SETS US APART ── */}
        <section className="section-padding bg-muted/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What Sets Us <span className="text-gradient">Apart</span></h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                In a market full of promises, we let our process and materials speak for themselves.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2">
              {milestones.map((m, i) => (
                <div key={i} className="group flex items-start gap-6 rounded-2xl border border-border/50 bg-card/50 p-8 transition-all hover:border-primary/30 hover:bg-card">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <m.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{m.title}</h3>
                    <p className="leading-relaxed text-muted-foreground">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── OUR COMMITMENT ── */}
        <section className="section-padding">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our <span className="text-gradient">Commitment</span></h2>
            </div>
            <div className="prose prose-invert max-w-none">
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Every solar system we install starts with a transparent conversation not a sales pitch.
                  We provide itemized quotes that break down every component: panel brand, inverter model,
                  mounting structure, wiring, and labor. No hidden costs, no surprises.
                </p>
                <p>
                  Our engineering team conducts thorough site assessments, analyzing roof orientation,
                  shading patterns, and structural capacity before recommending a system size. We don&apos;t
                  oversell we right-size every installation to match your actual consumption.
                </p>
                <p>
                  After installation, we don&apos;t disappear. Every client receives remote monitoring access,
                  scheduled maintenance reminders, and direct access to our support team. We stand behind
                  every kilowatt we promise.
                </p>
              </div>
              <ul className="mt-8 space-y-2">
                {[
                  'Tier-1 solar panels from Longi, JA Solar & Canadian Solar',
                  'Complete NEPRA net metering application handled end-to-end',
                  'Post-installation remote monitoring & annual maintenance',
                  'Transparent, itemized pricing with no hidden charges',
                  'Systems engineered for Karachi\'s climate and grid conditions',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-md text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── WHY CHOOSE US ── */}
        <section className="section-padding relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <Badge variant="outline" className="mb-4 gap-2 border-primary/30 bg-primary/5 px-4 py-1.5 text-primary">
                  <Shield className="h-3.5 w-3.5" />
                  Why Choose PakSolarTech?
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Experience You Can <span className="text-gradient">Trust</span></h2>
                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  <p>
                    With over 15 years of combined experience in Pakistan's renewable energy sector, PakSolarTech was founded on a single principle: <strong>Solar should be simple, transparent, and built to last.</strong> We've seen the industry evolve, and we've stayed ahead by never compromising on the quality of our components or the precision of our engineering. Explore our <Link href="/services" className="text-primary hover:underline font-medium">full range of solar services</Link> to see how we can help you.
                  </p>
                  <p>
                    Our team has successfully delivered over 500+ solar installations across Karachi and beyond, ranging from 3kW residential setups to large-scale 100kW+ industrial projects. We aren't just installers; we are energy consultants who understand the specific challenges of the Pakistani grid and the local climate.
                  </p>
                  <div className="grid grid-cols-2 gap-6 pt-4">
                    <div className="space-y-1">
                      <p className="text-3xl font-bold text-primary">500+</p>
                      <p className="text-sm font-medium">Successful Projects</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold text-primary">15+</p>
                      <p className="text-sm font-medium">Years Experience</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold text-primary">100%</p>
                      <p className="text-sm font-medium">Tier-1 Components</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold text-primary">24/7</p>
                      <p className="text-sm font-medium">Remote Monitoring</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="relative aspect-square overflow-hidden rounded-3xl border border-border/50 bg-card/50 shadow-2xl">
                  <div className="absolute inset-0 bg-linear-to-tr from-primary/20 via-transparent to-chart-2/20" />
                  <div className="flex flex-col items-center justify-center h-full p-12 text-center">
                    <Sun className="h-16 w-16 text-primary mb-6 animate-pulse-slow" />
                    <h3 className="text-xl font-bold mb-4">Engineering First</h3>
                    <p className="text-muted-foreground italic leading-relaxed">
                      "Most companies sell panels. We sell performance. Every system we design is custom-engineered to maximize ROI based on your specific roof orientation and shading profile."
                    </p>
                    <div className="mt-8 pt-8 border-t border-border/50 w-full">
                      <p className="font-bold">Engr. Abdul Wahab</p>
                      <p className="text-sm text-muted-foreground uppercase tracking-widest">Chief Technical Officer</p>
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-primary/10 blur-2xl -z-10" />
                <div className="absolute -top-6 -left-6 h-32 w-32 rounded-full bg-chart-2/10 blur-2xl -z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* ── OUR PROCESS ── */}
        <section className="section-padding bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <Badge variant="outline" className="mb-4 gap-2 border-primary/30 bg-primary/5 px-4 py-1.5 text-primary">
                <Zap className="h-3.5 w-3.5" />
                Our Proven Process
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How We Power Your <span className="text-gradient">Transition</span></h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">From the first site survey to the final net-metering switch, we handle every detail of your solar journey.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: '01',
                  title: 'Free Site Survey',
                  desc: 'Our engineers conduct a digital shading analysis and structural roof check to design your optimal system.'
                },
                {
                  step: '02',
                  title: 'Custom Engineering',
                  desc: 'We select the perfect combination of Tier-1 panels and hybrid/on-grid inverters for your specific energy needs.'
                },
                {
                  step: '03',
                  title: 'Pro Installation',
                  desc: 'Our certified teams handle the entire installation in as little as 3 days, following strict international safety standards.'
                },
                {
                  step: '04',
                  title: 'Net Metering',
                  desc: 'We manage the entire NEPRA application process, paperwork, and final meter commissioning on your behalf.'
                }
              ].map((item, i) => (
                <div key={i} className="group relative p-8 rounded-3xl border border-border/50 bg-card/50 transition-all hover:border-primary/30 hover:bg-card">
                  <div className="mb-6 text-4xl font-black text-primary/10 group-hover:text-primary/20 transition-colors">{item.step}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ SECTION ── */}
        {faqs.length > 0 && (
          <section className="section-padding">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <div className="mb-12 text-center">
                <Badge variant="outline" className="mb-4 gap-2 border-primary/30 bg-primary/5 px-4 py-1.5 text-primary">
                  <HelpCircle className="h-3.5 w-3.5" />
                  Common Questions
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Frequently Asked <span className="text-gradient">Questions</span></h2>
              </div>
              <div className="rounded-2xl border border-border/50 bg-card/30 p-6 md:p-8 backdrop-blur-sm">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, i) => (
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
              <h2 className="mb-6 text-3xl font-bold sm:text-4xl">Ready to make the switch?</h2>
              <p className="mx-auto mb-10 max-w-xl text-lg text-white/80">
                Get a free site survey and a transparent, itemized quote — no pressure, no obligation.
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
    </>
  );
}