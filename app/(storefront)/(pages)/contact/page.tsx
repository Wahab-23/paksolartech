import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Clock, Globe2 } from 'lucide-react';
import ContactSectionClient from '@/components/public/ContactSectionClient';

export const metadata: Metadata = {
  title: 'Contact Us — PakSolarTech',
  description: 'Get in touch with Pakistan\'s leading solar energy provider. Request a free quote, site survey, or technical support.',
  keywords: 'contact paksolartech, solar quote Pakistan, solar support, Karachi solar company',
};

const contactInfo = [
  {
    icon: Phone,
    title: 'Call Us',
    desc: 'Available Mon-Sat, 9am-6pm',
    value: '+92 300 1234567',
    href: 'tel:+923001234567'
  },
  {
    icon: Mail,
    title: 'Email Us',
    desc: 'We respond within 24 hours',
    value: 'info@paksolartech.com',
    href: 'mailto:info@paksolartech.com'
  },
  {
    icon: MapPin,
    title: 'Visit Office',
    desc: 'Karachi Head Office',
    value: 'Plot 123, Sector 15, Korangi Industrial Area, Karachi',
    href: 'https://maps.google.com'
  },
  {
    icon: Clock,
    title: 'Working Hours',
    desc: 'Monday — Saturday',
    value: '09:00 AM — 06:00 PM',
  }
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-20">
      {/* ── HERO SECTION ── */}
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20 text-center">
        <Badge variant="outline" className="mb-6 gap-2 border-primary/30 bg-primary/5 px-4 py-1.5 text-primary">
          <Globe2 className="h-3.5 w-3.5" />
          Get In Touch
        </Badge>
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Let&apos;s Power Your <br />
          <span className="text-gradient">Future Together</span>
        </h1>
        <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground">
          Have questions about solar? Our experts are ready to help you transition 
          to clean, sustainable energy with a custom solution for your home or business.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          {/* Left Side: Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {contactInfo.map((info, i) => (
                <div 
                  key={i} 
                  className="group flex items-start gap-5 rounded-2xl border border-border/50 bg-card/50 p-6 transition-all hover:border-primary/30"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <info.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{info.title}</h3>
                    <p className="mt-1 font-bold text-foreground">
                      {info.href ? (
                        <a href={info.href} className="hover:text-primary transition-colors">{info.value}</a>
                      ) : (
                        info.value
                      )}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{info.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Simple Map Placeholder */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border/50 bg-muted">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <MapPin className="mb-2 h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm font-medium text-muted-foreground">Interactive map coming soon</p>
                <p className="mt-1 text-xs text-muted-foreground/70">Visit us at our Korangi Industrial Area office.</p>
              </div>
              {/* Optional overlay to make it look like a map */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="lg:col-span-7">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Send us a Message</h2>
              <p className="text-muted-foreground mt-1">Fill out the form below and we&apos;ll get back to you shortly.</p>
            </div>
            <ContactSectionClient />
          </div>
        </div>
      </section>
    </main>
  );
}
