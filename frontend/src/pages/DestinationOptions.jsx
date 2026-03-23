import { useEffect, useState } from 'react';
import { CiCalendarDate } from "react-icons/ci";
import { HiOutlineMap, HiOutlineOfficeBuilding } from "react-icons/hi"; // New icons for variety
import { useNavigate } from 'react-router-dom';

const DestinationOptions = () => {
  const navigate = useNavigate();
  const [travelData, setTravelData] = useState(null);
  const [arrivalTime, setArrivalTime] = useState('');

  useEffect(() => {
    const savedData = localStorage.getItem('travelData');
    if (!savedData) {
      navigate('/');
      return;
    }

    const data = JSON.parse(savedData);
    setTravelData(data);

    if (data.selectedOption?.arrivalTime) {
      setArrivalTime(data.selectedOption.arrivalTime);
    }
  }, [navigate]);

  if (!travelData) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
        {/* Welcome Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Welcome to <span className="text-cyan-600">{travelData.toLocation}</span>!
          </h2>
          <p className="text-gray-500 mt-2">Your journey is all set. Let's plan the rest.</p>
        </div>

        {/* Journey Details Card */}
        <div className="bg-white border border-cyan-100 shadow-sm rounded-2xl overflow-hidden mb-12">
          <div className="bg-cyan-600 px-6 py-4 flex items-center gap-2 text-white">
            <CiCalendarDate className="text-2xl" />
            <h3 className="font-semibold text-lg">Journey Summary</h3>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
            {[
              ["Travel Mode", travelData.mode.toUpperCase()],
              ["Departure", `${travelData.fromLocation} (${travelData.selectedOption?.departureTime})`],
              ["Arrival", `${travelData.toLocation} (${arrivalTime})`],
              ["Duration", `${travelData.numberOfDays} ${travelData.numberOfDays === 1 ? 'Day' : 'Days'}`],
            ].map(([label, value], i) => (
              <div key={i} className="flex flex-col border-b border-gray-100 pb-2 md:border-none md:pb-0">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">{label}</span>
                <span className="text-gray-800 font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Options */}
        <div className="mb-14">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900">What's next?</h3>
            <p className="text-gray-600">Explore and customize your trip experience</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Tourist Places Card */}
            <button
              onClick={() => navigate('/dashboard/tripplan/tourist-places')}
              className="group relative bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-cyan-500 transition-all duration-300 text-left"
            >
              <div className="h-12 w-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-600 transition-colors">
                <HiOutlineMap className="text-2xl text-cyan-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-700">Tourist Places</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Discover the best spots, hidden gems, and create your custom sightseeing itinerary.
              </p>
            </button>

            {/* Hotels Card */}
            <button
              onClick={() => navigate('/dashboard/tripplan/hotels')}
              className="group relative bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-cyan-500 transition-all duration-300 text-left"
            >
              <div className="h-12 w-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-600 transition-colors">
                <HiOutlineOfficeBuilding className="text-2xl text-cyan-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-700">Hotels</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Find the perfect stay from luxury resorts to budget-friendly accommodations.
              </p>
            </button>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/dashboard/tripplan')}
            className="flex items-center gap-2 text-gray-500 hover:text-cyan-600 font-medium transition-colors py-2 px-4 rounded-full hover:bg-cyan-50"
          >
            <span>←</span> Start a New Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default DestinationOptions;