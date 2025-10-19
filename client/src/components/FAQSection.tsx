import { HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQ {
  question: string;
  answer: string;
}

interface Props {
  faqs: FAQ[];
  title?: string;
}

export function FAQSection({ faqs, title = "Sık Sorulan Sorular" }: Props) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="mt-12" data-testid="section-faq">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
          <HelpCircle className="w-7 h-7 text-primary" />
          {title}
        </h2>
        <p className="text-muted-foreground">
          Posta kodları hakkında en çok merak edilen sorular ve cevapları
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} data-testid={`faq-item-${index}`}>
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </section>
  );
}
