import { Shield, Eye, Palette, Sparkles, Download, Smartphone } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Offline & Private',
    description: 'Your data never leaves your browser. No servers, no tracking, complete privacy.',
  },
  {
    icon: Eye,
    title: 'Live Preview',
    description: 'See your CV update in real-time as you type. What you see is what you get.',
  },
  {
    icon: Palette,
    title: 'Multiple Templates',
    description: 'Choose from ATS-friendly templates designed to impress recruiters.',
  },
  {
    icon: Sparkles,
    title: 'AI Summary Generator',
    description: 'Generate a professional summary using AI based on your experience.',
  },
  {
    icon: Download,
    title: 'PDF Export',
    description: 'Download your CV as a perfectly formatted A4 PDF, ready to send.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Build your CV on any device. Works great on phones and tablets.',
  },
];

export function Features() {
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Everything you need
          </h2>
          <p className="text-lg text-muted-foreground">
            Professional CV building made simple and private
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group rounded-2xl border bg-card p-6 shadow-card transition-all hover:shadow-elevated hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
