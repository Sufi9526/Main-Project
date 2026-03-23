import { FaBus, FaTrain } from "react-icons/fa";
import { Card, CardContent, CardDescription, CardHeader } from '../components/ui/card';

function TravelOptions() {
  return (
<div>
  <div className="flex justify-center gap-16 px-10 py-24 flex-wrap">
    
    <Card className="w-64 rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white">
      
      <CardContent className="flex justify-center items-center pt-8">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100">
          <FaTrain className="text-4xl text-blue-600" />
        </div>
      </CardContent>

      <CardHeader className="text-center font-semibold text-lg text-gray-900">
        Train
      </CardHeader>

      <CardDescription className="px-5 pb-6 text-sm text-gray-600 text-center leading-relaxed">
        Comfortable, reliable rail travel with multiple class options and scenic routes.
        Ideal for medium to long-distance trips with amenities like onboard catering,
        sleeping berths, and spacious seating.
      </CardDescription>
    </Card>

    <Card className="w-64 rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white">
      
      <CardContent className="flex justify-center items-center pt-8">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100">
          <FaBus className="text-4xl text-blue-600" />
        </div>
      </CardContent>

      <CardHeader className="text-center font-semibold text-lg text-gray-900">
        Bus
      </CardHeader>

      <CardDescription className="px-5 pb-6 text-sm text-gray-600 text-center leading-relaxed">
        Flexible and affordable road travel with frequent departures and extensive
        last-mile connectivity. Perfect for short to medium distances with various
        operator choices.
      </CardDescription>
    </Card>

  </div>
</div>

  )
}

export default TravelOptions
