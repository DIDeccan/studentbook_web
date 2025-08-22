import React, { useState } from 'react';
import { Accordion, AccordionItem, AccordionHeader, AccordionBody, Container } from 'reactstrap';

const FAQSection = () => {
  const [open, setOpen] = useState('');

  const toggle = (id) => {
    setOpen(open === id ? '' : id);
  };

  const faqs = [
    { id: '1', question: 'What is StudentBook?', answer: 'StudentBook is an online learning platform where students can access study materials, attend classes, and track their progress.' },
    { id: '2', question: 'How do I register?', answer: 'Click on the Sign Up button at the top right corner, fill in your details, and submit the form to create your account.' },
    { id: '3', question: 'Is StudentBook free to use?', answer: 'StudentBook offers both free and premium plans. You can start with the free plan and upgrade anytime.' },
    { id: '4', question: 'Can I access StudentBook on my phone?', answer: 'Yes! StudentBook is mobile-friendly and works on all devices with an internet connection.' },
    { id: '5', question: 'How can I contact support?', answer: 'You can reach our support team through the Contact Us page or email us at support@studentbook.com.' }
  ];

  return (
    <section className="py-5 bg-light">   <style>
        {`
          .accordion-collapse {
            transition: height 0.6s ease; /* Slower animation */
          }
        `}
      </style>
      <Container style={{ maxWidth: '1000px' }}>
        <h2 className="text-center mb-4">Frequently Asked Questions</h2>
        <Accordion open={open} toggle={toggle}>
          {faqs.map((faq) => (
            <AccordionItem key={faq.id}>
              <AccordionHeader
                targetId={faq.id}
                style={{
                  paddingTop: '1rem',
                  paddingBottom: '1rem',
                  fontSize: '1.05rem',
                  transition: 'all 0.4s ease'
                }}
              >
                {faq.question}
              </AccordionHeader>
              <AccordionBody
                accordionId={faq.id}
                style={{
                //   paddingTop: '1rem',
                //   paddingBottom: '1rem',
                //   lineHeight: '1.6'
                }}
              >
                {faq.answer}
              </AccordionBody>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
};

export default FAQSection;
