import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "How long does it take to set up the platform?",
      answer: "Most schools complete the initial setup within 1-2 days. Our onboarding team guides you through every step, from importing student data to training staff members.",
    },
    {
      question: "Is the platform suitable for small schools?",
      answer: "Absolutely! Our platform scales to fit schools of any size, from small private institutions with 50 students to large public schools with thousands of students.",
    },
    {
      question: "Can parents access the platform on mobile devices?",
      answer: "Yes, our platform is fully responsive and works seamlessly on smartphones, tablets, and desktop computers. Parents can access all features from any device.",
    },
    {
      question: "What kind of support do you provide?",
      answer: "We offer comprehensive support including email support, live chat, video tutorials, and dedicated account managers for enterprise clients. Training sessions are also available for staff.",
    },
    {
      question: "Is student data secure and private?",
      answer: "Yes, we take data security very seriously. All data is encrypted, stored securely, and complies with educational data privacy regulations including FERPA and COPPA.",
    },
    {
      question: "Can we integrate with our existing school systems?",
      answer: "Yes, our platform offers APIs and integration options with popular student information systems, learning management systems, and payment gateways.",
    },
  ];

  return (
    <section id="faq" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Got questions? We've got answers
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3 md:space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-background border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow px-4 md:px-6 py-2 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <AccordionTrigger className="text-left text-base md:text-lg font-semibold hover:text-primary py-4 md:py-5 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm md:text-base leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
