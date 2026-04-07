import React from "react";
import Hero from "../../components/student/Hero";
import Companies from "../../components/student/Companies";
import CursesSection from "../../components/student/CursesSection";
import TestimonialsSection from "../../components/student/TestimonislsSection";
import CallToAction from "../../components/student/CallToAction";
import Footer from "../../components/student/Footer";

const Home = () => {
  return (
    <div className="flex flex-col items-center space-y-7 text-center">
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
