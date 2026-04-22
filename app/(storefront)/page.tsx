import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import {
  Sun, Zap, Battery, Wrench, BarChart3, Shield,
  CheckCircle2, Mail, Phone, Sparkles, Globe2, Users, TrendingUp, TrendingDown, ArrowRight, HelpCircle
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import HeroButtons from '@/components/public/HeroButtons';
import SolarCalculatorClient from '@/components/calculator/SolarCalculatorClient';
import { getAllServices, Service } from '@/app/models/service.model';
import { getAllFAQs } from '@/app/models/faq.model';
import DeferredContactSection from '@/components/public/DeferredContactSection';
import FAQSection from '@/components/public/FAQSection';

export const metadata: Metadata = {
  title: 'PakSolarTech — #1 Solar Energy Company in Pakistan',
  description: 'Karachi\'s #1 solar energy provider. Save up to 90% on electricity bills with our residential and commercial solar panel installations, net metering, and 25-year warranty.',
  keywords: 'solar energy Pakistan, best solar company Karachi, residential solar panels, commercial solar installation, net metering Pakistan, solar panel Karachi',
  alternates: {
    canonical: '/',
  },
};

const stats = [
  { value: 'Tier-1 Panels Only', label: 'Longi, JA Solar, Canadian Solar. No grey market stock.', icon: Sun },
  { value: '25-Year Warranty', label: 'Manufacturer guarantee on every panel we install.', icon: Shield },
  { value: 'Net Metering Handled', label: 'We do the paperwork, you collect the credits.', icon: CheckCircle2 },
  { value: 'Full Transparency', label: 'Itemized quotes. No hidden charges.', icon: BarChart3 },
];

export default async function Home() {
  const services = await getAllServices();
  const faqs = await getAllFAQs();

  const faqSchema = {
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
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="relative overflow-hidden">
        <div
          className="pointer-events-none fixed inset-0 -z-10 opacity-30"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27200%27 height=%27200%27 viewBox=%270 0 200 200%27%3E%3Cpath d=%27M0 0h200M0 40h200M0 80h200M0 120h200M0 160h200M0 200h200M0 0v200M40 0v200M80 0v200M120 0v200M160 0v200M200 0v200%27 fill=%27none%27 stroke=%27rgba(15%2C23%2C42%2C0.08)%27 stroke-width=%271%27/%3E%3C/svg%3E")',
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
            backgroundPosition: '0 0',
          }}
        />
        <HeroSection />
        <StatsSection />
        <CalculatorSection />
        <ServicesSection services={services} />
        <TrustSection />
        <AboutSection />
        <FAQSection faqs={faqs} />
        <ContactSection />
      </main>
    </>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20 lg:pt-0">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[20%] -right-[10%] h-[400px] w-[400px] rounded-full bg-chart-2/10 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Column: Content */}
          <div className="flex flex-col items-start text-left">
            <Badge
              variant="outline"
              className="mb-6 gap-2 border-primary/30 bg-primary/5 px-4 py-1.5 text-primary animate-fade-in"
            >
              <Sparkles className="h-3.5 w-3.5" />
              #1 Rated Solar Installer in Karachi
            </Badge>

            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl animate-slide-up leading-[1.1]">
              Stop Paying <br />
              <span className="text-destructive font-extrabold italic">Expensive Bills</span>. <br />
              Start <span className="text-gradient">Owning Solar Power</span> <span className="text-primary tracking-tighter">in Karachi</span>.
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground animate-slide-up" style={{ animationDelay: '200ms' }}>
              Karachi gets 5.5 hours of peak sun daily — enough to cut your electricity bill by 70–90%, permanently. Calculate your savings below and talk to a specialist on WhatsApp today.
            </p>

            <div className="mt-10 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <HeroButtons />
            </div>
          </div>

          {/* Right Column: Floating Visuals */}
          <div className="relative h-[500px] hidden lg:flex items-center justify-center">
            {/* Main Decorative Element */}
            <div className="relative w-full max-w-md aspect-square rounded-[3rem] bg-linear-to-br from-primary/10 to-chart-2/5 border border-white/10 glass shadow-2xl flex items-center justify-center animate-float">
              <Sun className="w-32 h-32 text-primary opacity-20 animate-pulse-slow" />

              {/* Floating Card 1: Savings */}
              <div className="absolute -top-4 -right-8 glass rounded-2xl border border-white/20 p-5 shadow-2xl animate-float-delayed w-48">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <TrendingDown className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Bill Offset</span>
                </div>
                <div className="text-2xl font-bold">70% - 90%</div>
                <div className="w-full h-1 bg-muted rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-green-500 w-[80%]" />
                </div>
              </div>

              {/* Floating Card 2: Warranty */}
              <div className="absolute bottom-12 -left-12 glass rounded-2xl border border-white/20 p-5 shadow-2xl animate-float w-52">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Guarantee</span>
                </div>
                <div className="text-xl font-bold italic text-foreground">25 Year Warranty</div>
                <p className="text-[10px] text-muted-foreground mt-1">On Tier-1 Panels & Inverters</p>
              </div>

              {/* Floating Card 3: Live Units */}
              <div className="absolute top-1/2 -translate-y-1/2 -right-16 glass rounded-2xl border border-white/20 p-5 shadow-2xl animate-float-slow w-44">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-yellow-500/20">
                    <Zap className="w-5 h-5 text-yellow-500" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Current Gen</span>
                </div>
                <div className="text-xl font-bold text-foreground">5.5 kWh</div>
                <div className="text-[10px] text-green-500 font-medium">● System Online</div>
              </div>
            </div>

            {/* Background decorative circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10" />
          </div>

        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="relative py-12 border-y border-border/50 bg-muted/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="group relative flex flex-col gap-3 rounded-2xl border border-border/50 bg-card/50 p-6 transition-all duration-300 hover:border-primary/30 hover:bg-card hover:shadow-xl hover:shadow-primary/5 animate-slide-up"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {stat.value}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CalculatorSection() {
  return (
    <section id="calculator" className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <Badge variant="outline" className="mb-4 gap-2 border-primary/30 bg-primary/5 px-4 py-1.5 text-primary">
          <TrendingUp className="h-3.5 w-3.5" />
          Solar Savings Calculator
        </Badge>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Calculate Your Savings</h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Enter your average bill — we&apos;ll estimate your ideal system size, installation cost, and payback period.
        </p>
      </div>
      <SolarCalculatorClient redirectMode={false} />
    </section>
  );
}

function TrustSection() {
  const steps = [
    { title: 'Chat with us on WhatsApp', desc: 'Tell us your bill, your area, and your roof type.' },
    { title: 'Itemized Quote', desc: 'We send you a detailed, transparent quote within 24 hours.' },
    { title: 'Review & Compare', desc: 'Review panel brands, inverter specs, and total cost.' },
    { title: 'Zero Pressure Decision', desc: 'Take your time to decide — we are here to help, not push.' },
    { title: 'Installation & Credits', desc: 'We handle everything from installation to official net metering.' },
  ];

  return (
    <section className="section-padding bg-muted/20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-4 gap-2 border-primary/30 bg-primary/5 px-4 py-1.5 text-primary">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Our Process
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Here&apos;s exactly what happens next</h2>
        </div>

        <div className="space-y-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-2xl border border-border/50 bg-card/50 p-6 transition-all hover:border-primary/30"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {i + 1}
              </div>
              <div>
                <h3 className="font-bold text-foreground">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection({ services }: { services: Service[] }) {
  const iconMap: any = { Sun, Zap, Battery, Wrench, BarChart3, Shield };

  return (
    <section id="services" className="section-padding relative">
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-4 gap-2 border-primary/30 bg-primary/5 px-4 py-1.5 text-primary">
            <Globe2 className="h-3.5 w-3.5" />
            What We Offer
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Our <span className="text-gradient">Services</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            End-to-end solar energy solutions designed to meet your specific needs and budget.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {services.map((s) => {
            const Icon = iconMap[s.icon] || Sun;
            return (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 transition-all duration-300 hover:border-primary/30 hover:bg-card hover:shadow-lg hover:shadow-primary/5 animate-slide-up"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold flex items-center justify-between">
                  {s.title}
                  <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">{s.short_desc}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="section-padding">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Badge variant="outline" className="mb-4 gap-2 border-primary/30 bg-primary/5 px-4 py-1.5 text-primary">
              <Users className="h-3.5 w-3.5" />
              About PakSolarTech
            </Badge>
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
              Pioneering <span className="text-gradient">Solar Energy</span> <br />
              Across Pakistan
            </h2>
            <p className="mb-6 leading-relaxed text-muted-foreground">
              Founded with a vision to make clean energy accessible to every Pakistani household
              and business, PakSolarTech has grown into one of the country&apos;s most trusted solar
              energy providers. Our team of certified engineers and technicians delivers
              world-class solar installations with unmatched quality and service.
            </p>
            <ul className="space-y-3">
              {[
                'Tier-1 solar panels from top global manufacturers',
                'Certified engineers with 15+ years of experience',
                'Complete net metering assistance & documentation',
                'Post-installation monitoring & maintenance',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative aspect-square overflow-hidden rounded-3xl border border-border/50">
            <Image
              src="/uploads/blogs/pioneering-solar-energy.jpg"
              alt="PakSolarTech solar panel installation on a residential rooftop in Karachi"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={false}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <p className="text-4xl font-bold text-white">15+</p>
              <p className="text-sm text-white/80">Years of Experience</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="section-padding relative">
      <div className="absolute inset-0 bg-linear-to-b from-background via-card/30 to-background" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Badge variant="outline" className="mb-4 gap-2 border-primary/30 bg-primary/5 px-4 py-1.5 text-primary">
              <Mail className="h-3.5 w-3.5" />
              Get In Touch
            </Badge>
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
              Ready To Go <span className="text-gradient">Solar</span>?
            </h2>
            <p className="mb-8 leading-relaxed text-muted-foreground">
              Get a free site survey and custom solar proposal for your home or business.
              Our experts will design the perfect system for your needs.
            </p>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Call us anytime</p>
                  <p className="font-medium">+92 311 1096664</p>

                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email us</p>
                  <p className="font-medium">info@paksolartech.com</p>
                </div>
              </div>
            </div>
          </div>

          <DeferredContactSection />
        </div>
      </div>
    </section>
  );
}