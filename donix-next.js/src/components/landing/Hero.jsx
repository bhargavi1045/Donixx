"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HeartPulse, ArrowRight, ShieldPlus, Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

const Hero = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <section
      className={`relative min-h-screen py-20 px-6 sm:px-10 overflow-hidden ${
        isDark ? "bg-[#0d0d0d] text-white" : "bg-white "
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 z-10 relative">
        <div className="md:w-1/2 text-center md:text-left space-y-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-4xl md:text-6xl font-bold leading-tight"
          >
            <span className="bg-gradient-to-r from-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
              Your One Act
            </span>{" "}
            Can Save <br />
            <span className="bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
              Multiple Lives!
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-lg max-w-xl mx-auto md:mx-0 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Join our life-saving mission. Register as a donor or find a match through our AI-powered platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 mt-6 justify-center md:justify-start"
          >
            <Link href="/register/donor" aria-label="Register as a donor">
              <button className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-6 py-3 rounded-xl text-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 text-white">
                <HeartPulse className="w-6 h-6" />
                Become a Donor
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/search-organ" aria-label="Find a matching organ">
              <button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-6 py-3 rounded-xl text-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 text-white">
                <Search className="w-6 h-6" />
                Find an Organ
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-10"
          >
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isDark ? "bg-white/10" : "bg-black/10"
              }`}
            >
              <ShieldPlus className="w-5 h-5 text-green-400" />
              <span className="text-sm">100% Secure</span>
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isDark ? "bg-white/10" : "bg-black/10"
              }`}
            >
              <HeartPulse className="w-5 h-5 text-red-400" />
              <span className="text-sm">Verified Hospitals</span>
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isDark ? "bg-white/10" : "bg-black/10"
              }`}
            >
              <Sparkles className="w-5 h-5 text-green-400" />
              <span className="text-sm">AI-Powered Matching</span>
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isDark ? "bg-white/10" : "bg-black/10"
              }`}
            >
              <Sparkles className="w-5 h-5 text-green-400" />
              <span className="text-sm">AI-driven medical report analysis</span>
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                isDark ? "bg-white/10" : "bg-black/10"
              }`}
            >
              <Sparkles className="w-5 h-5 text-green-400" />
              <span className="text-sm">Personalized AI health tracking post-donation</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="md:w-1/2 flex justify-center relative"
        >
          <div className="relative w-full max-w-xl aspect-square">
            <Image
              src="/landing/whyChose.svg"
              alt="Organ Donation Visual"
              fill
              className="object-contain"
              priority
            />
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 left-20 w-16 h-16 bg-blue-500/20 rounded-full blur-xl"
            />
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-20 right-20 w-20 h-20 bg-red-500/20 rounded-full blur-xl"
            />
          </div>
        </motion.div>
      </div>

      {
        isDark ? (
            <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl" />
      </div>):""
      }
      
    </section>
  );
};

export default Hero;
