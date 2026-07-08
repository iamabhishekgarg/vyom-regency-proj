"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      question: "Where exactly is the estate located?",
      answer: "The estate is located in Kishangarh Bas, Khairthal–Tijara District (formerly Alwar), Rajasthan. It's a serene location perfect for farmhouses, away from city pollution yet well-connected."
    },
    {
      question: "What is the standard plot size available?",
      answer: "We primarily offer premium farmhouse plots of 1350 Sq. Yards. This size is ideal for building a spacious farmhouse with plenty of room for gardening and outdoor activities."
    },
    {
      question: "Is the land title clear and secure?",
      answer: "Yes, Vyom Regency ensures 100% clear titles and complete documentation for every plot. We prioritize transparency and due diligence in all our transactions."
    },
    {
      question: "What basic amenities are provided?",
      answer: "The community features wide 30ft approach roads, gated security, water supply, and electricity connections. We aim to provide all the essentials for a comfortable living experience."
    },
    {
      question: "Can I visit the site before booking?",
      answer: "Absolutely! We encourage site visits. You can book a free consultation and site visit through our lead form or by calling us directly at +91 89553 11031."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Frequently Asked <span className="text-green-700">Questions</span>
          </h2>
          <p className="text-gray-600">Everything you need to know about Vyom Regency estates</p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-semibold text-gray-800 hover:text-green-700">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}