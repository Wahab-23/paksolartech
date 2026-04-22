import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Clock, Globe2 } from 'lucide-react';
import ContactSectionClient from '@/components/public/ContactSectionClient';

export const metadata: Metadata = {
  title: 'Contact Us — PakSolarTech',
  description: 'Get in touch with Pakistan\'s leading solar energy provider. Request a free quote, site survey, or technical support.',
  keywords: 'contact paksolartech, solar quote Pakistan, solar support, Karachi solar company',
  alternates: {
    canonical: '/contact',
  },
};

const contactInfo = [
  {
    icon: Phone,
    title: 'Call Us',
    desc: 'Available Mon-Sat, 9am-6pm',
    value: '+92 311 1096664',
    href: 'tel:+923111096664'

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
    title: 'Location',
    desc: 'Pakistan',
    value: 'Karachi, Pakistan',
    href: 'https://maps.google.com'
  },

  {
    icon: Clock,
    title: 'Working Hours',
    desc: 'Monday — Saturday',
    value: '09:00 AM — 06:00 PM',
  }
];

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "PakSolarTech",
  "telephone": "+92-311-1096664",
  "email": "info@paksolartech.com",
  "url": "https://paksolartech.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Karachi",
    "addressCountry": "PK"
  },
  "openingHours": "Mo-Sa 09:00-18:00",
  "priceRange": "$$"
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://paksolartech.com" },
    { "@type": "ListItem", "position": 2, "name": "Contact", "item": "https://paksolartech.com/contact" }
  ]
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
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
    </>
  );
}

