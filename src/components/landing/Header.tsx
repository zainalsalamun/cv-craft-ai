import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
          <FileText className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline">CV Builder</span>
        </Link>

        <nav className="flex items-center gap-4">
          <a 
            href="#templates" 
            className="hidden text-sm font-medium text-muted-foreground hover:text-foreground transition-colors sm:block"
          >
            Templates
          </a>
          <a 
            href="#faq" 
            className="hidden text-sm font-medium text-muted-foreground hover:text-foreground transition-colors sm:block"
          >
            FAQ
          </a>
          <Button asChild size="sm" className="gap-2">
            <Link to="/editor">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Start Building</span>
              <span className="sm:hidden">Start</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
