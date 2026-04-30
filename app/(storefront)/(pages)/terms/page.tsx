import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { FileText, Gavel, ShieldCheck, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms & Conditions | PakSolarTech',
  description: 'Read the terms and conditions for using PakSolarTech services and solar installations.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-4 gap-2 border-primary/30 bg-primary/5 px-4 py-1.5 text-primary">
            <Gavel className="h-3.5 w-3.5" />
            Legal
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
            Terms & <span className="text-gradient">Conditions</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Last updated: {new Date().toLocaleDateString('en-PK', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-12 text-foreground/80 leading-relaxed">
          <section className="rounded-2xl border border-border/50 bg-card/30 p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4 mt-3">Agreement to Terms</h2>
            </div>
            <p>
              By accessing our website or engaging PakSolarTech for solar services, you agree to be bound by these Terms and Conditions. These terms apply to all visitors, users, and clients of PakSolarTech.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mt-3 mb-3">Quotations & Pricing</h2>
            </div>
            <div className="grid gap-6">
              <div className="rounded-xl border border-border/50 bg-card/50 p-6">
                <p className="text-sm italic mb-4">"All quotations provided by PakSolarTech are valid for a period of 7 days from the date of issuance due to fluctuating market prices and currency exchange rates."</p>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>Prices include Tier-1 equipment as specified in the itemized quote.</li>
                  <li>Any changes in government taxes or import duties will be reflected in the final invoice.</li>
                  <li>A formal deposit is required to lock in equipment pricing.</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <AlertCircle className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mt-3 mb-3">Installation & Warranties</h2>
            </div>
            <div className="space-y-4">
              <p>
                PakSolarTech provides warranties as per manufacturer standards:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li><strong className='text-primary'>Solar Panels:</strong> 25-year linear performance warranty.</li>
                <li><strong className='text-primary'>Inverters:</strong> 5 to 10-year manufacturer warranty (brand dependent).</li>
                <li><strong className='text-primary'>Workmanship:</strong> 2-year installation warranty against leaks or structural issues.</li>
                <li><strong className='text-primary'>Net Metering:</strong> We facilitate the process but timelines are subject to K-Electric/NEPRA approvals.</li>
              </ul>
            </div>
          </section>

          <section className="rounded-2xl border border-border/50 bg-card/30 p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 mt-3">Liability</h2>
            <p>
              PakSolarTech shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our services. We ensure all systems are designed for optimal performance but actual generation depends on weather conditions and site-specific factors.
            </p>
          </section>

          <section className="text-center pt-10 border-t border-border/50">
            <h2 className="text-2xl font-bold mt-3 mb-3 text-primary">Contact Legal</h2>
            <p className="mb-6 text-muted-foreground">
              For any legal inquiries or clarifications regarding these terms, please contact us.
            </p>
            <p className="font-bold text-primary">info@paksolartech.com</p>
          </section>
        </div>
      </div>
    </main>
  );
}
