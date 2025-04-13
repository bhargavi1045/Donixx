"use client";
import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoBagAddOutline } from "react-icons/io5";
import { RiFindReplaceLine } from "react-icons/ri";
import { VscLayoutActivitybarLeft } from "react-icons/vsc";
import { MdDomainVerification } from "react-icons/md";
import { IoMdLogOut, IoMdClose } from "react-icons/io";
import { FiMenu } from "react-icons/fi";
import Profile from "../../components/Hospital_Dashboard/Profile";
import OrganMatching from "../../components/Hospital_Dashboard/OrganMatching";
import Documentation from "../../components/Hospital_Dashboard/Documentation";
import StaffManagement from "../../components/Hospital_Dashboard/StaffManagement";
import { Verify } from "../../components/Hospital_Dashboard/Verify";
import Available from "../../components/Hospital_Dashboard/Available";
import { LogoutModal } from "../../components/User_dashboard/LogOutModal";
import Cookies from "js-cookie";

const Dashboard = () => {
  const [activeContent, setActiveContent] = useState("Today Tasks");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hospitalDetails, setHospitalDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

  // Fetch hospital details
  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    setDarkMode(storedDarkMode === "1");

    const fetchHospitalDetails = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          // Set dummy data if no token is found
          setHospitalDetails({
            hospitalName: "Apollo",
            address: "123 Dummy Street",
          });
          return;
        }

        const response = await fetch(
          "https://donix-org-aman.onrender.com/getHospitalDetails",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        setHospitalDetails(data.hospital);
      } catch (error) {
        console.error("Error fetching hospital details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalDetails();
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    window.location.href = "/Login";
  };

  // Content based on the active state
  const renderContent = () => {
    switch (activeContent) {
      case "Profile":
        return (
          <div className="text-gray-600">
            <Profile />
          </div>
        );
      case "Manage Organs":
        return (
          <div className="text-gray-600">
            <OrganMatching />
          </div>
        );
      case "Documentation":
        return (
          <div className="text-gray-600">
            <Documentation />
          </div>
        );
      case "Staff Management":
        return (
          <div className="text-gray-600">
            <StaffManagement />
          </div>
        );
      case "Verification":
        return (
          <div className="text-gray-600">
            <Verify />
          </div>
        );
      case "Available organ":
        return (
          <div className="text-gray-600">
            <Available />
          </div>
        );
      default:
        return (
          <Profile />
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900 text-white">
  {/* Sidebar */}
  <div
    className={`fixed top-0 left-0 z-10 w-64 h-screen p-6 shadow-lg transition-transform duration-300 ${
      isSidebarOpen ? "translate-x-0" : "-translate-x-full"
    } bg-gray-900 border-r border-gray-700 md:translate-x-0`}
  >
    {/* Close Button for Mobile */}
    <button
      className="md:hidden absolute top-4 right-4 text-gray-400"
      onClick={() => setIsSidebarOpen(false)}
    >
      <IoMdClose className="text-2xl" />
    </button>

    {/* Sidebar Content */}
    <div className="p-6 bg-gray-900 text-white">
      <ul className="space-y-6">
        <li
          onClick={() => {
            setActiveContent("Profile");
            setIsSidebarOpen(false); // Close sidebar on mobile
          }}
          className="flex items-center gap-4 text-gray-300 font-medium hover:text-blue-400 transition duration-300 cursor-pointer"
        >
          <FaUserCircle className="text-2xl text-gray-400" />
          <span className="text-lg">
            {hospitalDetails ? hospitalDetails.hospitalName : "Loading..."}
          </span>
        </li>
        <li
          onClick={() => {
            setActiveContent("Manage Organs");
            setIsSidebarOpen(false);
          }}
          className="flex items-center gap-4 text-gray-300 font-medium hover:text-blue-400 transition duration-300 cursor-pointer"
        >
          <IoBagAddOutline className="text-2xl text-gray-400" />
          <span className="text-lg">Manage Organs</span>
        </li>
        <li
          onClick={() => {
            setActiveContent("Documentation");
            setIsSidebarOpen(false);
          }}
          className="flex items-center gap-4 text-gray-300 font-medium hover:text-blue-400 transition duration-300 cursor-pointer"
        >
          <RiFindReplaceLine className="text-2xl text-gray-400" />
          <span className="text-lg">Documentation</span>
        </li>
        <li
          onClick={() => {
            setActiveContent("Staff Management");
            setIsSidebarOpen(false);
          }}
          className="flex items-center gap-4 text-gray-300 font-medium hover:text-blue-400 transition duration-300 cursor-pointer"
        >
          <VscLayoutActivitybarLeft className="text-2xl text-gray-400" />
          <span className="text-lg">Staff Management</span>
        </li>
      </ul>
      <hr className="my-6 border-gray-700" />
      <ul className="space-y-6">
        <li
          onClick={() => {
            setActiveContent("Available organ");
            setIsSidebarOpen(false);
          }}
          className="flex items-center gap-4 text-gray-400 hover:text-green-500 transition duration-300 cursor-pointer"
        >
          <MdDomainVerification className="text-2xl" />
          <span>Add details</span>
        </li>
        <li
          onClick={() => {
            setActiveContent("Verification");
            setIsSidebarOpen(false);
          }}
          className="flex items-center gap-4 text-gray-400 hover:text-green-500 transition duration-300 cursor-pointer"
        >
          <MdDomainVerification className="text-2xl" />
          <span>Verification</span>
        </li>
        <li
          onClick={() => setLogoutModalVisible(true)}
          className="flex items-center gap-4 text-gray-400 hover:text-red-600 transition duration-300 cursor-pointer"
        >
          <IoMdLogOut className="text-2xl" />
          <span>Logout</span>
        </li>
      </ul>
    </div>
  </div>

  {/* Mobile Menu Button */}
  {!isSidebarOpen && (
    <div className="fixed top-0 left-0 w-full h-9 z-50 flex justify-start md:hidden bg-gray-900">
      <button
        className="p-2 text-gray-300 focus:outline-none"
        onClick={() => setIsSidebarOpen(true)}
      >
        <FiMenu className="text-2xl" />
      </button>
    </div>
  )}

  {/* Main Content */}
  <div className="ml-0 md:ml-64 flex-1 p-6 overflow-y-auto">
    {renderContent()}
  </div>
  <LogoutModal
    isVisible={isLogoutModalVisible}
    onClose={() => setLogoutModalVisible(false)}
    onConfirm={handleLogout}
  />
</div>
  );
};

export default Dashboard;
