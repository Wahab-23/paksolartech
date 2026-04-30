import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | PakSolarTech',
  description: 'Our privacy policy explains how we collect, use, and protect your information when you use PakSolarTech services.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-4 gap-2 border-primary/30 bg-primary/5 px-4 py-1.5 text-primary">
            <Shield className="h-3.5 w-3.5" />
            Legal
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
            Privacy <span className="text-gradient">Policy</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Last updated: {new Date().toLocaleDateString('en-PK', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-12 text-foreground/80 leading-relaxed">
          <section className="rounded-2xl border border-border/50 bg-card/30 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mt-3 mb-3">Introduction</h2>
            </div>
            <p>
              At PakSolarTech, we are committed to protecting your privacy and ensuring a secure experience. This Privacy Policy outlines how we collect, use, and safeguard your personal information when you visit our website or use our solar energy services.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mt-3 mb-3">Information We Collect</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-border/50 bg-card/50 p-6">
                <h3 className="font-bold text-primary mb-2">Personal Data</h3>
                <p className="text-sm">We may collect your name, email address, phone number, and physical address when you request a quote or site survey.</p>
              </div>
              <div className="rounded-xl border border-border/50 bg-card/50 p-6">
                <h3 className="font-bold text-primary mb-2">Technical Data</h3>
                <p className="text-sm">Information about your roof, energy consumption patterns, and utility bills provided for system design.</p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mt-3 mb-3">How We Use Your Information</h2>
            </div>
            <ul className="list-disc pl-6 space-y-3">
              <li>To provide accurate solar energy quotations and system designs.</li>
              <li>To schedule and conduct on-site surveys and installations.</li>
              <li>To facilitate the NEPRA net metering application process.</li>
              <li>To provide ongoing monitoring and maintenance services.</li>
              <li>To communicate important updates regarding your system performance.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-border/50 bg-card/30 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mt-3 mb-3">Data Security</h2>
            </div>
            <p>
              We implement industry-standard security measures to protect your data from unauthorized access, alteration, or disclosure. Your personal information is stored securely and is only accessible by authorized personnel required to deliver our services.
            </p>
          </section>

          <section className="text-center pt-4 border-t border-border/50">
            <h2 className="text-2xl font-bold mb-4 text-primary">Questions?</h2>
            <p className="mb-6 text-muted-foreground">
              If you have any questions about our privacy practices, please contact us.
            </p>
            <p className="font-bold">info@paksolartech.com</p>
          </section>
        </div>
      </div>
    </main>
  );
}
