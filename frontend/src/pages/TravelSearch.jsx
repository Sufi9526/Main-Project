import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
const BASE_URL = import.meta.env.VITE_API_URL;

const TravelSearch = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    fromLocation: '',
    toLocation: '',
    mode: 'bus',
    numberOfDays: '',
  });
  const [travelOptions, setTravelOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.date || !formData.time || !formData.fromLocation || !formData.toLocation || !formData.numberOfDays) {
      setError('Please fill in all fields');
      return;
    }

    if (parseInt(formData.numberOfDays) <= 0) {
      setError('Number of days must be greater than 0');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${BASE_URL}/api/travel/search`, {
        date: formData.date,
        time: formData.time,
        fromLocation: formData.fromLocation,
        toLocation: formData.toLocation,
        mode: formData.mode,
      });

      setTravelOptions(response.data);
      setSearchPerformed(true);

      if (response.data.length === 0) {
        setError('No travel options found for the selected criteria. Please try different search terms.');
      }
    } catch (err) {
      setError('Failed to search travel options. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (option) => {
    // Save selected data to localStorage for next pages
    const travelData = {
      ...formData,
      selectedOption: option,
    };
    localStorage.setItem('travelData', JSON.stringify(travelData));
    navigate('destination-options');
  };

  return (
    <div className="travel-search">
      <div className=" max-w-300 mx-auto  border-2 border-gray-400 rounded-4xl p-8 mt-10">
        <h2 className="font-semibold">Plan Your Journey</h2>
        <p className="text-gray-400 mb-6 text-base leading-relaxed">Enter your travel details to find available options</p>
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="flex flex-col">
            <label className="text-black font-semibold mb-2 text-[0.95rem]" htmlFor="date">Travel Date</label>
            <input
              className="p-3 border-2 border-gray-400 rounded-lg text-base bg-white text-black transition-all duration-300 focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-white"
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              // min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-black font-semibold mb-2 text-[0.95rem]" htmlFor="time">Preferred Departure Time</label>
            <input
              className="p-3 border-2 border-gray-400 rounded-lg text-base bg-white text-black transition-all duration-300 focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-white"
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-black font-semibold mb-2 text-[0.95rem]" htmlFor="fromLocation">From</label>
            <input
              className="p-3 border-2 border-gray-400 rounded-lg text-base bg-white text-black transition-all duration-300 focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-white"
              type="text"
              id="fromLocation"
              name="fromLocation"
              value={formData.fromLocation}
              onChange={handleChange}
              placeholder=""
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-black font-semibold mb-2 text-[0.95rem]" htmlFor="toLocation">To</label>
            <input
              className="p-3 border-2 border-gray-400 rounded-lg text-base bg-white text-black transition-all duration-300 focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-white"
              type="text"
              id="toLocation"
              name="toLocation"
              value={formData.toLocation}
              onChange={handleChange}
              placeholder=""
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-black font-semibold mb-2 text-[0.95rem]" htmlFor="mode">Travel Mode</label>
            <select
              className="p-3 border-2 border-gray-400 rounded-lg text-base bg-white text-black transition-all duration-300 focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-white"
              id="mode" name="mode" value={formData.mode} onChange={handleChange} required>
              <option value="bus">Bus</option>
              <option value="train">Train</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-black font-semibold mb-2 text-[0.95rem]" htmlFor="numberOfDays">Number of Days</label>
            <input
              className="p-3 border-2 border-gray-400 rounded-lg text-base bg-white text-black transition-all duration-300 focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-white"
              type="number"
              id="numberOfDays"
              name="numberOfDays"
              value={formData.numberOfDays}
              onChange={handleChange}
              placeholder=""
              min="1"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          <Button type="submit" disabled={loading} className="w-full col-span-full">
            {loading ? 'Searching...' : 'Search Travel Options'}
          </Button>

        </form>

        {searchPerformed && travelOptions.length > 0 && (
          <div className="mt-12">
            <h3 className="font-semibold">Available Travel Options</h3>
            <p className="text-[#B0B0B0] text-base mb-4">Select one of the following options:</p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 mt-6">
              {travelOptions.map((option) => (
                <div key={option._id} className="border-2 border-gray-500 rounded-xl p-6 bg-blue-400 transition-all duration-300 hover:-translate-y-1.25 hover:border-gray-800">
                  <div className="flex justify-between items-center mb-4">
                    <span className=" bg-cyan-400 text-[#0A0A1A] px-3 py-1 rounded-full text-[0.85rem] font-bold">{option.mode.toUpperCase()}</span>
                    <span className="text-gray-900 font-semibold text-[0.95rem]">{option.operatorName}</span>
                  </div>
                  <div className="option-details">
                    <div className="flex items-center gap-4 mb-4">
                      <div>
                        <span className="text-black">Departure:</span>
                        <span className="text-white text-[1.1rem] font-semibold block">{option.departureTime}</span>
                      </div>
                      <div className="ext-xl text-black mx-2">→</div>
                      <div>
                        <span className="text-black">Arrival:</span>
                        <span className="text-white text-[1.1rem] font-semibold block">{option.arrivalTime}</span>
                      </div>
                    </div>
                    <div className="text-[#585757] my-2 text-[0.95rem]">Duration: {option.travelDuration}</div>
                    <div className="text-[#585757] my-2 text-[0.95rem]">Available Seats: {option.availableSeats}</div>
                    <div className="text-cyan-800 text-[1.3rem] font-bold my-2">₹{option.price}</div>
                  </div>
                  <Button
                    className="w-full col-span-full"
                    onClick={() => handleSelectOption(option)}
                  >
                    Select This Option
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelSearch;  