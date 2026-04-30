import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Zap, Briefcase, Heart, ArrowRight, Sun } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Careers | Join the Solar Revolution at PakSolarTech',
  description: 'Join PakSolarTech and help us power Pakistan with sustainable energy. Explore current openings and our culture.',
  alternates: {
    canonical: '/careers',
  },
};

export default function CareersPage() {
  const values = [
    { icon: Zap, title: 'Innovation', desc: 'We stay at the forefront of solar technology, from high-efficiency panels to smart monitoring.' },
    { icon: Heart, title: 'Sustainability', desc: 'Our mission is to create a greener Pakistan for future generations.' },
    { icon: Users, title: 'Collaboration', desc: 'We work as one team — from engineering to sales — to deliver excellence.' },
    { icon: Sun, title: 'Customer First', desc: 'Every decision we make is centered around maximizing value for our clients.' },
  ];

  const jobs = [
    { title: 'Solar Design Engineer', type: 'Full-time', location: 'Karachi' },
    { title: 'Installation Supervisor', type: 'Full-time', location: 'Karachi/On-site' },
    { title: 'Technical Sales Consultant', type: 'Full-time', location: 'Karachi' },
  ];

  return (
    <main className="min-h-screen bg-background pt-32 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-20 text-center">
          <Badge variant="outline" className="mb-6 gap-2 border-primary/30 bg-primary/5 px-4 py-1.5 text-primary">
            <Briefcase className="h-3.5 w-3.5" />
            Careers
          </Badge>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Power Your Career with <br />
            <span className="text-gradient">PakSolarTech</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Join a team of visionaries and engineers dedicated to solving Pakistan's energy crisis through clean, affordable, and reliable solar solutions.
          </p>
        </div>

        {/* Culture Section */}
        <section className="mb-24">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <div key={i} className="group rounded-2xl border border-border/50 bg-card/50 p-8 transition-all hover:border-primary/30">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <v.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold">{v.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Jobs Section */}
        <section className="mx-auto max-w-4xl mb-24">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Current <span className="text-gradient">Openings</span></h2>
            <p className="mt-4 text-muted-foreground">We're always looking for talented individuals to join our growing team.</p>
          </div>
          <div className="space-y-4">
            {jobs.map((job, i) => (
              <div key={i} className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-border/50 bg-card/30 p-6 sm:flex-row sm:p-8 hover:bg-card/50 transition-colors">
                <div>
                  <h3 className="text-xl font-bold">{job.title}</h3>
                  <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{job.type}</span>
                    <span className="h-1 w-1 rounded-full bg-border" />
                    <span>{job.location}</span>
                  </div>
                </div>
                <Button variant="outline" className="rounded-full group">
                  Apply Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl bg-linear-to-br from-primary/10 to-chart-2/10 border border-primary/20 p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Don't see a matching role?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Send us your CV anyway at <span className="text-primary font-bold">careers@paksolartech.com</span> and we'll keep you in mind for future opportunities.
          </p>
          <Button size="lg" className="rounded-full px-10">
            Submit General Application
          </Button>
        </section>
      </div>
    </main>
  );
}
