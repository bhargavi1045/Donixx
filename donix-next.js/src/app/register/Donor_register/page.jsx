"use client";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FaUserShield } from "react-icons/fa";
import axios from "axios";

export default function UserRegistrationForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNo: "",
    address: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

 

  return (
    <div
      className={`min-h-screen flex justify-center items-center p-4 md:p-8 transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <ToastContainer theme={darkMode ? "dark" : "light"} />
      <div
        className={`max-w-2xl w-full mx-auto p-6 shadow-2xl rounded-xl border mt-10 transition-colors duration-300 ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
        }`}
      >
        <h2
          className={`text-2xl sm:text-3xl font-bold w-full flex items-center justify-center gap-3 mb-6 ${
            darkMode ? "text-blue-300" : "text-blue-700"
          }`}
        >
          <FaUserShield className="text-3xl" /> User Registration
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name *"
              value={formData.fullName}
              onChange={handleChange}
              // className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              className={`w-full p-2 sm:p-3 border rounded-lg shadow-sm focus:ring-2 transition-all ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600 focus:ring-blue-500 hover:border-blue-400"
                  : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500 hover:border-blue-600"
              }`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={formData.email}
              onChange={handleChange}
              // className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              className={`w-full p-2 sm:p-3 border rounded-lg shadow-sm focus:ring-2 transition-all ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600 focus:ring-blue-500 hover:border-blue-400"
                  : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500 hover:border-blue-600"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <input
              type="tel"
              name="phoneNo"
              placeholder="Phone Number *"
              value={formData.phoneNo}
              onChange={handleChange}
              // className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              className={`w-full p-2 sm:p-3 border rounded-lg shadow-sm focus:ring-2 transition-all ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600 focus:ring-blue-500 hover:border-blue-400"
                  : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500 hover:border-blue-600"
              }`}
            />
            {errors.phoneNo && (
              <p className="text-red-500 text-sm mt-1">{errors.phoneNo}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="address"
              placeholder="Address *"
              value={formData.address}
              onChange={handleChange}
              // className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              className={`w-full p-2 sm:p-3 border rounded-lg shadow-sm focus:ring-2 transition-all ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600 focus:ring-blue-500 hover:border-blue-400"
                  : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500 hover:border-blue-600"
              }`}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password *"
              value={formData.password}
              onChange={handleChange}
              // className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              className={`w-full p-2 sm:p-3 border rounded-lg shadow-sm focus:ring-2 transition-all ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600 focus:ring-blue-500 hover:border-blue-400"
                  : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500 hover:border-blue-600"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full h-[44px] sm:h-[48px] p-2 sm:p-3 font-semibold rounded-lg transition-all cursor-pointer flex justify-center items-center ${
              darkMode
                ? "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-70"
                : "bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-70"
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Register"
            )}
          </button>
        </form>
      </div>
      <style jsx>{`
        .dot-loader {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .dot-loader::after {
          content: " ";
          display: inline-block;
          width: 6px;
          height: 6px;
          margin: 0 2px;
          background-color: white;
          border-radius: 50%;
          animation: dot-flash 1.4s infinite ease-in-out both;
        }
        .dot-loader::before {
          content: " ";
          display: inline-block;
          width: 6px;
          height: 6px;
          margin: 0 2px;
          background-color: white;
          border-radius: 50%;
          animation: dot-flash 1.4s infinite ease-in-out both;
          animation-delay: 0.2s;
        }
        @keyframes dot-flash {
          0%,
          80%,
          100% {
            opacity: 0;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
