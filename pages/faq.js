import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/layout/Layout';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';

export default function FAQ() {
  const { t } = useTranslation('common');
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const faqSections = [
    {
      title: 'General',
      questions: [
        {
          question: 'What is Vacancy.service?',
          answer: 'Vacancy.service is a platform that connects freelancers and clients, offering a complete solution for freelance service hiring, with features like integrated meeting rooms, AI support, and secure payment system.',
        },
        {
          question: 'How does the platform work?',
          answer: 'The platform allows clients to post projects and freelancers to apply. After selection, work is done through our platform, with integrated tools for communication, payment, and project tracking.',
        },
        {
          question: 'What are the service fees?',
          answer: 'Our fees vary according to the chosen plan. For freelancers, fees start at 10% and can be reduced with paid plans. For clients, fees start at 5% and can also be reduced with business plans.',
        },
      ],
    },
    {
      title: 'For Freelancers',
      questions: [
        {
          question: 'How do I start working as a freelancer?',
          answer: 'Create an account, complete your professional profile, add your portfolio, and start applying for projects. You can use daily credits to send proposals, with the amount varying according to your plan.',
        },
        {
          question: 'How do I receive payments?',
          answer: 'Payments are processed through our secure platform. You can receive via bank transfer, PayPal, or other methods available in your region. Payment is released after project completion and client approval.',
        },
        {
          question: 'How do daily credits work?',
          answer: 'Credits are used to apply for projects. Each proposal consumes one credit. Credits are renewed daily, with the amount depending on your plan. Paid plans offer more daily credits.',
        },
      ],
    },
    {
      title: 'For Clients',
      questions: [
        {
          question: 'How do I post a project?',
          answer: 'Log in, click "Post Project" and fill in the necessary details, including description, budget, deadline, and requirements. You can choose between different project types and define your specific preferences.',
        },
        {
          question: 'How do I choose the best freelancer?',
          answer: 'You can evaluate freelancers through their profiles, portfolios, previous reviews, and received proposals. Our platform also offers filter and search tools to find the most suitable professionals.',
        },
        {
          question: 'How does payment work?',
          answer: 'Payment is made securely through our platform. The amount is held in escrow until project completion. You can pay via credit card, bank transfer, or other available methods.',
        },
      ],
    },
    {
      title: 'Security and Privacy',
      questions: [
        {
          question: 'How are my data protected?',
          answer: 'We implement rigorous security measures, including data encryption, fraud protection, and LGPD compliance. Your personal and financial data is treated with the highest level of security.',
        },
        {
          question: 'How does identity verification work?',
          answer: 'We offer different levels of identity verification, from basic to premium. Verification can include official documents, proof of address, and virtual interview, depending on the chosen level.',
        },
        {
          question: 'How do I report an issue?',
          answer: 'You can report issues through the report button on any profile or project, or contact our support. Our team investigates all reports and takes necessary actions.',
        },
      ],
    },
    {
      title: 'Platform Features',
      questions: [
        {
          question: 'How do meeting rooms work?',
          answer: 'Our integrated meeting rooms allow video conferencing, screen sharing, and whiteboard. Duration and available features depend on your plan. Meetings are recorded and can be accessed later.',
        },
        {
          question: 'How does AI support work?',
          answer: 'Our AI helps with automatic translation, price suggestions, proposal analysis, and fraud detection. The level of AI support varies according to the chosen plan.',
        },
        {
          question: 'How does the rating system work?',
          answer: 'After project completion, both client and freelancer can rate each other. Reviews are public and help build user reputation on the platform.',
        },
      ],
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Find answers to the most common questions about our platform.
            </p>

            <div className="mt-12 space-y-8">
              {faqSections.map((section) => (
                <div key={section.title}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{section.title}</h2>
                  <div className="space-y-4">
                    {section.questions.map((faq, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <button
                          className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none"
                          onClick={() => toggleSection(`${section.title}-${index}`)}
                        >
                          <span className="font-medium text-gray-900">{faq.question}</span>
                          {openSections[`${section.title}-${index}`] ? (
                            <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                        {openSections[`${section.title}-${index}`] && (
                          <div className="px-6 py-4 bg-gray-50">
                            <p className="text-gray-600">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-base text-gray-500">
                Still have questions?{' '}
                <a href="/contact" className="font-medium text-primary hover:text-primary-dark">
                  Contact us
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 