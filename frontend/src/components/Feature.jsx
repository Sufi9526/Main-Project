import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Calendar, Bookmark, Sparkles } from "lucide-react"; 
import { Button } from "../components/ui/button"
function Feature() {
  const features = [
    {
      icon: MapPin,
      title: "Discover Destinations",
      description: "Explore curated destinations and hidden gems around the world.",
    },
    {
      icon: Calendar,
      title: "Plan Your Trip",
      description: "Create detailed itineraries with our intuitive trip planner.",
    },
    {
      icon: Bookmark,
      title: "Save & Organize",
      description: "Bookmark your favorite places and organize your travel bucket list.",
    },
    {
      icon: Sparkles,
      title: "Smart Suggestions",
      description: "Get personalized recommendations based on your preferences.",
    },
  ];

  return (
    <section className="py-10 lg:py-12 bg-gray-50 ">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-sans text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to <span className="text-orange-400">Explore</span>
          </h2>
          <p className="text-gray-500">
            Powerful tools to plan, organize, and experience your dream destinations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 lg:p-8 rounded-2xl bg-white border border-gray-200 hover:border-teal-500 shadow-md hover:shadow-xl transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-teal-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="font-semibold text-lg text-black mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Feature;
