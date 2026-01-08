import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Shield, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-20 pb-16 md:pt-32 md:pb-24">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-subtle" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="relative mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary animate-fade-in">
          <Shield className="h-4 w-4" />
          <span>100% Private & Offline</span>
        </div>

        {/* Headline */}
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl animate-slide-up">
          Build a professional CV
          <br />
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            in minutes
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mb-8 text-lg text-muted-foreground md:text-xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
          No login. No tracking. Your data stays in your browser.
          <br className="hidden md:block" />
          Create ATS-friendly resumes with live preview and AI assistance.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Button asChild size="lg" className="w-full sm:w-auto gap-2 text-base shadow-soft hover:shadow-elevated transition-shadow">
            <Link to="/editor">
              <Sparkles className="h-5 w-5" />
              Start Building
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto gap-2 text-base">
            <a href="#templates">
              <FileText className="h-5 w-5" />
              See Templates
            </a>
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span>Works offline</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span>No account needed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span>PDF export</span>
          </div>
        </div>
      </div>
    </section>
  );
}
