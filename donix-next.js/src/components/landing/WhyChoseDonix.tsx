"use client";

import React, { useEffect, useRef } from "react";
import { 
  Shield, 
  Settings, 
  HeartPulse, 
  Database, 
  UserCheck, 
  Lock, 
  Stethoscope, 
  Megaphone, 
  Globe, 
  Hospital, 
  FileText 
} from "lucide-react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "next-themes";
gsap.registerPlugin(ScrollTrigger);

const WhyChooseDonix = () => {
  const containerRef = useRef(null);
  const featuresRef = useRef([]);
  const headingRef = useRef(null);

  const { resolvedTheme } = useTheme();
  
    const darkMode = resolvedTheme === "dark";

    const features = [
      {
        title: "Instant Donor Registration",
        description: "Seamless sign-up for donors and recipients with guided steps and hospital options",
        icon: <UserCheck size={28} />,
        color: "text-purple-500"
      },
      {
        title: "AI Medical Report Analysis",
        description: "Upload reports and get AI-powered answers to your health questions instantly",
        icon: <HeartPulse size={28} />,
        color: "text-red-500"
      },
      {
        title: "Organ Availability Tracking",
        description: "Live tracking of organ availability and real-time status updates across hospitals",
        icon: <Database size={28} />,
        color: "text-blue-500"
      },
      {
        title: "AI-Driven Recovery Routine",
        description: "Personalized daily health routines and alerts for post-donation care",
        icon: <Settings size={28} />,
        color: "text-yellow-500"
      },
      {
        title: "Doctor-Powered Monitoring",
        description: "Premium plans allow doctors to update patient progress with instant AI alerts",
        icon: <Stethoscope size={28} />,
        color: "text-teal-500"
      },
      {
        title: "Community Awareness Hub",
        description: "Share blogs, success stories, and discover camps, webinars, and events near you",
        icon: <Megaphone size={28} />,
        color: "text-pink-500"
      },
      {
        title: "Military-Grade Data Security",
        description: "Blockchain-backed health records and encrypted data sharing with full consent",
        icon: <Lock size={28} />,
        color: "text-green-500"
      },
      {
        title: "Multilingual Accessibility",
        description: "Platform available in multiple languages to serve rural and regional users better",
        icon: <Globe size={28} />,
        color: "text-indigo-500"
      },
      {
        title: "Verified Hospital Explorer",
        description: "Explore hospital profiles, compare facilities, and book appointments instantly",
        icon: <Hospital size={28} />,
        color: "text-orange-500"
      }
    ];
    
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%"
        }
      });

      featuresRef.current.forEach((el, i) => {
        if (el) {
          gsap.from(el, {
            opacity: 0,
            x: i % 2 === 0 ? -50 : 50,
            duration: 0.6,
            delay: i * 0.1,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none"
            }
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto ${darkMode ? "" : "bg-white"}`}
    >
      <div className="text-center mb-16">
        <h2
          ref={headingRef}
          className={`text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-fuchsia-500 bg-clip-text text-transparent`}
        >
          Why Choose Donix?
        </h2>
        <p className={`text-lg max-w-2xl mx-auto ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Revolutionizing organ donation through technology, transparency, and trust
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            ref={(el) => { featuresRef.current[index] = el; }}
            className={`group rounded-2xl p-6 transition-all duration-300 ${
              darkMode
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-gray-50 hover:bg-white border border-gray-200 hover:border-transparent"
            } hover:shadow-lg hover:-translate-y-2`}
          >
            <div className={`w-14 h-14 rounded-xl mb-4 flex items-center justify-center ${
              darkMode ? "bg-gray-700" : "bg-white"
            } group-hover:bg-opacity-90 transition-all ${feature.color}`}>
              {feature.icon}
            </div>
            <h3 className={`text-xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}>{feature.title}</h3>
            <p className={`text-sm ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyChooseDonix;