'use client';

import { useState } from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Sun, Zap, Battery, Wrench, BarChart3, Shield,
  ArrowRight, Phone, Mail, CheckCircle2, Loader2,
  Sparkles, Globe2, Users, TrendingUp,
} from 'lucide-react';

/* ──────────────── SERVICE DATA ──────────────── */
const services = [
  {
    icon: Sun,
    title: 'Residential Solar',
    desc: 'Power your home with clean, affordable solar energy. Custom-designed rooftop systems tailored to your needs.',
  },
  {
    icon: Zap,
    title: 'Commercial Solar',
    desc: 'Reduce operational costs with large-scale solar installations for businesses and industrial facilities.',
  },
  {
    icon: Battery,
    title: 'Battery Storage',
    desc: 'Store excess solar energy for use during peak hours or power outages with advanced battery solutions.',
  },
  {
    icon: Wrench,
    title: 'Maintenance & Repair',
    desc: 'Keep your solar system running at peak performance with our expert maintenance and repair services.',
  },
  {
    icon: BarChart3,
    title: 'Energy Consulting',
    desc: 'Get expert advice on energy optimization, system sizing, and maximizing your solar investment ROI.',
  },
  {
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
export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

/* ──────────────── HERO ──────────────── */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-chart-2/5 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--background)_70%)]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <Badge variant="outline" className="mb-6 gap-2 border-primary/30 bg-primary/5 px-4 py-1.5 text-primary animate-fade-in">
            <Sparkles className="h-3.5 w-3.5" />
            Pakistan&apos;s #1 Solar Energy Company
          </Badge>

          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-7xl animate-slide-up">
            Harness The <br />
            <span className="text-gradient">Power Of The Sun</span>
          </h1>

          <p className="mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground animate-slide-up" style={{ animationDelay: '200ms' }}>
            Transform your energy future with cutting-edge solar technology.
            Save up to 90% on electricity bills while contributing to a greener Pakistan.
          </p>

          <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '400ms' }}>
            <Button size="lg" className="gap-2 glow text-base"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get Free Quote
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2 text-base border-primary/30 hover:bg-primary/10"
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Our Services
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center gap-6 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '600ms' }}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Free Site Survey
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
          <div className="relative animate-float">
            <div className="h-72 w-72 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-8">
              <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-2">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="rounded-md bg-primary/20 transition-all hover:bg-primary/40"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-2xl border border-yellow-400/30 bg-yellow-400/10 flex items-center justify-center animate-pulse-glow">
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

/* ──────────────── SERVICES ──────────────── */
function ServicesSection() {
  return (
    <section id="services" className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

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
            <div
              key={s.title}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 transition-all duration-300 hover:border-primary/30 hover:bg-card hover:shadow-lg hover:shadow-primary/5 animate-slide-up"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <s.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>

              {/* Hover glow accent */}
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
            </div>
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
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', message: '' });
      toast.success('Your inquiry has been submitted!');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />

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

          {/* Right — Form */}
          <div className="rounded-2xl border border-border/50 bg-card/80 p-6 sm:p-8 backdrop-blur-sm">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Thank You!</h3>
                <p className="mb-6 text-muted-foreground">
                  We&apos;ve received your inquiry and will get back to you within 24 hours.
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+92 300 1234567"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your solar needs…"
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full gap-2 glow" size="lg" disabled={submitting}>
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                  Submit Inquiry
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
