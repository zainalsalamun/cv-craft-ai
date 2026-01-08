import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Is my data uploaded to any server?',
    answer: 'No, absolutely not. All your CV data is stored locally in your browser using localStorage. We never upload, track, or collect any of your personal information. Your data stays 100% on your device.',
  },
  {
    question: 'Can I use this on my mobile phone?',
    answer: 'Yes! CV Builder is fully responsive and works great on mobile phones and tablets. You can build and edit your CV on any device with a modern web browser.',
  },
  {
    question: 'How does the AI summary generator work?',
    answer: 'Our AI analyzes your job title, skills, and experience to generate a professional summary. It creates variations in different tones (professional, impact-focused, friendly) so you can choose what fits best. The AI only uses the data you provide and never invents claims.',
  },
  {
    question: 'Can I save my CV and continue later?',
    answer: 'Yes! Your CV is automatically saved to your browser as you type. When you return to the site, your data will still be there. You can also export your CV data as a JSON file for backup.',
  },
  {
    question: 'Are the templates ATS-friendly?',
    answer: 'Yes, all our templates are designed to be parsed correctly by Applicant Tracking Systems (ATS). We use clean formatting, proper heading hierarchy, and avoid complex layouts that confuse ATS software.',
  },
  {
    question: 'Is it really free?',
    answer: 'Yes, CV Builder is completely free to use. Create unlimited CVs, export as many PDFs as you want, and use all templates at no cost.',
  },
];

export function FAQ() {
  return (
    <section className="bg-secondary/30 px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about CV Builder
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="rounded-xl border bg-card px-6 shadow-card"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
