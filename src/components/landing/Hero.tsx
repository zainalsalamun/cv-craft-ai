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
          <span className="text-blue-600">BuatCVAI</span>.com
          <br />
          <span className="text-3xl md:text-5xl font-semibold mt-2 block text-slate-800">
            Jalan Pintas Lolos <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Sistem ATS</span>
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mb-10 text-lg text-slate-600 md:text-xl animate-slide-up max-w-2xl mx-auto" style={{ animationDelay: '0.1s' }}>
          Platform AI pertama di Indonesia yang membantumu meracik CV dari nol atau memperbarui CV lama menjadi standar industri dalam hitungan detik.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Button 
            onClick={() => {
              localStorage.removeItem('cv-data');
              window.location.href = '/editor';
            }}
            size="lg" 
            className="w-full sm:w-auto gap-2 text-base shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 h-14 px-8 rounded-full"
          >
            <FileText className="h-5 w-5" />
            Buat CV Baru
          </Button>
          
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto gap-2 text-base h-14 px-8 rounded-full border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700">
            <Link to="/build">
              <Sparkles className="h-5 w-5 text-blue-500" />
              Update CV Lama (dengan AI)
            </Link>
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 font-medium animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span>Gratis & Aman</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span>Format PDF Siap Download</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span>Didukung Teknologi AI</span>
          </div>
        </div>
      </div>
    </section>
  );
}
