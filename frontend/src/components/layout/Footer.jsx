import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaPlane } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-14 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-ocean flex items-center justify-center  bg-[#1D8FA7]">
                <FaPlane className="w-5 h-5 text-white " />
              </div>
              <span className="font-sans text-xl font-semibold">Travel Planner</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed font-serif">
              Plan your perfect journey with our intelligent travel planner. Discover, organize, and experience the world like never before.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-500 font-serif">
              <li><Link to="/" className="hover:text-sidebar-primary transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-sidebar-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-sidebar-primary transition-colors">Contact</Link></li>
              <li><Link to="/dashboard" className="hover:text-sidebar-primary transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold mb-4">Features</h4>
            <ul className="space-y-3 text-sm text-gray-500 font-serif">
              <li>Trip Planning</li>
              <li>Saved Destinations</li>
              <li>Travel Itineraries</li>
              <li>Budget Tracking</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-gray-500 font-serif">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sidebar-primary" />
                sufi@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sidebar-primary" />
                +91 1234567890
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sidebar-primary" />
                    Sufi
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-sidebar-border text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Wanderlust. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
