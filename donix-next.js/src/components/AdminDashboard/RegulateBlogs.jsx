import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const RegulateBlogs = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    setDarkMode(storedDarkMode === "1");
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get("https://donix-org-aman.onrender.com/getArticles", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setArticles(response.data.articles);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch articles");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const markSensitive = async (articleId) => {
    try {
      const token = Cookies.get("token");
      const response = await axios.put(
        `https://donix-org-aman.onrender.com/updateSensitive?id=${articleId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
      setArticles((prevArticles) =>
        prevArticles.filter((article) => article._id !== articleId)
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark article as sensitive");
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
          Approve Sensitive Content
        </h1>
        {articles.length === 0 ? (
          <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
            No articles found.
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
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Author
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article) => (
                    <tr
                      key={article._id}
                      className={
                        darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                      }
                    >
                      <td className="px-6 py-4 text-sm">{article.title}</td>
                      <td className="px-6 py-4 text-sm">{article.addedBy}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => markSensitive(article._id)}
                            className={`px-4 py-2 rounded-md transition ${
                              darkMode
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-red-500 hover:bg-red-600 text-white"
                            }`}
                          >
                            Mark Sensitive
                          </button>
                          <button
                            onClick={() =>
                              toast.info(`Viewing details for ${article.title}`)
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
              {articles.map((article) => (
                <div
                  key={article._id}
                  className={`p-4 border rounded-lg shadow-md ${
                    darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                  }`}
                >
                  <h2 className="text-lg font-semibold">{article.title}</h2>
                  <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                    Author: {article.addedBy}
                  </p>
                  <div className="mt-3 flex space-x-3">
                    <button
                      onClick={() => markSensitive(article._id)}
                      className={`px-4 py-2 rounded-md transition ${
                        darkMode
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      }`}
                    >
                      Mark Sensitive
                    </button>
                    <button
                      onClick={() =>
                        toast.info(`Viewing details for ${article.title}`)
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

export default RegulateBlogs;