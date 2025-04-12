"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  User,
  HeartPulse,
  ClipboardList,
  Hospital,
  ArrowRight,
  Users,
//   Handshake
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const featureData = [
    {
      role: "For Administrators",
      icon: <ClipboardList className="w-6 h-6" />,
      color: "from-purple-500 to-fuchsia-500",
      features: [
        "AI-powered donor-recipient matching with 98% precision",
        "Real-time organ and report analytics dashboard",
        "End-to-end encrypted medical record management",
        "Automated legal and compliance documentation",
        "Multi-hospital data integration and coordination",
        "Daily donor-recipient report summaries"
      ]
    },
    {
      role: "For Donors",
      icon: <User className="w-6 h-6" />,
      color: "from-purple-500 to-fuchsia-500",
      features: [
        "5-minute digital donor registration",
        "Interactive AI chatbot for report analysis and queries",
        "Personalized post-donation health routine planner",
        "Impact tracking of your donation in real-time",
        "Health monitoring and updates via premium doctor mode",
        "Access to community-driven wellness and support"
      ]
    },
    {
      role: "For Recipients",
      icon: <HeartPulse className="w-6 h-6" />,
      color: "from-purple-500 to-fuchsia-500",
      features: [
        "Instant organ match alerts via SMS & Email",
        "Custom health reports interpreted via AI assistant",
        "Integration with hospitals for priority matching",
        "Psychological and community support services",
        "Track hospital status and appointment availability",
        "Pre and post-transplant AI-assisted health insights"
      ]
    },
    {
      role: "For Hospitals",
      icon: <Hospital className="w-6 h-6" />,
      color: "from-purple-500 to-fuchsia-500",
      features: [
        "Blockchain-backed organ transport tracking",
        "Secure platform for patient document uploads",
        "Live updates on donor and recipient status",
        "Hospital profile dashboard with service highlights",
        "Direct communication with administrators and patients",
        "Real-time AI integration for matching and scheduling"
      ]
    },
    {
      role: "For Community",
      icon: <Users className="w-6 h-6" />,
      color: "from-purple-500 to-fuchsia-500",
      features: [
        "Blog & story publishing for donor-recipient experiences",
        "Monthly blood camps, organ drives & awareness events",
        "Volunteer and campaign creation dashboard",
        "AI-curated resource library on donation and recovery",
        "Push notifications for webinars and health news",
        "Event sharing and referral program for impact reach"
      ]
    }
  ];
  

const HowItWorks = ({ darkMode }: { darkMode: boolean }) => {
  const [activeRole, setActiveRole] = useState(featureData[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex(prev => 
        prev === activeRole.features.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [activeRole]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex(prev => 
      prev === 0 ? activeRole.features.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex(prev => 
      prev === activeRole.features.length - 1 ? 0 : prev + 1
    );
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  return (
    <div className={`relative overflow-hidden py-20 ${darkMode ? "" : "bg-white"}`}>
      {
        darkMode && (
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>
        )
      }
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-full shadow-lg mb-6">
            <Handshake className="w-8 h-8 text-white" />
          </div> */}
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Transforming Organ Donation
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            Discover how our platform empowers every participant in the life-saving journey of organ donation
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
              {featureData.map((role) => (
                <motion.button
                  key={role.role}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setActiveRole(role);
                    setCurrentIndex(0);
                  }}
                  className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 text-left ${
                    activeRole.role === role.role
                      ? `bg-gradient-to-br ${role.color} text-white shadow-lg`
                      : darkMode
                      ? "bg-white/10 hover:bg-gray-700 text-gray-300"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className={`p-3 rounded-lg ${
                    activeRole.role === role.role 
                      ? "bg-white/20" 
                      : darkMode 
                        ? "bg-white/10" 
                        : "bg-white"
                  }`}>
                    {role.icon}
                  </div>
                  <span className="font-medium">{role.role}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="lg:w-2/3 relative min-h-[300px]">
            <AnimatePresence custom={direction} initial={false}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`absolute inset-0 p-8 rounded-2xl shadow-xl ${
                  darkMode ? "bg-white/10" : "bg-white"
                } border ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="h-full flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${activeRole.color}`}>
                      {activeRole.icon}
                    </div>
                    <h3 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                      {activeRole.role}
                    </h3>
                  </div>
                  <p className={`text-lg mb-6 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {activeRole.features[currentIndex]}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Feature {currentIndex + 1}/{activeRole.features.length}
                    </span>
                    <div className="flex-1 h-1 rounded-full bg-gray-200">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${activeRole.color}`}
                        style={{ width: `${((currentIndex + 1) / activeRole.features.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <button
              onClick={handlePrev}
              className={`absolute left-4 bottom-10 -translate-y-1/2 p-3 rounded-full shadow-lg z-10 ${
                darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-100"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className={`absolute right-4 bottom-10 -translate-y-1/2 p-3 rounded-full shadow-lg z-10 ${
                darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-100"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          {/* <button className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-lg ${
            darkMode ? "bg-white text-gray-900 hover:bg-gray-100" : "bg-gray-900 text-white hover:bg-gray-800"
          } transition-all shadow-lg hover:shadow-xl`}>
            Get Started <ArrowRight className="w-5 h-5" />
          </button> */}
        </motion.div>
      </div>
    </div>
  );
};

export default HowItWorks;