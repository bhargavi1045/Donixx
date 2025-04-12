import React from "react";
import { Hospital, HeartPulse, UserPlus, AlertTriangle, Heart, Users } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    title: "Organ Transplant Centers",
    value: "529",
    timeframe: "Across India",
    icon: Hospital,
    color: "from-green-400 to-green-600",
  },
  {
    title: "Annual Organ Transplants",
    value: "18,378",
    timeframe: "Per year",
    icon: HeartPulse,
    color: "from-blue-400 to-blue-600",
  },
  {
    title: "New Organ Donors",
    value: "1099",
    timeframe: "Per year",
    icon: UserPlus,
    color: "from-purple-400 to-purple-600",
  },
  {
    title: "Patients Waiting for Organs",
    value: "49,745",
    timeframe: "Current waitlist",
    icon: Heart,
    color: "from-yellow-400 to-yellow-600",
  },
  {
    title: "Deaths Due to Organ Shortage",
    value: "20",
    timeframe: "Daily average",
    icon: AlertTriangle,
    color: "from-red-400 to-red-600",
  },
  {
    title: "Registered Organ Donors",
    value: "4,82,836+",
    timeframe: "Total pledges",
    icon: Users,
    color: "from-pink-400 to-pink-600",
  },
];

const Numbers = ({darkMode}) => {
  return (
    <section className="min-h-screen py-20 px-6 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Organ Donation Statistics (India)
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg text-gray-400 max-w-2xl mx-auto"
        >
          {/* organ donaiton statistics report as per NOTTO */}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {stats.map(({ title, value, timeframe, icon: Icon, color }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className={`p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:shadow-xl transition-all duration-300`}
          >
            <div
              className={`w-16 h-16 flex items-center justify-center rounded-xl bg-gradient-to-br ${color} mb-6 mx-auto`}
            >
              <Icon className="text-white w-7 h-7" />
            </div>
            <h3 className={`text-xl font-semibold mb-2 text-center ${darkMode? "text-white ":"text-black"}`}>{title}</h3>
            <p className={`text-4xl font-bold ${darkMode? "text-white ":"text-black"}  text-center mb-2`}>{value}</p>
            <p className="text-sm text-gray-400 text-center">{timeframe}</p>
          </motion.div>
        ))}
      </div>

      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-700/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="text-center text-gray-500 text-sm mt-16"
      >
        *Statistics based on NOTTO (National Organ & Tissue Transplant Organization) and recent health reports
      </motion.div>
    </section>
  );
};

export default Numbers;