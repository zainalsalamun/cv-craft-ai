import { PenLine, Layout, Download } from 'lucide-react';

const steps = [
  {
    icon: PenLine,
    step: '01',
    title: 'Fill Your Details',
    description: 'Add your experience, skills, and education. Our smart form guides you through each section.',
  },
  {
    icon: Layout,
    step: '02',
    title: 'Choose Template',
    description: 'Pick from professional ATS-friendly templates. Switch anytime with one click.',
  },
  {
    icon: Download,
    step: '03',
    title: 'Download PDF',
    description: 'Export your polished CV as a perfectly formatted A4 PDF. Ready to impress recruiters.',
  },
];

export function HowItWorks() {
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Create your professional CV in three simple steps
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-8 top-16 hidden h-[calc(100%-8rem)] w-px bg-border md:left-1/2 md:block" />

          <div className="space-y-8 md:space-y-0">
            {steps.map((step, index) => (
              <div
                key={step.step}
                className={`relative flex items-start gap-6 md:gap-12 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Icon */}
                <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl gradient-hero text-primary-foreground shadow-soft md:absolute md:left-1/2 md:-translate-x-1/2">
                  <step.icon className="h-7 w-7" />
                </div>

                {/* Content */}
                <div className={`flex-1 md:w-1/2 ${index % 2 === 0 ? 'md:pr-24 md:text-right' : 'md:pl-24'}`}>
                  <div className="rounded-2xl border bg-card p-6 shadow-card">
                    <span className="mb-2 inline-block text-sm font-bold text-primary">
                      Step {step.step}
                    </span>
                    <h3 className="mb-2 text-xl font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden flex-1 md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
