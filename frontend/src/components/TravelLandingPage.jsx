import React, { useState } from 'react';
import { 
  FaPlane, 
  FaHotel, 
  FaCar, 
  FaMapMarkerAlt, 
  FaCalendarAlt,
  FaUsers,
  FaStar,
  FaCheckCircle,
  FaGlobeAmericas,
  FaMobileAlt,
  FaShieldAlt,
  FaChevronDown,
  FaSearch,
  FaPlay
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import './TravelLandingPage.css';

const TravelLandingPage = () => {
  const [search, setSearch] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    travelers: '1',
    tripType: 'vacation'
  });

  const destinations = [
    { id: 1, name: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1', rating: 4.8 },
    { id: 2, name: 'Paris, France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34', rating: 4.7 },
    { id: 3, name: 'Tokyo, Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf', rating: 4.9 },
    { id: 4, name: 'New York, USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9', rating: 4.6 },
  ];

  const features = [
    { icon: <FaGlobeAmericas />, title: 'Global Coverage', desc: 'Access to 100,000+ destinations worldwide' },
    { icon: <FaMobileAlt />, title: 'Mobile App', desc: 'Plan & manage trips on the go' },
    { icon: <FaShieldAlt />, title: 'Travel Insurance', desc: '24/7 support & comprehensive coverage' },
  ];

  const testimonials = [
    { name: 'Sarah Johnson', text: 'TripPlanner made our honeymoon unforgettable!', rating: 5 },
    { name: 'Mike Chen', text: 'Saved 30% on our family vacation. Highly recommended!', rating: 5 },
    { name: 'Emma Wilson', text: 'The itinerary suggestions were spot on!', rating: 4 },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for trips to ${search.destination}`);
  };

  return (
    <div className="travel-landing-page">
      {/* Hero Section */}
      <header className="hero-section">
        <nav className="navbar">
          <div className="nav-logo">
            <FaPlane className="logo-icon" />
            <span className="logo-text">TripPlanner</span>
          </div>
          <div className="nav-links">
            <a href="#destinations">Destinations</a>
            <a href="#features">Features</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#about">About</a>
            <button className="nav-btn">Sign In</button>
          </div>
        </nav>

        <div className="hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Plan Your Perfect <span className="highlight">Journey</span> With Ease
          </motion.h1>
          <p className="hero-subtitle">
            All-in-one travel planning platform. Flights, hotels, activities, and more in one place.
          </p>
          
          {/* Search Widget */}
          <motion.div 
            className="search-widget"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="trip-type">
              <button className={`type-btn ${search.tripType === 'vacation' ? 'active' : ''}`}>🎉 Vacation</button>
              <button className={`type-btn ${search.tripType === 'business' ? 'active' : ''}`}>💼 Business</button>
              <button className={`type-btn ${search.tripType === 'adventure' ? 'active' : ''}`}>🏔️ Adventure</button>
            </div>
            
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-group">
                <FaMapMarkerAlt className="search-icon" />
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  value={search.destination}
                  onChange={(e) => setSearch({...search, destination: e.target.value})}
                />
              </div>
              
              <div className="search-group">
                <FaCalendarAlt className="search-icon" />
                <input
                  type="date"
                  value={search.checkIn}
                  onChange={(e) => setSearch({...search, checkIn: e.target.value})}
                />
              </div>
              
              <div className="search-group">
                <FaCalendarAlt className="search-icon" />
                <input
                  type="date"
                  value={search.checkOut}
                  onChange={(e) => setSearch({...search, checkOut: e.target.value})}
                />
              </div>
              
              <div className="search-group">
                <FaUsers className="search-icon" />
                <select 
                  value={search.travelers}
                  onChange={(e) => setSearch({...search, travelers: e.target.value})}
                >
                  <option value="1">1 Traveler</option>
                  <option value="2">2 Travelers</option>
                  <option value="3">3 Travelers</option>
                  <option value="4">4 Travelers</option>
                  <option value="5+">5+ Travelers</option>
                </select>
              </div>
              
              <button type="submit" className="search-btn">
                <FaSearch /> Search Trips
              </button>
            </form>
          </motion.div>
          
          <div className="hero-stats">
            <div className="stat">
              <h3>50K+</h3>
              <p>Happy Travelers</p>
            </div>
            <div className="stat">
              <h3>150+</h3>
              <p>Countries</p>
            </div>
            <div className="stat">
              <h3>4.8</h3>
              <p>Average Rating</p>
            </div>
          </div>
        </div>
        
        <div className="scroll-indicator">
          <FaChevronDown />
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-header">
          <h2>Why Choose TripPlanner?</h2>
          <p>Everything you need for stress-free travel planning</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="feature-card"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="destinations-section" id="destinations">
        <div className="section-header">
          <h2>Popular Destinations</h2>
          <p>Top picks from our travel community</p>
        </div>
        
        <div className="destinations-grid">
          {destinations.map((destination) => (
            <motion.div 
              key={destination.id}
              className="destination-card"
              whileHover={{ scale: 1.05 }}
            >
              <div 
                className="destination-image"
                style={{ backgroundImage: `url(${destination.image})` }}
              >
                <div className="destination-overlay">
                  <span className="rating">
                    <FaStar /> {destination.rating}
                  </span>
                </div>
              </div>
              <div className="destination-info">
                <h3>{destination.name}</h3>
                <button className="explore-btn">Explore Now</button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Plan your trip in 3 simple steps</p>
        </div>
        
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <FaSearch className="step-icon" />
            <h3>Search & Discover</h3>
            <p>Find your perfect destination with our smart search</p>
          </div>
          
          <div className="step-line"></div>
          
          <div className="step">
            <div className="step-number">2</div>
            <FaCalendarAlt className="step-icon" />
            <h3>Plan & Customize</h3>
            <p>Create your itinerary with our planning tools</p>
          </div>
          
          <div className="step-line"></div>
          
          <div className="step">
            <div className="step-number">3</div>
            <FaPlane className="step-icon" />
            <h3>Book & Travel</h3>
            <p>Book everything in one place and start your journey</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section" id="testimonials">
        <div className="section-header">
          <h2>What Our Travelers Say</h2>
          <p>Join thousands of satisfied travelers</p>
        </div>
        
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              className="testimonial-card"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < testimonial.rating ? 'star-filled' : 'star-empty'} />
                ))}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <p className="testimonial-author">- {testimonial.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Your Adventure?</h2>
          <p>Download our app and get 20% off your first booking</p>
          <div className="cta-buttons">
            <button className="cta-btn primary">
              <FaPlay /> Download App
            </button>
            <button className="cta-btn secondary">
              Start Planning Free Trial
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <FaPlane /> TripPlanner
            </div>
            <p>Making travel planning simple, smart, and enjoyable for everyone.</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <a href="#destinations">Destinations</a>
            <a href="#features">Features</a>
            <a href="#testimonials">Reviews</a>
            <a href="#about">About Us</a>
          </div>
          
          <div className="footer-section">
            <h4>Services</h4>
            <a href="#flights">Flight Booking</a>
            <a href="#hotels">Hotel Reservations</a>
            <a href="#activities">Activities</a>
            <a href="#insurance">Travel Insurance</a>
          </div>
          
          <div className="footer-section">
            <h4>Contact</h4>
            <p>support@tripplanner.com</p>
            <p>+1 (555) 123-4567</p>
            <div className="social-icons">
              <span>📘</span>
              <span>📷</span>
              <span>🐦</span>
              <span>💼</span>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© 2024 TripPlanner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default TravelLandingPage;