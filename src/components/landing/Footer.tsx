import { Link } from 'react-router-dom';
import { FileText, Shield, Heart } from 'lucide-react';

export function Footer() {
  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all CV data? This action cannot be undone.')) {
      localStorage.removeItem('cv-data');
      localStorage.removeItem('cv-settings');
      window.location.reload();
    }
  };

  return (
    <footer className="border-t bg-card px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          {/* Logo & tagline */}
          <div className="text-center md:text-left">
            <Link to="/" className="mb-2 inline-flex items-center gap-2 text-xl font-bold text-foreground">
              <FileText className="h-6 w-6 text-primary" />
              CV Builder
            </Link>
            <p className="flex items-center justify-center gap-1 text-sm text-muted-foreground md:justify-start">
              <Shield className="h-4 w-4" />
              Offline-first, privacy-friendly
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link to="/editor" className="text-muted-foreground hover:text-foreground transition-colors">
              Editor
            </Link>
            <a href="#templates" className="text-muted-foreground hover:text-foreground transition-colors">
              Templates
            </a>
            <button 
              onClick={handleResetData}
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              Reset Data
            </button>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center">
          <p className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            Made with <Heart className="h-4 w-4 text-destructive" /> for job seekers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
