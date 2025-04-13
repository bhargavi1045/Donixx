"use client";
import React, { useState,useEffect } from "react";
import { MdDomainVerification } from "react-icons/md";
import { IoMdLogOut, IoMdClose } from "react-icons/io";
import { FiMenu } from "react-icons/fi"; 
import AddEvent from "../../components/AdminDashboard/AddEvent";
import {List} from "../../components/AdminDashboard/List";
import RegulateBlogs from "../../components/AdminDashboard/RegulateBlogs";
import VerifyHospital from "../../components/AdminDashboard/verifyHospital"
import Profile from "../../components/AdminDashboard/Profile"

const Dashboard = () => {
  const [activeContent, setActiveContent] = useState("Verify Hospitals");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    window.location.href = "/Login";
  };

   useEffect(() => {
      // Retrieve dark mode preference
      setDarkMode(localStorage.getItem("darkMode") === "1");
   })

  const renderContent = () => {
    switch (activeContent) {
        case "Profile":
        return <div><Profile/>   </div>;
      case "Verify Hospitals":
        return <div><VerifyHospital/>   </div>;
      case "Regulate Blogs":
        return <div><RegulateBlogs/>  </div>;
      case "Verify Webinar":
        return <div><AddEvent/>  </div>;
      case "List of Organ Donated":
        return <div><List/>  </div>;
      default:
        return <div><Profile/></div>;
    }
  };

  return (
    <div
      className={`flex h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Sidebar */}
      <div
        className={`fixed top-0 z-2 left-0 w-64 h-screen p-6 shadow-lg transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
        } md:translate-x-0`}
      >
        {/* Close Button for Mobile */}
        <button
          className="md:hidden absolute top-4 right-4 text-gray-500 dark:text-gray-400"
          onClick={() => setIsSidebarOpen(false)}
        >
          <IoMdClose className="text-2xl" />
        </button>

        {/* Navigation */}
        <ul className="space-y-4">
          {[
            { icon: MdDomainVerification, text: "Profile", key: "Profile" },
            { icon: MdDomainVerification, text: "Verify Hospitals", key: "Verify Hospitals" },
            { icon: MdDomainVerification, text: "Regulate Blogs", key: "Regulate Blogs" },
            { icon: MdDomainVerification, text: "Verify Webinar", key: "Verify Webinar" },
            { icon: MdDomainVerification, text: "List of Organ Donated", key: "List of Organ Donated" },
          ].map(({ icon: Icon, text, key }) => (
            <li
              key={key}
              onClick={() => {
                setActiveContent(key);
                setIsSidebarOpen(false); // Close sidebar on selection
              }}
              className="flex items-center gap-3 cursor-pointer hover:text-blue-500"
            >
              <Icon className="text-2xl" />
              <span>{text}</span>
            </li>
          ))}
        </ul>

        {/* Logout */}
        <ul className="space-y-4 mt-4">
          <li
            onClick={() => setLogoutModalVisible(true)}
            className="flex items-center gap-3 cursor-pointer hover:text-red-500"
          >
            <IoMdLogOut className="text-2xl" />
            <span>Logout</span>
          </li>
        </ul>
      </div>

      {/* Mobile Menu Button */}
      {!isSidebarOpen && (
        <div
          className={`fixed top-0 left-0 w-full h-9 z-50 flex justify-start md:hidden ${
            darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"
          }`}
        >
          <button
            className="p-2 text-gray-700 dark:text-gray-300 focus:outline-none"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FiMenu className="text-2xl" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="ml-0 md:ml-64 sm:ml-12 flex-1 p-6 overflow-y-auto">
        {renderContent()}
      </div>

      {/* Logout Modal */}
      {isLogoutModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirm Logout</h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setLogoutModalVisible(false)}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;