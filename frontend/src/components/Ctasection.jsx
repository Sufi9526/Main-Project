import React from 'react';
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";

function Ctasection() {
  return (
    <div className="w-full ">
      <section className="relative py-6 lg:py-10 flex items-center justify-center text-center bg-[#1D8FA7] overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Ready to Start Your Adventure?
            </h1>
        
            <p className="text-lg lg:text-xl text-white/90 mb-10 leading-relaxed">
              Join thousands of travelers who plan their perfect trips with Wanderlust. 
              Your next adventure is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                variant="secondary" 
                size="lg" 
                className="bg-white text-[#1D8FA7] hover:bg-gray-100 px-8 py-6 text-lg rounded-md"
                asChild
              >
                <Link to="/auth" className="flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>

              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-md bg-transparent"
                asChild
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Ctasection;