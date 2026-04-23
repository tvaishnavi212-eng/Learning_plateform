import React from "react";
import { Link } from "react-router-dom";
import assets from "../../assets/assets";

const CourseCard = ({ course, isSelected }) => {
  const currency = "₹"; // Default currency

  if (!course) return null;

  const price = course.coursePrice || 0;
  const discount = course.discount || 0;
  const finalPrice = price - (discount * price) / 100;

  // ✅ FIX: handle both id types
  const courseId = course._id || course.id;

  // Calculate average rating
  const averageRating = course.courseRatings?.length > 0 
    ? (course.courseRatings.reduce((sum, r) => sum + r.rating, 0) / course.courseRatings.length).toFixed(1)
    : 4.5;

  return (
    <Link
      to={`/course/${courseId}`} // ✅ FIXED
      onClick={() => window.scrollTo(0, 0)}
      className={`group block bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 hover:-translate-y-2 ${
        isSelected ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200'
      }`}
    >
      {/* Image */}
      <div className="overflow-hidden relative">
        <img
          className="w-full h-44 object-center group-hover:scale-105 transition duration-300"
          src={course.courseThumbnail}
          alt={course.courseTitle}
        />
        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
            Currently Selected
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 text-left">
        <h3 className="text-md font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition">
          {course.courseTitle}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          {course.educator?.name || "GreatStack"} {/* ✅ SAFE FIX */}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <span className="text-yellow-500 font-medium text-sm">
            {averageRating}
          </span>

          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={assets.star}
                alt="star"
                className={`w-4 h-4 ${
                  i < Math.floor(averageRating)
                    ? "opacity-100"
                    : "opacity-30"
                }`}
              />
            ))}
          </div>

          <span className="text-gray-400 text-xs ml-1">
            ({course.courseRatings?.length || 22})
          </span>
        </div>

        {/* Course Stats */}
        <div className="mt-3 text-sm text-gray-600">
          <p>📚 {course.courseContent?.length || 0} Chapters</p>
          <p>👥 {course.enrolledStudents?.length || 0} Students</p>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            {currency}
            {finalPrice.toFixed(2)}
          </span>

          {discount > 0 && (
            <span className="text-sm text-gray-400 line-through">
              {currency}
              {price}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
