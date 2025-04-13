/* eslint-disable @typescript-eslint/no-require-imports */
"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  FaFacebook,
  FaDribbble,
  FaInstagram,
  FaLinkedin,
  FaGoogle,
} from "react-icons/fa";

export default function Profile() {
  const [darkMode] = useState(true);

  // Dummy user details
  const userDetails = {
    fullName: "Dr. Aashish Kumar",
    email: "aashish.kumar@example.com",
    phoneNo: "+91-9876543210",
  };

  return (
    <div
      className={`p-6 min-h-screen relative ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Profile Card */}
      <div
        className={`w-full max-w-xl mx-auto rounded-lg shadow-lg p-6 cursor-pointer overflow-hidden border-l-4 transition-all mb-8 ${
          darkMode
            ? "bg-gray-800 border-purple-500 text-white"
            : "bg-white border-purple-300 hover:border-purple-700 text-gray-900"
        }`}
      >
        <div className="flex flex-col items-center">
         
          <span className="bg-gray-500 text-white px-4 py-1 rounded text-sm">
            Admin
          </span>
          <h5 className="text-lg font-semibold mt-2">
            {userDetails.fullName || "User"}
          </h5>
          <span className="text-gray-500 dark:text-gray-400">
            Organ Donor/Recipient
          </span>
          <p
            className={`text-center text-sm mt-3 px-6 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Thank you for joining our platform. Together, we can make a
            difference by saving lives and sharing inspiring stories.
          </p>
          <ul className="flex space-x-4 mt-4 text-purple-600 dark:text-purple-400">
            <li>
              <FaFacebook className="text-2xl hover:text-purple-800 dark:hover:text-purple-300 transition" />
            </li>
            <li>
              <FaDribbble className="text-2xl hover:text-purple-800 dark:hover:text-purple-300 transition" />
            </li>
            <li>
              <FaInstagram className="text-2xl hover:text-purple-800 dark:hover:text-purple-300 transition" />
            </li>
            <li>
              <FaLinkedin className="text-2xl hover:text-purple-800 dark:hover:text-purple-300 transition" />
            </li>
            <li>
              <FaGoogle className="text-2xl hover:text-purple-800 dark:hover:text-purple-300 transition" />
            </li>
          </ul>
          <div className="mt-4 flex space-x-3">
            <a href={`mailto:${userDetails.email}`}>
              <button className="border border-purple-700 text-purple-700 dark:text-purple-400 px-4 py-2 rounded-md hover:bg-purple-700 hover:text-white dark:hover:bg-purple-400 dark:hover:text-gray-900 transition">
                Message
              </button>
            </a>
            <a href={`tel:${userDetails.phoneNo}`}>
              <button className="bg-purple-700 text-white dark:bg-purple-400 dark:text-gray-900 px-4 py-2 rounded-md hover:bg-purple-800 dark:hover:bg-purple-500 transition">
                Contact
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}