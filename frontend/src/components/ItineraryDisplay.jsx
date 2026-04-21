import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Edit, Save, X, Plus, PlusCircle, MinusCircle } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL;

const ItineraryDisplay = ({ 
  itinerary, 
  isHotelBased = false, 
  hideSaveButton = false,
  savedItineraryId = null,
  onUpdateSuccess = null
}) => {
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const [isEditing, setIsEditing] = useState(false);
  const [localPlans, setLocalPlans] = useState([]);

  useEffect(() => {
    if (itinerary && itinerary.itinerary) {
      setLocalPlans(JSON.parse(JSON.stringify(itinerary.itinerary)));
    }
  }, [itinerary]);

  const handleSaveOrUpdateItinerary = async () => {
    setSaving(true);
    setError("");

    try {
      if (savedItineraryId) {
        // Updating an existing saved itinerary
        await axios.put(`${BASE_URL}/api/itinerary/${savedItineraryId}`, {
          plans: localPlans,
          numberOfDays: localPlans.length,
          totalPlaces: localPlans.reduce((acc, day) => acc + (day.places ? day.places.length : 0), 0)
        });
        
        setSaveSuccess(true);
        setIsEditing(false);
        if (onUpdateSuccess) onUpdateSuccess();
      } else {
        // Saving a newly generated itinerary
        let userId = null;
        let email = null;
        const userStr = localStorage.getItem("user");

        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            userId = user.uid || user._id || user.id;
            email = user.email || null;
          } catch (e) {
            console.error("User parse error");
          }
        }

        if (!userId || !email) {
          setError("Please login to save the itinerary.");
          setSaving(false);
          return;
        }

        await axios.post(`${BASE_URL}/api/itinerary/save`, {
          userId,
          email,
          destination:
            itinerary.location ||
            (itinerary.hotel && itinerary.hotel.location) ||
            "Custom Destination",
          numberOfDays: localPlans.length,
          startTime: itinerary.startTime || itinerary.checkInTime || "09:00",
          hotel: itinerary.hotel || null,
          plans: localPlans,
          totalPlaces: localPlans.reduce((acc, day) => acc + (day.places ? day.places.length : 0), 0)
        });

        setSaveSuccess(true);
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
      setError(`Failed to ${savedItineraryId ? 'update' : 'save'} itinerary.`);
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePlace = (dayIndex, placeIndex) => {
    const newPlans = [...localPlans];
    newPlans[dayIndex].places.splice(placeIndex, 1);
    if (newPlans[dayIndex].places.length === 0) {
      newPlans[dayIndex].noPlaces = true;
    }
    setLocalPlans(newPlans);
  };

  const handleAddPlace = (dayIndex) => {
    const newPlans = [...localPlans];
    const newPlace = {
      name: "New Tourist Attraction",
      startTime: "10:00",
      duration: 1.5,
      description: "Description of the new place to visit.",
      category: "Attraction",
    };
    
    if (!newPlans[dayIndex].places) {
      newPlans[dayIndex].places = [newPlace];
      newPlans[dayIndex].noPlaces = false;
    } else {
      // If it's a hotel-based itinerary, insert before the return to hotel point
      const endPointIdx = newPlans[dayIndex].places.findIndex(p => p.isEndPoint);
      if (endPointIdx !== -1) {
        newPlans[dayIndex].places.splice(endPointIdx, 0, newPlace);
      } else {
        newPlans[dayIndex].places.push(newPlace);
      }
      newPlans[dayIndex].noPlaces = false;
    }
    setLocalPlans(newPlans);
  };

  const handleAddDay = () => {
    const nextDay = localPlans.length + 1;
    const newDay = {
      day: nextDay,
      places: [],
      noPlaces: true
    };
    setLocalPlans([...localPlans, newDay]);
  };

  const handleRemoveDay = (dayIndex) => {
    if (window.confirm(`Are you sure you want to remove Day ${localPlans[dayIndex].day}?`)) {
      const newPlans = localPlans.filter((_, idx) => idx !== dayIndex);
      // Re-index days
      const reindexedPlans = newPlans.map((day, idx) => ({
        ...day,
        day: idx + 1
      }));
      setLocalPlans(reindexedPlans);
    }
  };

  const handlePlaceChange = (dayIndex, placeIndex, field, value) => {
    const newPlans = [...localPlans];
    newPlans[dayIndex].places[placeIndex][field] = value;
    setLocalPlans(newPlans);
  };

  if (!localPlans || localPlans.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 text-lg">
        No itinerary available
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Top action bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <h2 className="text-xl font-bold text-gray-800">Your Trip Plan</h2>
        <div className="flex gap-3">
          {isEditing ? (
            <button 
              onClick={() => {
                setIsEditing(false);
                setLocalPlans(JSON.parse(JSON.stringify(itinerary.itinerary)));
              }}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium"
            >
              <X size={18} /> Cancel
            </button>
          ) : (
            <button 
              onClick={() => {
                setIsEditing(true);
                setSaveSuccess(false);
              }}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition font-medium"
            >
              <Edit size={18} /> Edit Plan
            </button>
          )}
        </div>
      </div>

      {localPlans.map((dayPlan, dayIdx) => (
        <div key={dayPlan.day || dayIdx} className={`bg-white rounded-2xl shadow-md p-6 ${isEditing ? 'border-2 border-blue-100' : ''}`}>
          {/* Day Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              Day {dayPlan.day}
            </h3>
            <div className="flex items-center gap-3">
              {isEditing && (
                <button
                  onClick={() => handleRemoveDay(dayIdx)}
                  className="flex items-center gap-1 px-3 py-1 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition text-xs font-semibold"
                  title="Remove this day"
                >
                  <MinusCircle size={14} /> Remove Day
                </button>
              )}
              <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1 rounded-full">
                Day {dayPlan.day}
              </span>
            </div>
          </div>

          {/* Places List */}
          <div className="space-y-4">
            {dayPlan.noPlaces || !dayPlan.places || dayPlan.places.length === 0 ? (
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
                  className={`flex gap-4 p-4 rounded-xl border transition relative group
                    ${
                      place.isStartingPoint
                        ? "border-blue-400 bg-blue-50"
                        : place.isEndPoint
                        ? "border-green-400 bg-green-50"
                        : "border-gray-200 bg-white"
                    } ${isEditing ? "hover:border-blue-300 bg-blue-50/20" : ""}`}
                >
                  {isEditing && (
                    <button 
                      onClick={() => handleRemovePlace(dayIdx, idx)}
                      className="absolute -right-2 -top-2 bg-red-100 text-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm hover:bg-red-200"
                      title="Remove place"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                  {/* Time Box */}
                  <div className="flex flex-col items-center min-w-[70px]">
                    {isEditing && !place.isStartingPoint && !place.isEndPoint ? (
                      <div className="space-y-2">
                        <div className="flex flex-col items-center">
                          <label className="text-[10px] text-gray-400 font-bold uppercase">Time</label>
                          <input 
                            type="time" 
                            value={place.startTime} 
                            onChange={(e) => handlePlaceChange(dayIdx, idx, "startTime", e.target.value)}
                            className="text-sm font-bold text-gray-800 border border-gray-300 rounded px-1 py-1 w-20 text-center focus:outline-none focus:border-blue-500 bg-white"
                          />
                        </div>
                        <div className="flex flex-col items-center">
                          <label className="text-[10px] text-gray-400 font-bold uppercase">Duration</label>
                          <input 
                            type="number" 
                            step="0.5"
                            value={place.duration} 
                            onChange={(e) => handlePlaceChange(dayIdx, idx, "duration", parseFloat(e.target.value))}
                            className="text-sm font-bold text-gray-800 border border-gray-300 rounded px-1 py-1 w-14 text-center focus:outline-none focus:border-blue-500 bg-white"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-sm font-bold text-gray-800">
                          {place.startTime}
                        </div>
                        {place.duration > 0 && (
                          <div className="mt-1 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                            {place.duration}h
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Place Info */}
                  <div className="flex-1 min-w-0">
                    {isEditing && !place.isStartingPoint && !place.isEndPoint ? (
                      <div className="space-y-2">
                        <input 
                          type="text"
                          value={place.name}
                          onChange={(e) => handlePlaceChange(dayIdx, idx, "name", e.target.value)}
                          className="text-lg font-semibold text-gray-800 w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500 bg-white"
                          placeholder="Place name"
                        />
                        <textarea 
                          value={place.description}
                          onChange={(e) => handlePlaceChange(dayIdx, idx, "description", e.target.value)}
                          className="text-gray-600 text-sm w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500 bg-white min-h-[60px]"
                          placeholder="Place description"
                        />
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            value={place.category}
                            onChange={(e) => handlePlaceChange(dayIdx, idx, "category", e.target.value)}
                            className="bg-purple-50 text-purple-700 text-xs font-medium px-3 py-1 rounded-full border border-purple-200 focus:outline-none focus:border-purple-500 w-32"
                            placeholder="Category"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <h4 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                          {place.isStartingPoint && <span>🏁 </span>}
                          {place.isEndPoint && <span>🏠 </span>}
                          {place.name}
                        </h4>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {place.description}
                        </p>
                        {place.category && (
                          <span className="inline-block bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-full">
                            {place.category}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
            
            {isEditing && (
              <button
                onClick={() => handleAddPlace(dayIdx)}
                className="w-full flex items-center justify-center gap-2 p-3 mt-4 border-2 border-dashed border-blue-200 rounded-xl text-blue-600 hover:bg-blue-50 transition font-medium"
              >
                <Plus size={18} /> Add Place to Day {dayPlan.day}
              </button>
            )}
          </div>
        </div>
      ))}

      {isEditing && (
        <button
          onClick={handleAddDay}
          className="w-full flex items-center justify-center gap-2 p-4 bg-white border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 hover:bg-gray-50 hover:border-blue-300 transition font-bold"
        >
          <PlusCircle size={24} /> Add Another Day
        </button>
      )}

      {/* Hotel note */}
      {isHotelBased && itinerary.hotel && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-yellow-800">
          💡 <strong>Note:</strong> All routes start and end at{" "}
          {itinerary.hotel.name}
        </div>
      )}

      {/* Summary */}
      {(itinerary.includedPlacesCount !== undefined ||
        itinerary.totalPlaces !== undefined) && (
        <div className="bg-gray-100 rounded-xl p-4 text-center font-semibold text-gray-700">
          Total Places Covered:{" "}
          {localPlans.reduce((acc, day) => acc + (day.places ? day.places.length : 0), 0)}
        </div>
      )}

      {/* Save Button */}
      {(!hideSaveButton || isEditing) && (
        <div className="flex flex-col items-center mt-8 space-y-3">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {saveSuccess ? (
            <div className="bg-green-100 text-green-700 font-semibold px-6 py-3 rounded-xl flex items-center gap-2">
              ✓ Itinerary {savedItineraryId ? 'Updated' : 'Saved'} Successfully!
            </div>
          ) : (
            <button
              onClick={handleSaveOrUpdateItinerary}
              disabled={saving}
              className={`${isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'} text-white font-bold py-3 px-8 rounded-xl shadow transition disabled:opacity-50 flex items-center gap-2`}
            >
              <Save size={20} />
              {saving ? "Saving..." : isEditing ? "Save Changes" : "Save Itinerary"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ItineraryDisplay;