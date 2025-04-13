import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const VerifyHospital = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    setDarkMode(storedDarkMode === "1");
  }, []);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get("https://donix-org-aman.onrender.com/admin/hospitals", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHospitals(response.data.hospitals);
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to fetch hospitals");
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, []);

  const approveHospital = async (hospitalId) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.put(
        `https://donix-org-aman.onrender.com/admin/hospital/verify?hospitalId=${hospitalId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
      setHospitals((prevHospitals) =>
        prevHospitals.filter((hospital) => hospital._id !== hospitalId)
      );
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to approve hospital");
    }
  };

  if (loading) {
    return <div className={darkMode ? "text-white" : "text-gray-900"}>Loading...</div>;
  }

  return (
    <div
      className={`min-h-screen p-4 transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="p-6 max-w-4xl">
        <h1
          className={`text-3xl font-semibold mb-6 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Unverified Hospitals
        </h1>
        {hospitals.length === 0 ? (
          <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
            No unverified hospitals found.
          </p>
        ) : (
          <>
            {/* Full-Screen View */}
            <div className="hidden md:block overflow-x-auto shadow-lg rounded-lg">
              <table
                className={`min-w-full border border-gray-300 rounded-lg ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
              >
                <thead>
                  <tr className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Hospital Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      City
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      State
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {hospitals.map((hospital) => (
                    <tr
                      key={hospital._id}
                      className={
                        darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                      }
                    >
                      <td className="px-6 py-4 text-sm">{hospital.hospitalName}</td>
                      <td className="px-6 py-4 text-sm">{hospital.city}</td>
                      <td className="px-6 py-4 text-sm">{hospital.state}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => approveHospital(hospital._id)}
                            className={`px-4 py-2 rounded-md transition ${
                              darkMode
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-green-500 hover:bg-green-600 text-white"
                            }`}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              toast.info(`Viewing details for ${hospital.hospitalName}`)
                            }
                            className={`px-4 py-2 rounded-md transition ${
                              darkMode
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-blue-500 hover:bg-blue-600 text-white"
                            }`}
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
  
            {/* Mobile View */}
            <div className="md:hidden space-y-4">
              {hospitals.map((hospital) => (
                <div
                  key={hospital._id}
                  className={`p-4 border rounded-lg shadow-md ${
                    darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                  }`}
                >
                  <h2 className="text-lg font-semibold">{hospital.hospitalName}</h2>
                  <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                    {hospital.city}, {hospital.state}
                  </p>
                  <div className="mt-3 flex space-x-3">
                    <button
                      onClick={() => approveHospital(hospital._id)}
                      className={`px-4 py-2 rounded-md transition ${
                        darkMode
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        toast.info(`Viewing details for ${hospital.hospitalName}`)
                      }
                      className={`px-4 py-2 rounded-md transition ${
                        darkMode
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyHospital;