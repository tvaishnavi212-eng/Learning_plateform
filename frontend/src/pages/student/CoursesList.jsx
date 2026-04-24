import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SearchBar from "../../components/student/SearchBar";
import CourseCard from "../../components/student/CourseCard";
import assets, { dummyCourses } from "../../assets/assets"; // ✅ FIX

const CoursesList = () => {
  const navigate = useNavigate();
  const { input } = useParams();

  const [filteredCourses, setFilteredCourses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Hotkeys for navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Only handle hotkeys if we have courses
      if (!filteredCourses || filteredCourses.length === 0) return;
      
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setCurrentIndex((prev) => (prev + 1) % filteredCourses.length);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setCurrentIndex((prev) => (prev - 1 + filteredCourses.length) % filteredCourses.length);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        if (filteredCourses[currentIndex]) {
          const courseId = filteredCourses[currentIndex]._id || filteredCourses[currentIndex].id;
          navigate(`/course/${courseId}`);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [filteredCourses, navigate]);

  useEffect(() => {
    if (dummyCourses && dummyCourses.length > 0) {
      const tempCourses = [...dummyCourses];

      if (input) {
        const filtered = tempCourses.filter((item) =>
          item?.courseTitle?.toLowerCase().includes(input.toLowerCase()),
        );
        setFilteredCourses(filtered);
      } else {
        setFilteredCourses(tempCourses);
      }
    }
  }, [dummyCourses, input]); // ✅ FIX

  return (
    <div className="relative md:px-36 px-8 pt-20 text-left">
      <div className="flex md:flex-row flex-col gap-6 items-start justify-between w-full">
        <div>
          <h1 className="text-2xl font-semibold">Courses List</h1>

          <p className="text-gray-500">
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => navigate("/")}
            >
              Home
            </span>{" "}
            / <span>Course List</span>
          </p>
        </div>

        <SearchBar data={input} />
      </div>

      {/* 🔍 Search Tag */}
      {input && (
        <div className="flex items-center gap-2 mt-4">
          <p className="bg-blue-100 text-blue-600 px-3 py-1 rounded">{input}</p>
          <img
            src={assets.cross_icon}
            alt="clear"
            className="cursor-pointer w-4"
            onClick={() => navigate("/course-list")}
          />
        </div>
      )}

      {/* 📦 Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredCourses?.length > 0 ? (
          filteredCourses.map((course, index) => (
            <CourseCard 
              key={index} 
              course={course} 
              isSelected={index === currentIndex}
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No courses found 😔
          </p>
        )}
      </div>
      
      {/* Navigation Indicator */}
      {filteredCourses?.length > 0 && (
        <div className="fixed bottom-4 left-1/2 right-1/2 flex justify-center items-center gap-2 bg-black/50 text-white px-4 py-2 rounded-lg">
          <span className="text-sm">
            {currentIndex + 1} / {filteredCourses.length} - Use ← → to navigate, Enter to open
          </span>
        </div>
      )}
    </div>
  );
};

export default CoursesList;
