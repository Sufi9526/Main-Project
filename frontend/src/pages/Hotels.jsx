import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ItineraryDisplay from "../components/ItineraryDisplay";
const BASE_URL = import.meta.env.VITE_API_URL;

const Hotels = () => {
  const navigate = useNavigate();
  const [travelData, setTravelData] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [checkInTime, setCheckInTime] = useState("");
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  
  // New States for step and selection
  const [step, setStep] = useState('hotel'); // 'hotel', 'places', or 'itinerary'
  const [selectedPlaceIds, setSelectedPlaceIds] = useState([]);

  useEffect(() => {
    const savedData = localStorage.getItem("travelData");
    if (!savedData) {
      navigate("/");
      return;
    }

    const data = JSON.parse(savedData);
    setTravelData(data);
    fetchHotels(data.toLocation);
  }, [navigate]);

  const fetchHotels = async (location) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/hotels/${location}`);
      setHotels(response.data);
    } catch (err) {
      setError("Failed to load hotels");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleHotelSelect = (hotel) => {
    setSelectedHotel(hotel);
    // Pre-select all nearby places by default
    if (hotel.nearbyTouristPlaces) {
       setSelectedPlaceIds(hotel.nearbyTouristPlaces.map(place => place._id));
    } else {
       setSelectedPlaceIds([]);
    }
    setCheckInTime("");
    setItinerary(null);
    setStep('places');
  };

  const handleTogglePlace = (placeId) => {
    setSelectedPlaceIds(prev => 
      prev.includes(placeId) 
        ? prev.filter(id => id !== placeId)
        : [...prev, placeId]
    );
  };

  const handleGenerateItinerary = async () => {
    if (!selectedHotel || !checkInTime) {
      setError("Please select a hotel and enter check-out time");
      return;
    }
    
    if (selectedPlaceIds.length === 0) {
      setError("Please select at least one tourist place to generate an itinerary.");
      return;
    }

    setGenerating(true);
    setError("");

    try {
      const response = await axios.post(`${BASE_URL}/api/itinerary/generate-from-hotel`, 
        {
          hotelId: selectedHotel._id,
          checkInTime,
          numberOfDays: travelData.numberOfDays,
          selectedPlaceIds: selectedPlaceIds
        }
      );
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
        <p className="text-gray-600">Loading hotels...</p>
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
               {step === 'hotel' ? `Hotels in ${travelData.toLocation}` : 
                step === 'places' ? `Customize Your Visit from ${selectedHotel?.name}` :
                `Your Hotel-Based Itinerary`}
             </h2>
             <button
               onClick={() => {
                 if (step === 'hotel') {
                   navigate("/dashboard/tripplan/destination-options");
                 } else if (step === 'places') {
                   setStep('hotel');
                   setSelectedHotel(null);
                 } else if (step === 'itinerary') {
                   setStep('places');
                 }
               }}
               className="text-blue-600 hover:underline text-sm font-semibold mt-2 inline-block"
             >
               {step === 'hotel' ? "← Back to Options" : 
                step === 'places' ? "← Back to Hotels" : 
                "← Back to Selection"}
             </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
            {error}
          </div>
        )}

        {/* --- STEP 1: Hotels Section --- */}
        {step === 'hotel' && (
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800">
              Available Accommodations
            </h3>
            <p className="text-gray-600 text-sm">
              Choose your stay for {travelData.numberOfDays}{" "}
              {parseInt(travelData.numberOfDays) === 1 ? "day" : "days"}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((hotel) => (
                <div
                  key={hotel._id}
                  onClick={() => handleHotelSelect(hotel)}
                  className={`cursor-pointer rounded-2xl p-5 border transition shadow-sm hover:shadow-lg bg-white border-gray-200 hover:-translate-y-1`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-bold text-gray-800">
                      {hotel.name}
                    </h4>
                    <span className="text-yellow-500 text-sm">
                      {"⭐".repeat(Math.floor(hotel.rating))}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mb-3">
                    📍 {hotel.address}
                  </p>

                  <div className="space-y-2 text-sm text-gray-700 font-medium">
                    <div className="text-blue-600">💰 ₹{hotel.pricePerNight} <span className="text-gray-500 font-normal">/night</span></div>

                    {hotel.nearbyTouristPlaces && (
                      <div className="text-purple-600 cursor-pointer">
                        🗺️ {hotel.nearbyTouristPlaces.length} nearby places
                      </div>
                    )}
                  </div>

                  {hotel.amenities?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {hotel.amenities.map((amenity, idx) => (
                        <span
                          key={idx}
                          className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- STEP 2: Places Selection & Check-in --- */}
        {step === 'places' && selectedHotel && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Check-in Card */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                When are you checking out?
              </h3>
              <p className="text-sm text-gray-500 mb-4">Your daily itinerary will start based on this time.</p>
              
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <label
                    htmlFor="checkInTime"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Check-out Time
                  </label>
                  <input
                    type="time"
                    id="checkInTime"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    className="border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors w-full sm:w-48 bg-gray-50 text-gray-800"
                  />
                </div>

                 <button
                  onClick={handleGenerateItinerary}
                  disabled={generating || selectedPlaceIds.length === 0 || !checkInTime}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-purple-600 text-white font-bold shadow hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {generating ? "Generating..." : "Generate Itinerary"}
                </button>
              </div>
            </div>

            {/* Places Grid */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Select Nearby Places ({selectedPlaceIds.length} / {selectedHotel.nearbyTouristPlaces?.length || 0} selected)
              </h3>
              <p className="text-gray-600 text-base mb-6">
                These places are near {selectedHotel.name}. Select the ones you want to visit.
              </p>

              {selectedHotel.nearbyTouristPlaces && selectedHotel.nearbyTouristPlaces.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedHotel.nearbyTouristPlaces.map((place) => {
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

                        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                          {place.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-10 bg-white rounded-2xl border border-dashed border-gray-300">
                  No nearby tourist places found for this hotel.
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- STEP 3: Itinerary --- */}
        {step === 'itinerary' && itinerary && (
          <div className="space-y-4 animate-in fade-in duration-500">
             <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-blue-900 mb-2">Your Hotel-Based Itinerary</h3>
                <p className="text-blue-800 text-base">
                  {travelData.numberOfDays}-day itinerary starting and ending at <strong>{itinerary.hotel.name}</strong> each day.
                </p>
             </div>

            <ItineraryDisplay itinerary={itinerary} isHotelBased hideSaveButton={false} />
            
            <div className="text-center pt-8 pb-10">
              <button
                onClick={() => setStep('places')}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
              >
                ← Edit Place Selection & Time
              </button>
            </div>
          </div>
        )}

        {generating && step === 'places' && (
           <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-6">
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
              <p className="text-white text-xl font-bold">
                Creating your personalized hotel itinerary...
              </p>
           </div>
        )}

      </div>
    </div>
  );
};

export default Hotels;
