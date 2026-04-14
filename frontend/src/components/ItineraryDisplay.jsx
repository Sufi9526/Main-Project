import React, { useState } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;

const ItineraryDisplay = ({ itinerary, isHotelBased = false, hideSaveButton = false }) => {
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSaveItinerary = async () => {
    setSaving(true);
    setError("");

    try {
      let userId = null;
      const userStr = localStorage.getItem("user");

      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          userId = user._id || user.id || user.uid;
        } catch (e) { }
      }

      if (!userId) {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            userId = payload.id || payload._id;
          } catch (e) {
            console.error("Failed to parse token");
          }
        }
      }

      if (!userId) {
        setError("Please login to save the itinerary.");
        setSaving(false);
        return;
      }

      await axios.post(`${BASE_URL}/api/itinerary/save`, {
        userId,
        // When using hotel, destination location might be in hotel.location or travelData
        destination: itinerary.location || (itinerary.hotel && itinerary.hotel.location) || "Custom Destination",
        numberOfDays: itinerary.numberOfDays,
        startTime: itinerary.startTime || itinerary.checkInTime || "09:00",
        hotel: itinerary.hotel || null,
        plans: itinerary.itinerary,
        totalPlaces: itinerary.includedPlacesCount !== undefined ? itinerary.includedPlacesCount : itinerary.totalPlaces || 0
      });

      setSaveSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Failed to save itinerary.");
    } finally {
      setSaving(false);
    }
  };
  // No itinerary at all
  if (!itinerary || !itinerary.itinerary || itinerary.itinerary.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 text-lg">
        No itinerary available
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {itinerary.itinerary.map((dayPlan) => (
        <div
          key={dayPlan.day}
          className="bg-white rounded-2xl shadow-md p-6"
        >
          {/* Day Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              Day {dayPlan.day}
            </h3>
            <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1 rounded-full">
              Day {dayPlan.day}
            </span>
          </div>

          {/* Places List */}
          <div className="space-y-4">
            {/* EMPTY DAY */}
            {dayPlan.noPlaces || dayPlan.places.length === 0 ? (
              <div className="border border-dashed border-gray-300 rounded-xl p-6 bg-gray-50">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                  No tourist places to visit today
                </h4>
                <p className="text-gray-600 mb-3">
                  You can relax, explore nearby areas, go shopping, or enjoy
                  leisure activities.
                </p>
                <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                  Free Day
                </span>
              </div>
            ) : (
              dayPlan.places.map((place, idx) => (
                <div
                  key={idx}
                  className={`flex gap-4 p-4 rounded-xl border transition
                    ${place.isStartingPoint
                      ? "border-blue-400 bg-blue-50"
                      : place.isEndPoint
                        ? "border-green-400 bg-green-50"
                        : "border-gray-200 bg-white"
                    }`}
                >
                  {/* Time Box */}
                  <div className="flex flex-col items-center min-w-17.5">
                    <div className="text-sm font-bold text-gray-800">
                      {place.startTime}
                    </div>
                    {place.duration > 0 && (
                      <div className="mt-1 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                        {place.duration}h
                      </div>
                    )}
                  </div>

                  {/* Place Info */}
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800 mb-1">
                      {place.isStartingPoint && <span>🏁 </span>}
                      {place.isEndPoint && <span>🏠 </span>}
                      {place.name}
                    </h4>
                    <p className="text-gray-600 text-sm mb-2">
                      {place.description}
                    </p>
                    {place.category && (
                      <span className="inline-block bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-full">
                        {place.category}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ))}

      {/* Hotel note */}
      {isHotelBased && itinerary.hotel && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-yellow-800">
          💡 <strong>Note:</strong> All routes start and end at{" "}
          {itinerary.hotel.name}
        </div>
      )}

      {/* Summary */}
      {(itinerary.includedPlacesCount !== undefined || itinerary.totalPlaces !== undefined) && (
        <div className="bg-gray-100 rounded-xl p-4 text-center font-semibold text-gray-700">
          Total Places Covered: {itinerary.includedPlacesCount !== undefined ? itinerary.includedPlacesCount : itinerary.totalPlaces}
        </div>
      )}

      {/* Save Button */}
      {!hideSaveButton && (
        <div className="flex flex-col items-center mt-8 space-y-3">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {saveSuccess ? (
            <div className="bg-green-100 text-green-700 font-semibold px-6 py-3 rounded-xl">
              ✓ Itinerary Saved Successfully!
            </div>
          ) : (
            <button
              onClick={handleSaveItinerary}
              disabled={saving}
              className="bg-purple-600 text-white font-bold py-3 px-8 rounded-xl shadow hover:bg-purple-700 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Itinerary"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ItineraryDisplay;
