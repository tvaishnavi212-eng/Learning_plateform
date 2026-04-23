import React from "react";
import assetssketch from "/src/assets/sktech.svg"; // make sure path is correct
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-cyan-100/70">
      <h1 className="md:text-5xl text-3xl relative font-bold text-gray-800 max-w-3xl mx-auto">
        Empower your future with the Course designed to{" "}
        <span className="text-blue-600">
          fit your choice of Software Development
        </span>
        <img
          src={assetssketch}
          alt="sketch"
          className="md:block hidden absolute -bottom-7 right-0"
        />
      </h1>

      <p className="max-w-2xl text-gray-600">
        Welcome to your learning journey in Software Development. Join our platform
        to master Frontend , Backend, and real-time projects.
        Learn from experts, practice with live test cases, and get ready to
        crack interviews with confidence.
      </p>
      <SearchBar />
    </div>
  );
};

export default Hero;
