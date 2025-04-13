import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const AddEvent = () => {
  const [webinars, setWebinars] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    setDarkMode(storedDarkMode === "1");

    // Fetch unverified webinars
    const fetchWebinars = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          toast.error("Authorization token is missing.");
          return;
        }

        const response = await axios.get("https://donix-org-aman.onrender.com/admin/webinar", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setWebinars(response.data.hospitals || []);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch webinars. Try again later.");
        setLoading(false);
      }
    };

    fetchWebinars();
  }, []);

  const approveWebinar = async (webinarId) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Authorization token is missing.");
        return;
      }

      const response = await axios.put(
        `https://donix-org-aman.onrender.com/admin/webinar/verify?webinarId=${webinarId}`,
        {},
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message);

      // Update the webinars list after approval
      setWebinars((prevWebinars) =>
        prevWebinars.filter((webinar) => webinar._id !== webinarId)
      );
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to approve webinar. Try again later."
      );
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
          Unverified Webinars
        </h1>
        {webinars.length === 0 ? (
          <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
            No unverified webinars found.
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
                      Webinar Title
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Added By
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {webinars.map((webinar) => (
                    <tr
                      key={webinar._id}
                      className={
                        darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                      }
                    >
                      <td className="px-6 py-4 text-sm">{webinar.title}</td>
                      <td className="px-6 py-4 text-sm">{webinar.date}</td>
                      <td className="px-6 py-4 text-sm">{webinar.addedBy}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => approveWebinar(webinar._id)}
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
                              toast.info(`Viewing details for ${webinar.title}`)
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
              {webinars.map((webinar) => (
                <div
                  key={webinar._id}
                  className={`p-4 border rounded-lg shadow-md ${
                    darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                  }`}
                >
                  <h2 className="text-lg font-semibold">{webinar.title}</h2>
                  <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                    {webinar.date}
                  </p>
                  <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                    Added By: {webinar.addedBy}
                  </p>
                  <div className="mt-3 flex space-x-3">
                    <button
                      onClick={() => approveWebinar(webinar._id)}
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
                        toast.info(`Viewing details for ${webinar.title}`)
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

export default AddEvent;