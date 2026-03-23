import React from "react";

const Hero = () => {
  return (
    <section className="bg-linear-to-br from-sky-50 to-white">
      <div className="max-w-300 mx-auto px-6 py-20 flex flex-col-reverse md:flex-row items-center gap-12">
        
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Plan Your Perfect Trip <br />
            <span className="text-sky-600">Without Any Hassle</span>
          </h1>

          <p className="mt-5 text-gray-600 text-lg max-w-xl">
            Discover tourist places, hotels, and travel options in one place.
            Our smart travel planner helps you create customized trip plans
            based on your time and preferences.
          </p>

          {/* <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="px-6 py-3 bg-sky-600 text-white rounded-xl font-semibold hover:bg-sky-700 transition">
              Explore Destinations
            </button>

            <button className="px-6 py-3 border border-sky-600 text-sky-600 rounded-xl font-semibold hover:bg-sky-50 transition">
              Create Your Plan
            </button>
          </div> */}
        </div>

        {/* Right Image */}
        <div className="flex-1">
          <img
            src="/images/hero.png"
            alt="Travel Planner Illustration"
            className="w-full max-w-md mx-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
