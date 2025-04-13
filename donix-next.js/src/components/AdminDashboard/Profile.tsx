/* eslint-disable @typescript-eslint/no-require-imports */
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  FaFacebook,
  FaDribbble,
  FaInstagram,
  FaLinkedin,
  FaGoogle,
} from "react-icons/fa";
import Cookies from "js-cookie";

interface UserDetails {
  fullName: string;
  email: string;
  phoneNo: string;
  [key: string]: unknown; 
}


export default function Profile() {
  const [darkMode, setDarkMode] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {

    const storedDarkMode = Cookies.get("darkMode");
    setDarkMode(storedDarkMode === "1");


    const fetchUserDetails = async () => {
      try {
        
        const token = Cookies.get("token");

        if (!token) {
          setError("Authorization token is missing. Please log in.");
          setLoading(false);
          return;
        }

        // Make the API request to fetch user details
        const response = await fetch("https://donix-org-aman.onrender.com/getDetails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch user details");
        }

        const data = await response.json();
        setUserDetails(data.user); 
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
    return <p>Loading user details...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  // const blogs = [
  //   {
  //     id: 1,
  //     title: "My Journey as an Organ Donor",
  //     description:
  //       "Sharing my experience of becoming an organ donor and how it changed my perspective on life.",
  //     date: "March 25, 2025",
  //   },
  //   {
  //     id: 2,
  //     title: "Receiving a Life-Saving Organ",
  //     description:
  //       "A heartfelt story of how an organ transplant gave me a second chance at life.",
  //     date: "March 20, 2025",
  //   },
  //   {
  //     id: 3,
  //     title: "The Importance of Organ Donation",
  //     description:
  //       "Why everyone should consider registering as an organ donor and the impact it can have.",
  //     date: "March 15, 2025",
  //   },
  // ];
 

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
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyzK2fuK3gDNJMRMKGHwHXfyqd6X1pL4lAxg&s"
            alt="Profile"
            width={96}
            height={96}
            className="rounded-full mb-3"
          />
          <span className="bg-gray-500 text-white px-4 py-1 rounded text-sm">
            Admin
          </span>
          <h5 className="text-lg font-semibold mt-2"> {userDetails?.fullName || "User"}</h5>
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
          <a href={`mailto:${userDetails?.email}`}>
  <button className="border border-purple-700 text-purple-700 dark:text-purple-400 px-4 py-2 rounded-md hover:bg-purple-700 hover:text-white dark:hover:bg-purple-400 dark:hover:text-gray-900 transition">
    Message
  </button>
</a>
            <a href={`tel:${userDetails?.phoneNo}`}>
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