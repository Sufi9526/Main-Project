import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Map, Bookmark, PlusCircle, Compass } from "lucide-react";
import axios from "axios";

export default function DashboardHome() {
  const [user, setUser] = useState(null);
  const [savedTripsCount, setSavedTripsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userStr = localStorage.getItem("user");
        let currentUser = null;
        
        if (userStr) {
          currentUser = JSON.parse(userStr);
          setUser(currentUser);
        }

        if (currentUser) {
          // Attempt to fetch saved itineraries count
          const userId = currentUser._id || currentUser.id || currentUser.uid;
          
          if (userId) {
            const res = await axios.get(`/api/itinerary/saved/${userId}`);
            setSavedTripsCount(res.data.length);
          }
        }
      } catch (e) {
        console.error("Failed to load dashboard data", e);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const displayName = user 
    ? (user.displayName || user.fullName || user.name || "Traveler") 
    : "Traveler";

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 sm:p-10 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Welcome back, {displayName}! 👋
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Where would you like to go next? Your personal AI travel assistant is ready to help you plan your perfect getaway.
          </p>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Compass className="w-48 h-48 sm:w-64 sm:h-64 spin-slow" />
        </div>
      </div>

      {/* Quick Stats & Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Start New Trip Card */}
        <Link 
          to="/dashboard/tripplan" 
          className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
               <Map className="w-7 h-7 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Plan a New Trip</h2>
            <p className="text-gray-500">Generate a custom AI itinerary tailored to your exact preferences, travel mode, and dates.</p>
          </div>
          
          <div className="mt-8 flex items-center text-blue-600 font-semibold">
            <PlusCircle className="w-5 h-5 mr-2" /> Start Planning
          </div>
        </Link>

        {/* Saved Trips Card */}
        <Link 
          to="/dashboard/tripplan/saved-itineraries" 
          className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md hover:border-purple-200 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform flex-shrink-0">
               <Bookmark className="w-7 h-7 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Saved Itineraries</h2>
            <p className="text-gray-500">Access and review all your previously generated travel plans and saved trips.</p>
          </div>
          
          <div className="mt-8 flex items-end justify-between">
             <div className="flex items-center text-purple-600 font-semibold">
               View All
             </div>
             
             {!loading && (
                <div className="text-right">
                  <span className="block text-4xl font-black text-gray-900 leading-none">
                    {savedTripsCount}
                  </span>
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Saved Trips</span>
                </div>
             )}
          </div>
        </Link>
        
      </div>
    </div>
  );
}
