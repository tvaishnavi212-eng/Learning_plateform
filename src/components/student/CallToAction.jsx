import React from "react";
import { Link } from "react-router-dom";
import assets from "../../assets/assets";
const CallToAction = () => {
  return (
    <div className="flex flex-col items-center space-y-5 py-14 px-4 md:px-10 max-w-6xl mx-auto text-center">
      <h1 className="text-xl md:text-4xl text-gray-800 font-semibold">
        Learn anything ,anytime,anywhere
      </h1>
      <p className=" text-gray-500  sm:text-sm">
        Join our community of learners and start your journey today!
      </p>
      <div className=" flex item-center font-medium gap-6 mt-4 flex-wrap justify-center">
        <button className="px-10 py-3 rounded-md text-white bg-blue-600">
          Get Started
        </button>
        <button className="flex items-center gap-2">
          Learn more <img src={assets.arrow_icon} alt="Arrow_icon" />
        </button>
        <Link 
          to="/educator"
          className="px-10 py-3 rounded-md text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
        >
          Become an Educator
        </Link>
      </div>
    </div>
  );
};

export default CallToAction;
