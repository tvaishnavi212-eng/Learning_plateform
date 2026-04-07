import React, { useContext } from "react";
import { Link } from "react-router-dom";
import assets from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const CourseCard = ({ course }) => {
  const { currency } = useContext(AppContext);

  if (!course) return null;

  const price = course.coursePrice || 0;
  const discount = course.discount || 0;
  const finalPrice = price - (discount * price) / 100;

  // ✅ FIX: handle both id types
  const courseId = course._id || course.id;

  return (
    <Link
      to={`/course/${courseId}`} // ✅ FIXED
      onClick={() => window.scrollTo(0, 0)}
      className="group block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 hover:-translate-y-2"
    >
      {/* Image */}
      <div className="overflow-hidden">
        <img
          className="w-full h-44 object-center group-hover:scale-105 transition duration-300"
          src={course.courseThumbnail}
          alt={course.courseTitle}
        />
      </div>

      {/* Content */}
      <div className="p-4 text-left">
        <h3 className="text-md font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition">
          {course.courseTitle}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          {course.educator?.name || "Instructor"} {/* ✅ SAFE FIX */}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <span className="text-yellow-500 font-medium text-sm">
            {course.rating || 4.5}
          </span>

          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={assets.star}
                alt="star"
                className={`w-4 h-4 ${
                  i < Math.floor(course.rating || 4.5)
                    ? "opacity-100"
                    : "opacity-30"
                }`}
              />
            ))}
          </div>

          <span className="text-gray-400 text-xs ml-1">
            ({course.reviews || 22})
          </span>
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
