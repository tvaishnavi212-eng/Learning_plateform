import React, { useEffect, useState } from "react";
import Hero from "../../components/student/Hero";
import Companies from "../../components/student/Companies";
import CursesSection from "../../components/student/CursesSection";
import TestimonialsSection from "../../components/student/TestimonislsSection";
import CallToAction from "../../components/student/CallToAction";
import Footer from "../../components/student/Footer";
import { useUnifiedAuth } from "../../components/auth/UnifiedAuthProvider";

const Home = () => {
  const { isAuthenticated, user } = useUnifiedAuth();
  const [showWelcome, setShowWelcome] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    // Check if user is newly signed up
    const accountCreated = localStorage.getItem('accountCreated');
    const accountCreationTime = localStorage.getItem('accountCreationTime');
    
    if (isAuthenticated && accountCreated && accountCreationTime) {
      const creationTime = new Date(accountCreationTime);
      const currentTime = new Date();
      const timeDiff = currentTime - creationTime;
      
      // Show welcome if account was created in the last 10 minutes
      if (timeDiff < 10 * 60 * 1000) {
        setShowWelcome(true);
        setIsNewUser(true);
        
        // Hide welcome after 30 seconds
        setTimeout(() => {
          setShowWelcome(false);
        }, 30000);
      }
    }
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col items-center space-y-7 text-center">
      {/* Welcome Banner for New Users */}
      {showWelcome && isNewUser && (
        <div className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-semibold">Welcome to Your Learning Journey, {user?.firstName || user?.fullName || 'Student'}!</h3>
                <p className="text-xs opacity-90">Start exploring courses and unlock your potential</p>
              </div>
            </div>
            <button 
              onClick={() => setShowWelcome(false)}
              className="text-white hover:text-gray-200 text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      <Hero />
      <Companies />
      <CursesSection />
      <TestimonialsSection />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Home;
