import { Bus, Globe, Hotel, MapPin, Train } from "lucide-react";

export default function AboutPage() {
  return (
    <div>
    
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white px-6 py-16">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            About Our Travel Planner
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Your smart companion for planning seamless, affordable, and memorable
            journeys. From discovering destinations to choosing the right travel
            options — we make trip planning simple.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to help travelers plan better trips with accurate
              information, smart recommendations, and a clean, easy-to-use
              interface. We focus on providing reliable travel options like trains,
              buses, hotels, and tourist places — all in one platform.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="h-14 mx-auto mb-4 flex items-center justify-center ">
              <Globe className=" w-64 text-blue-700 stroke-[2.5]" />
            </div>
            <p className="text-gray-700 leading-relaxed">
              We believe travel should be stress-free, transparent, and accessible
              for everyone — whether it’s a short weekend trip or a long vacation.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mb-24">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
            What We Offer
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">

            {/* Train */}
            <div className="bg-white rounded-2xl shadow-md p-6 text-center
                            hover:shadow-2xl hover:-translate-y-1
                            transition-all duration-300 h-full flex flex-col">
              <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-100">
                <Train className="w-7 h-7 text-blue-700 stroke-[2.5]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                Train Travel
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Comfortable and reliable rail travel options for long-distance journeys.
              </p>
            </div>

            {/* Bus */}
            <div className="bg-white rounded-2xl shadow-md p-6 text-center
                            hover:shadow-2xl hover:-translate-y-1
                            transition-all duration-300 h-full flex flex-col">
              <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-100">
                <Bus className="w-7 h-7 text-blue-700 stroke-[2.5]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                Bus Travel
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Affordable road travel with flexible routes and frequent services.
              </p>
            </div>

            {/* Hotel */}
            <div className="bg-white rounded-2xl shadow-md p-6 text-center
                            hover:shadow-2xl hover:-translate-y-1
                            transition-all duration-300 h-full flex flex-col">
              <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-100">
                <Hotel className="w-7 h-7 text-blue-700 stroke-[2.5]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                Hotels
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Stay options ranging from budget-friendly to premium hotels.
              </p>
            </div>

            {/* Tourist Places */}
            <div className="bg-white rounded-2xl shadow-md p-6 text-center
                            hover:shadow-2xl hover:-translate-y-1
                            transition-all duration-300 h-full flex flex-col">
              <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-100">
                <MapPin className="w-7 h-7 text-blue-700 stroke-[2.5]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                Tourist Places
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Explore popular attractions and hidden gems with ease.
              </p>
            </div>

          </div>
        </div>

        {/* Closing */}
        <div className="text-center bg-blue-600 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">
            Why Choose Us?
          </h2>
          <p className="max-w-3xl mx-auto text-blue-100 leading-relaxed">
            We combine simplicity, smart design, and reliable data to give you a
            smooth travel planning experience. No confusion — just clear choices
            for better journeys.
          </p>
        </div>

      </div>
    </div>
    </div>
  );
}
