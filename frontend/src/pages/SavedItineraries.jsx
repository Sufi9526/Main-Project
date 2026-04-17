import axios from "axios";
import { useEffect, useState } from "react";
import ItineraryDisplay from "../components/ItineraryDisplay";
import { Trash2 } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL;

const SavedItineraries = () => {
    const [itineraries, setItineraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedId, setExpandedId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchSavedItineraries();
    }, []);

    // 🔥 GET USER FROM LOCAL STORAGE
    const getUser = () => {
        try {
            const userStr = localStorage.getItem("user");
            if (!userStr) return null;
            return JSON.parse(userStr);
        } catch (e) {
            console.error("User parse error");
            return null;
        }
    };

    // 🔥 SUPPORT BOTH LOGIN TYPES
    const getUserId = () => {
        const user = getUser();
        if (!user) return null;
        return user.uid || user._id || null;
    };

    // 🔥 FIXED FETCH FUNCTION
    const fetchSavedItineraries = async () => {
        try {
            const user = getUser();
            const userId = getUserId();

            if (!user || !userId) {
                setError("Please login to see your saved itineraries");
                setLoading(false);
                return;
            }

            console.log("Fetching:", userId, user.email);

            // ✅ NEW API CALL (IMPORTANT FIX)
            const response = await axios.get(
                `${BASE_URL}/api/itinerary/saved`,
                {
                    params: {
                        userId,
                        email: user.email
                    }
                }
            );

            setItineraries(response.data);
        } catch (err) {
            console.error("FETCH ERROR:", err);
            setError("Failed to fetch saved itineraries");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this itinerary?")) return;

        setDeletingId(id);
        try {
            await axios.delete(`${BASE_URL}/api/itinerary/${id}`);

            setItineraries(prev => prev.filter(it => it._id !== id));
            if (expandedId === id) setExpandedId(null);
        } catch (err) {
            console.error(err);
            alert("Failed to delete itinerary.");
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-600">Loading saved itineraries...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-6xl mx-auto px-4 space-y-8">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-gray-800">Saved Itineraries</h2>
                    <p className="text-gray-600">
                        View the trip plans you have saved.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
                        {error}
                    </div>
                )}

                {itineraries.length === 0 && !error ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            No Saved Itineraries
                        </h3>
                        <p className="text-gray-500">
                            You haven't saved any itineraries yet.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {itineraries.map((itinerary) => (
                            <div
                                key={itinerary._id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition cursor-pointer flex flex-col"
                                onClick={() =>
                                    setExpandedId(
                                        expandedId === itinerary._id ? null : itinerary._id
                                    )
                                }
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800 line-clamp-1">
                                                {itinerary.destination}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {new Date(itinerary.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                                                {itinerary.numberOfDays} Days
                                            </span>

                                            <button
                                                onClick={(e) => handleDelete(e, itinerary._id)}
                                                disabled={deletingId === itinerary._id}
                                                className="text-red-500 hover:text-red-700 p-2"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-sm text-gray-600">
                                        <p>⏱️ {itinerary.startTime}</p>
                                        <p>📍 {itinerary.totalPlaces || 0} places</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-3 text-center text-blue-600">
                                    {expandedId === itinerary._id
                                        ? "Collapse ↑"
                                        : "View ↓"}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {expandedId && (
                    <div className="mt-10 border-t pt-10">
                        <ItineraryDisplay
                            itinerary={{
                                itinerary: itineraries.find(i => i._id === expandedId).plans,
                                totalPlaces: itineraries.find(i => i._id === expandedId).totalPlaces,
                                hotel: itineraries.find(i => i._id === expandedId).hotel,
                                numberOfDays: itineraries.find(i => i._id === expandedId).numberOfDays,
                                location: itineraries.find(i => i._id === expandedId).destination,
                            }}
                            isHotelBased={!!itineraries.find(i => i._id === expandedId).hotel}
                            hideSaveButton={true}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedItineraries;