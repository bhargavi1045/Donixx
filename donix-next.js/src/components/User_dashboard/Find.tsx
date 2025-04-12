import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

interface Organ {
  _id: string;
  hospitalName: string;
  hospitalId: string;
  organ: string;
  count: number;
  bloodGroup: string;
  price: number;
}

const Find = () => {
  const [organs, setOrgans] = useState([]);
  const [expandedHospital, setExpandedHospital] = useState<string | null>(null); // Tracks which hospital's dropdown is expanded
  const [selectedOrgan, setSelectedOrgan] = useState<Organ | null>(null); // Tracks the selected organ for the modal
  const [showModal, setShowModal] = useState(false); // Controls the visibility of the modal
  const [isSmallScreen, setIsSmallScreen] = useState(false); // Tracks if the screen is small




  return (
    <div className="p-6">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="border border-gray-300 p-3">Hospital Name</th>
            <th className="border border-gray-300 p-3">Organs Available</th>
            <th className="border border-gray-300 p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {[...new Set(organs.map((item: Organ) => item.hospitalName))].map(
            (hospitalName) => (
              <React.Fragment key={hospitalName}>
                <tr>
                  <td className="border border-gray-300 p-3">{hospitalName}</td>
                  <td className="border border-gray-300 p-3">
                    {organs
                      .filter((item: Organ) => item.hospitalName === hospitalName)
                      .map((item: Organ) => item.organ)
                      .join(", ")}
                  </td>
                  <td className="border border-gray-300 p-3 text-center">
                    <button
                      onClick={() => toggleDropdown(hospitalName)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                      {expandedHospital === hospitalName ? "Hide" : "View"}
                    </button>
                  </td>
                </tr>

                {expandedHospital === hospitalName && (
                  <tr>
                    <td colSpan={3} className="border border-gray-300 p-3">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-3">
                              Organ
                            </th>
                            <th className="border border-gray-300 p-3">
                              Count
                            </th>
                            <th className="border border-gray-300 p-3">
                              Blood Group
                            </th>
                            <th className="border border-gray-300 p-3">
                              Price (₹)
                            </th>
                            {!isSmallScreen && (
                              <th className="border border-gray-300 p-3">
                                Actions
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {organs
                            .filter(
                              (item: Organ) => item.hospitalName === hospitalName
                            )
                            .map((item: Organ) => (
                              <tr
                                key={item._id}
                                onClick={() =>
                                  isSmallScreen && handleOrganClick(item)
                                }
                                className={`${
                                  isSmallScreen
                                    ? "cursor-pointer hover:bg-gray-100"
                                    : ""
                                }`}
                              >
                                <td className="border border-gray-300 p-3">
                                  {item.organ}
                                </td>
                                <td className="border border-gray-300 p-3 text-center">
                                  {item.count}
                                </td>
                                <td className="border border-gray-300 p-3 text-center">
                                  {item.bloodGroup}
                                </td>
                                <td className="border border-gray-300 p-3 text-center">
                                  ₹{item.price}
                                </td>
                                {!isSmallScreen && (
                                  <td className="border border-gray-300 p-3 text-center">
                                    <button
                                      onClick={() => handleOrganClick(item)}
                                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                                    >
                                      Request
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            )
          )}
        </tbody>
      </table>

      {/* Modal Overlay */}
      {showModal && selectedOrgan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center text-black">
              Request Organ
            </h2>
            <p className="mb-6 text-center text-black">
              Are you sure you want to request the organ{" "}
              <strong>{selectedOrgan.organ}</strong> from{" "}
              <strong>{selectedOrgan.hospitalName}</strong>?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRequest}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Find;