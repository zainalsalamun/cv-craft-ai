import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';

const templates = [
  {
    id: 'classic',
    name: 'Classic ATS',
    description: 'Simple, clean, and ATS-optimized. Perfect for traditional industries.',
    features: ['ATS-friendly', 'Clean typography', 'Maximum readability'],
    preview: 'linear-gradient(180deg, #1a1a1a 0%, #1a1a1a 8%, #ffffff 8%)',
  },
  {
    id: 'modern',
    name: 'Modern Minimal',
    description: 'Contemporary design with subtle accent colors. Great for tech roles.',
    features: ['Modern layout', 'Accent colors', 'Clean sections'],
    preview: 'linear-gradient(180deg, #3B82F6 0%, #3B82F6 8%, #ffffff 8%)',
  },
  {
    id: 'creative',
    name: 'Creative Sidebar',
    description: 'Two-column layout with a stylish sidebar. Ideal for creative roles.',
    features: ['Sidebar layout', 'Visual hierarchy', 'Standout design'],
    preview: 'linear-gradient(90deg, #6366F1 0%, #6366F1 30%, #ffffff 30%)',
  },
];

export function Templates() {
  return (
    <section id="templates" className="bg-secondary/30 px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Professional Templates
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose a design that matches your style and industry
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className="group overflow-hidden rounded-2xl border bg-card shadow-card transition-all hover:shadow-elevated"
            >
              {/* Preview */}
              <div 
                className="aspect-[3/4] w-full transition-transform group-hover:scale-105"
                style={{ background: template.preview }}
              >
                <div className="h-full w-full p-4">
                  <div className="h-full rounded-lg bg-card/80 backdrop-blur-sm shadow-sm" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  {template.name}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {template.description}
                </p>
                <ul className="mb-4 space-y-2">
                  {template.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full gap-2">
                  <Link to={`/editor?template=${template.id}`}>
                    Use Template
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
