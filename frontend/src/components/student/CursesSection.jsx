import React, { useContext } from "react";
import { Link } from "react-router-dom";
import CourseCard from "./CourseCard";
import { AppContext } from "../../context/AppContext";

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Heading */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Learn From The Best
        </h2>

        <p className="text-sm md:text-base text-gray-500 mt-3 leading-relaxed">
          Discover our top-rated courses across various categories. From coding
          and testing to business and wellness, our courses are crafted to
          deliver real results.
        </p>
      </div>

      {/* Courses Grid */}
      <div
        className="grid gap-6 mt-10 
        grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-3 
        xl:grid-cols-4"
      >
        {(allCourses || []).slice(0, 4).map((course) => (
          <div
            key={course._id || course.id}
            className="transition duration-300 hover:scale-105"
          >
            <CourseCard course={course} />
          </div>
        ))}
      </div>

      {/* Button */}
      <div className="text-center mt-10">
        <Link
          to="/course-list"
          onClick={() => window.scrollTo(0, 0)}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition duration-300"
        >
          Explore All Courses 🚀
        </Link>
      </div>
    </div>
  );
};

export default CoursesSection;
