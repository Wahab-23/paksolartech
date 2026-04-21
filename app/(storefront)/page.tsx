import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sun, Zap, Battery, Wrench, BarChart3, Shield,
  CheckCircle2, Mail, Phone, Sparkles, Globe2, Users, TrendingUp, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import HeroButtons from '@/components/public/HeroButtons';
import ProductCard from '@/components/public/ProductCard';
import { getFeaturedProducts, type FeaturedProduct } from '@/app/models/product.model';
import SolarCalculatorClient from '@/components/calculator/SolarCalculatorClient';
import DeferredContactSection from '@/components/public/DeferredContactSection';

export const metadata: Metadata = {
  title: 'PakSolarTech — #1 Solar Energy Company in Pakistan',
  description: 'Harness the power of the sun with Pakistan\'s leading solar provider. Save up to 90% on bills with our residential and commercial solar solutions.',
  keywords: 'solar energy Pakistan, best solar company, residential solar panels, commercial solar installation, net metering Pakistan',
};

/* ──────────────── SERVICE DATA ──────────────── */
const services = [
  {
    slug: 'residential-solar',
    icon: Sun,
    title: 'Residential Solar',
    desc: 'Power your home with clean, affordable solar energy. Custom-designed rooftop systems tailored to your needs.',
  },
  {
    slug: 'commercial-solar',
    icon: Zap,
    title: 'Commercial Solar',
    desc: 'Reduce operational costs with large-scale solar installations for businesses and industrial facilities.',
  },
  {
    slug: 'battery-storage',
    icon: Battery,
    title: 'Battery Storage',
    desc: 'Store excess solar energy for use during peak hours or power outages with advanced battery solutions.',
  },
  {
    slug: 'maintenance-repair',
    icon: Wrench,
    title: 'Maintenance & Repair',
    desc: 'Keep your solar system running at peak performance with our expert maintenance and repair services.',
  },
  {
    slug: 'energy-consulting',
    icon: BarChart3,
    title: 'Energy Consulting',
    desc: 'Get expert advice on energy optimization, system sizing, and maximizing your solar investment ROI.',
  },
  {
    slug: 'warranty-support',
    icon: Shield,
    title: 'Warranty & Support',
    desc: 'Industry-leading warranties and 24/7 customer support to ensure your peace of mind.',
  },
];

const stats = [
  { value: '500+', label: 'Installations', icon: Sun },
  { value: '10MW+', label: 'Power Generated', icon: Zap },
  { value: '98%', label: 'Client Satisfaction', icon: Users },
  { value: '15+', label: 'Years Experience', icon: TrendingUp },
];

/* ══════════════ HOME PAGE ══════════════ */
export default async function Home() {
  const featuredProducts = await getFeaturedProducts({ limit: 4 });

  return (
    <>
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
        <CalculatorSection />
        {/* {featuredProducts.length > 0 && <FeaturedProductsSection products={featuredProducts} />} */}
        <ServicesSection />
        <AboutSection />
        <ContactSection />
      </main>
    </>
  );
}

/* ──────────────── HERO ──────────────── */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Effects */}
      {/* <div className="absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-chart-2/5 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--background)_70%)]" />
      </div> */}

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <Badge variant="outline" className="mb-6 gap-2 border-primary/30 bg-primary/5 px-4 py-1.5 text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Pakistan&apos;s Most Trusted Solar Company
          </Badge>

          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-7xl">
            Harness The <br />
            <span className="text-gradient">Power Of The Sun</span>
          </h1>

          <p className="mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Transform your energy future with cutting-edge solar technology.
            Save up to 90% on electricity bills while contributing to a greener Pakistan.
          </p>

          <HeroButtons />

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Site Survey
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              25 Year Warranty
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Net Metering Ready
            </div>
          </div>
        </div>

        {/* Floating solar panel illustration */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block">
          <div className="relative">
            <div className="h-72 w-72 rounded-3xl border border-primary/20 bg-linear-to-br from-primary/10 to-transparent p-8">
              <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-2">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="rounded-md bg-primary/20 transition-colors hover:bg-primary/30" />
                ))}
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-yellow-400/30 bg-yellow-400/10">
              <Sun className="h-8 w-8 text-yellow-400" />
            </div>
            <div className="absolute -right-4 -top-4 h-16 w-16 rounded-2xl border border-chart-2/30 bg-chart-2/10 flex items-center justify-center">
              <Zap className="h-6 w-6 text-chart-2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────── CALCULATOR ──────────────── */
function CalculatorSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Calculate Your Savings</h2>
          <p className="mt-3 text-muted-foreground">
            Enter your details below — we&apos;ll calculate the perfect solar system for you.
          </p>
        </div>
        <Link href="/calculator" className="text-sm text-primary hover:underline underline-offset-4 flex items-center gap-1 shrink-0">
          Open full calculator
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <SolarCalculatorClient redirectMode />
    </section>
  );
}



/* ──────────────── FEATURED PRODUCTS ──────────────── */
function FeaturedProductsSection({ products }: { products: FeaturedProduct[] }) {
  return (
    <section className="section-padding bg-muted/20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-4 gap-2 border-primary/30 bg-primary/5 px-4 py-1.5 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Top Rated Panels
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Featured <span className="text-gradient">Products</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Our hand-picked selection of high-efficiency solar panels and components for optimal energy yield.
            </p>
          </div>
          <Link href="/products">
            <Button variant="ghost" className="gap-2 text-primary hover:text-primary hover:bg-primary/5">
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────── SERVICES ──────────────── */
function ServicesSection() {
  return (
    <section id="services" className="section-padding relative">
      <div className="absolute" />

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
          {services.map((s) => (
            <Link 
              key={s.slug} 
              href={`/services/${s.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 transition-all duration-300 hover:border-primary/30 hover:bg-card hover:shadow-lg hover:shadow-primary/5 animate-slide-up"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <s.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold flex items-center justify-between">
                {s.title}
                <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>

              {/* Hover glow accent */}
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────── ABOUT ──────────────── */
function AboutSection() {
  return (
    <section id="about" className="section-padding">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left — Content */}
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

          {/* Right — Stats */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="group rounded-2xl border border-border/50 bg-card/50 p-6 text-center transition-all hover:border-primary/30 hover:bg-card hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-3xl font-extrabold text-gradient">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────── CONTACT ──────────────── */
function ContactSection() {
  return (
    <section id="contact" className="section-padding relative">
      <div className="absolute inset-0 bg-linear-to-b from-background via-card/30 to-background" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left — Info */}
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
                  <p className="font-medium">+92 300 1234567</p>
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

          {/* Right — Form (Client Component) */}
          <DeferredContactSection />
        </div>
      </div>
    </section>
  );
}