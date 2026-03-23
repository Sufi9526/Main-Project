import { useState } from "react";

export default function ManageData() {
  const [selected, setSelected] = useState(null);

  const buttonBase =
    "px-6 py-3 rounded-xl font-semibold transition-all";
  const active =
    "ring-2 ring-offset-2 ring-blue-500 scale-105";
  const inactive =
    "hover:scale-105";

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
        Manage Travel Planner Data
      </h1>

      {/* Selection Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <button
          onClick={() => setSelected("hotels")}
          className={`${buttonBase} bg-blue-600 text-white ${
            selected === "hotels" ? active : inactive
          }`}
        >
          🏨 Hotels
        </button>

        <button
          onClick={() => setSelected("places")}
          className={`${buttonBase} bg-green-600 text-white ${
            selected === "places" ? active : inactive
          }`}
        >
          📍 Tourist Places
        </button>

        <button
          onClick={() => setSelected("modes")}
          className={`${buttonBase} bg-purple-600 text-white ${
            selected === "modes" ? active : inactive
          }`}
        >
          🚆 Travel Modes
        </button>
      </div>

      {/* Conditional Forms */}
      {selected && (
        <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-10">
          <h2 className="text-2xl font-semibold text-gray-800 capitalize">
            Manage {selected}
          </h2>

          {/* Add Form */}
          <div className="border rounded-xl p-6 bg-gray-50">
            <h3 className="text-lg font-bold mb-4 text-green-700">
              ➕ Add New
            </h3>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
              />

              {selected !== "modes" && (
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
                />
              )}

              {selected === "hotels" && (
                <input
                  type="number"
                  placeholder="Price per night"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
                />
              )}

              <button className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition">
                Add {selected.slice(0, -1)}
              </button>
            </div>
          </div>

          {/* Delete Section */}
          <div className="border rounded-xl p-6 bg-red-50">
            <h3 className="text-lg font-bold mb-4 text-red-700">
              🗑️ Delete
            </h3>

            <input
              type="text"
              placeholder="Enter ID or Name to delete"
              className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
            />

            <button className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition">
              Delete {selected.slice(0, -1)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
