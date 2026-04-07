import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SearchBar from "../../components/student/SearchBar";
import CourseCard from "../../components/student/CourseCard";
import { AppContext } from "../../context/AppContext";
import assets from "../../assets/assets"; // ✅ FIX

const CoursesList = () => {
  const navigate = useNavigate();
  const { allCourses } = useContext(AppContext);
  const { input } = useParams();

  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = [...allCourses];

      if (input) {
        const filtered = tempCourses.filter((item) =>
          item?.courseTitle?.toLowerCase().includes(input.toLowerCase()),
        );
        setFilteredCourses(filtered);
      } else {
        setFilteredCourses(tempCourses);
      }
    }
  }, [allCourses, input]); // ✅ FIX

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
            <CourseCard key={index} course={course} />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No courses found 😔
          </p>
        )}
      </div>
    </div>
  );
};

export default CoursesList;
