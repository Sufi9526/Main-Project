import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ItineraryDisplay from "../components/ItineraryDisplay";

const TouristPlaces = () => {
  const navigate = useNavigate();
  const [travelData, setTravelData] = useState(null);
  const [touristPlaces, setTouristPlaces] = useState([]);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  
  // New States for step and selection
  const [step, setStep] = useState('selection'); // 'selection' or 'itinerary'
  const [selectedPlaceIds, setSelectedPlaceIds] = useState([]);

  useEffect(() => {
    const savedData = localStorage.getItem("travelData");
    if (!savedData) {
      navigate("/");
      return;
    }

    const data = JSON.parse(savedData);
    setTravelData(data);
    
    // Instead of generateItinerary, fetch places first
    fetchTouristPlaces(data.toLocation);
  }, [navigate]);

  const fetchTouristPlaces = async (location) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/tourist-places/${location}`);
      setTouristPlaces(response.data);
      // Pre-select all by default
      setSelectedPlaceIds(response.data.map(place => place._id));
    } catch (err) {
      setError("Failed to load tourist places");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePlace = (placeId) => {
    setSelectedPlaceIds(prev => 
      prev.includes(placeId) 
        ? prev.filter(id => id !== placeId)
        : [...prev, placeId]
    );
  };

  const generateItinerary = async () => {
    if (!travelData) return;

    if (selectedPlaceIds.length === 0) {
      setError("Please select at least one tourist place to generate an itinerary.");
      return;
    }

    setGenerating(true);
    setError("");

    try {
      const arrivalTime = travelData.selectedOption?.arrivalTime || "09:00";

      const response = await axios.post("/api/itinerary/generate", {
        location: travelData.toLocation,
        startTime: arrivalTime,
        numberOfDays: travelData.numberOfDays,
        selectedPlaceIds: selectedPlaceIds
      });

      setItinerary(response.data);
      setStep('itinerary');
      
    } catch (err) {
      setError("Failed to generate itinerary");
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600">Loading tourist places...</p>
      </div>
    );
  }

  if (!travelData) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-10">
        {/* Header */}
        <div className="space-y-2 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {step === 'selection' ? `Select Places in ${travelData.toLocation}` : `Your Itinerary for ${travelData.toLocation}`}
            </h2>

            <button
              onClick={() => {
                if (step === 'itinerary') {
                  setStep('selection');
                } else {
                  navigate("/dashboard/tripplan/destination-options");
                }
              }}
              className="text-blue-600 hover:underline text-sm font-semibold mt-2 inline-block"
            >
              {step === 'itinerary' ? "← Back to Selection" : "← Back to Options"}
            </button>
          </div>
          
          {step === 'selection' && (
             <button
              onClick={generateItinerary}
              disabled={generating || selectedPlaceIds.length === 0}
              className="bg-purple-600 text-white font-bold py-3 px-6 rounded-xl shadow hover:bg-purple-700 transition disabled:opacity-50"
            >
              {generating ? "Generating..." : "Generate Itinerary"}
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
            {error}
          </div>
        )}

        {/* --- SELECTION STEP --- */}
        {step === 'selection' && (
          <div className="space-y-6 mt-6">
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">
                Customize Your Visit ({selectedPlaceIds.length} / {touristPlaces.length} selected)
              </h3>
              <p className="text-gray-600 text-base mt-2">
                Select the places you'd like to visit. We will build your {travelData.numberOfDays}-day itinerary based on your selections.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {touristPlaces.map((place) => {
                const isSelected = selectedPlaceIds.includes(place._id);
                return (
                  <div
                    key={place._id}
                    onClick={() => handleTogglePlace(place._id)}
                    className={`rounded-2xl shadow-md p-5 flex flex-col justify-between transition cursor-pointer border-2
                      ${isSelected ? 'border-purple-600 bg-purple-50' : 'border-transparent bg-white hover:shadow-lg hover:-translate-y-1'}`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {place.category}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-yellow-500 text-sm">
                          {"⭐".repeat(Math.floor(place.popularity / 2))}
                        </span>
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-colors ${isSelected ? 'bg-purple-600 border-purple-600' : 'border-gray-300 bg-white'}`}>
                           {isSelected && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                        </div>
                      </div>
                    </div>

                    <h4 className="text-lg font-bold text-gray-800 mb-2">
                      {place.name}
                    </h4>

                    <p className="text-gray-600 text-sm line-clamp-4 leading-relaxed">
                      {place.description}
                    </p>
                  </div>
                );
              })}
            </div>
            {touristPlaces.length === 0 && (
              <div className="text-center text-gray-500 py-10 bg-white rounded-2xl border border-dashed border-gray-300">
                No tourist places found for this destination. Try a different location.
              </div>
            )}
          </div>
        )}

        {/* --- ITINERARY STEP --- */}
        {step === 'itinerary' && itinerary && (
           <div className="space-y-4 animate-in fade-in duration-500">
            <h3 className="text-2xl font-semibold text-gray-800">
              Your Customized Itinerary
            </h3>
            <p className="text-gray-600 text-sm">
              Your {travelData.numberOfDays}-day itinerary. It includes {itinerary.includedPlacesCount} places. 
              {itinerary.totalPlaces > itinerary.includedPlacesCount &&
                ` (${itinerary.totalPlaces - itinerary.includedPlacesCount} places couldn't fit)`}
            </p>

            <ItineraryDisplay itinerary={itinerary} />
            
            <div className="text-center pt-8 pb-10">
              <button
                onClick={() => setStep('selection')}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
              >
                ← Edit Place Selection
              </button>
            </div>
          </div>
        )}

        {generating && step === 'selection' && (
           <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-6">
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
              <p className="text-white text-xl font-bold">
                Generating your personalized itinerary...
              </p>
           </div>
        )}

      </div>
    </div>
  );
};

export default TouristPlaces;
