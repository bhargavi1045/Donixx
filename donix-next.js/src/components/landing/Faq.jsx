"use client"
import { useState } from "react";
import { Plus, Minus, HeartPulse, ClipboardList, Stethoscope, ShieldCheck, Users, AlertCircle, HelpCircle } from "lucide-react";
import { useTheme } from "next-themes";
const faqs = [
    {
      question: "Who is eligible to become an organ donor through Donix?",
      answer: "Almost anyone can register as an organ donor, regardless of age or medical background. Donix ensures all eligibility is verified through secure medical evaluations.",
      icon: <Users className="w-5 h-5 text-purple-300" />
    },
    {
      question: "Does it cost anything to donate organs on Donix?",
      answer: "No, donors or their families bear no costs. All donation-related medical expenses are handled by the recipient’s insurance or healthcare provider.",
      icon: <ShieldCheck className="w-5 h-5 text-purple-300" />
    },
    {
      question: "How does living organ donation work on Donix?",
      answer: "Living donors can safely donate a kidney or a portion of their liver or lungs. Donix ensures a thorough pre-evaluation with AI-assisted safety checks before approval.",
      icon: <HeartPulse className="w-5 h-5 text-purple-300" />
    },
    {
      question: "What documents are needed to register as a donor?",
      answer: "A government-issued ID, basic medical history, and digital consent forms are required. Donix simplifies the process through secure uploads and real-time verification.",
      icon: <ClipboardList className="w-5 h-5 text-purple-300" />
    },
    {
      question: "What organs and tissues can be donated through Donix?",
      answer: "Organs like kidneys, liver, lungs, heart, and pancreas can be donated, along with corneas, skin, and bone tissues, all under strict medical protocols.",
      icon: <Stethoscope className="w-5 h-5 text-purple-300" />
    },
    {
      question: "Will organ donation affect funeral arrangements?",
      answer: "Not at all. Donix ensures the donor’s body is treated with utmost dignity, making traditional funeral services, including open-casket ceremonies, fully possible.",
      icon: <AlertCircle className="w-5 h-5 text-purple-300" />
    },
    {
      question: "How long does the matching process take?",
      answer: "With Donix’s AI-powered matching engine, compatibility checks are streamlined. Match times vary based on organ type, urgency, and location, but updates are real-time.",
      icon: <HelpCircle className="w-5 h-5 text-purple-300" />
    },
    {
      question: "Can I choose which organs to donate?",
      answer: "Yes! While registering on Donix, you can select specific organs and tissues you’re willing to donate, offering full control and transparency.",
      icon: <ClipboardList className="w-5 h-5 text-purple-300" />
    }
  ];
  

export default function FAQ({isDarkMode}) {
  const [openIndex, setOpenIndex] = useState(null);
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 py-12 sm:py-16  text-white ${isDarkMode ? 'bg-gradient-to-b from-black to-gray-900' : 'bg-white'} `}>
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-12">
          {/* <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-full mb-6">
            <HelpCircle className="w-12 h-12 text-white" />
          </div> */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            FAQs
          </h1>
          <p className="text-lg sm:text-xl text-purple-100 max-w-2xl mx-auto">
            Get answers to common questions about organ donation and transplantation
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'ring-2 ring-white/30' : ''}`}
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors duration-200"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {faq.icon}
                  </div>
                  <h3 className={`text-lg sm:text-xl font-medium ${isDarkMode?"text-white":"text-black"}`}>
                    {faq.question}
                  </h3>
                </div>
                <div className="ml-4 flex-shrink-0">
                  {openIndex === index ? (
                    <Minus className="w-6 h-6 text-purple-200" />
                  ) : (
                    <Plus className="w-6 h-6 text-purple-200" />
                  )}
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6 pt-2 animate-fadeIn">
                  <div className="flex">
                    <div className="flex-shrink-0 w-10"></div>
                    <p className={` text-base sm:text-lg ${isDarkMode?"text-white":"text-black"}`}>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-purple-100">
          <button className="mt-4 px-6 py-3 bg-white text-purple-600 rounded-full font-medium hover:bg-purple-100 transition-colors duration-200 flex items-center justify-center mx-auto">
            <HeartPulse className="w-5 h-5 mr-2" />
            Still Have a question? Ask our AI assistant, trained to provide accurate answers based on Donix-related context.
          </button>
        </div>
      </div>
    </div>
  );
}