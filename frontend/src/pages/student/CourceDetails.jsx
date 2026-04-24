import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { useUnifiedAuth } from "../../components/auth/UnifiedAuthProvider";
import assets, { dummyCourses } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import Payment from "../../components/student/Payment";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { calculateRating: contextCalculateRating } = useContext(AppContext);
  const { isAuthenticated, isLoading, openSignIn } = useUnifiedAuth();
  const [courseData, setCourseData] = useState(null);
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  // Handle enrollment with authentication check
  const handleEnrollment = () => {
    if (!isAuthenticated) {
      openSignIn();
      return;
    }
    setShowPayment(true);
  };

  // Fetch course
  const fetchCourseData = () => {
    const findCourse = dummyCourses?.find((course) => course._id === id);
    setCourseData(findCourse);
  };

  useEffect(() => {
    if (dummyCourses.length > 0) {
      fetchCourseData();
    }
  }, [id, dummyCourses]);

  // Helper functions
  const calculateRating = (course) => {
    if (!course.courseRatings || course.courseRatings.length === 0) return 4.5;
    const total = course.courseRatings.reduce((sum, rating) => sum + rating.rating, 0);
    return (total / course.courseRatings.length).toFixed(1);
  };

  const averageRating = courseData ? calculateRating(courseData) : 0;

  const calculateCourseDuration = (course) => {
    if (!course.courseContent) return "0 min";
    let totalDuration = 0;
    course.courseContent.forEach((chapter) => {
      const chapterDuration = chapter.chapterContent?.reduce(
        (sum, lecture) => sum + (lecture.lectureDuration || 0),
        0
      ) || 0;
      totalDuration += chapterDuration;
    });
    return humanizeDuration(totalDuration * 60 * 1000, { units: ["h", "m"], round: true });
  };

  const calculateNoOfLectures = (course) => {
    if (!course.courseContent) return 0;
    let totalLectures = 0;
    course.courseContent.forEach((chapter) => {
      totalLectures += chapter.chapterContent?.length || 0;
    });
    return totalLectures;
  };

  // Loading state
  if (!courseData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading course...</p>
      </div>
    );
  }

  return (
    <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-6 pt-20 text-left">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-[300px] -z-10 bg-gradient-to-b from-cyan-100/70"></div>

      {/* LEFT */}
      <div className="max-w-xl z-10 text-gray-600">
        <h1 className="text-2xl md:text-4xl font-semibold text-gray-800">
          {courseData.courseTitle}
        </h1>

        <p
          className="mt-4"
          dangerouslySetInnerHTML={{
            __html: courseData.courseDescription || "",
          }}
        />

        {/* Rating */}
        <div className="flex items-center gap-2 mt-4">
          <p className="font-medium">
            {calculateRating(courseData)}
          </p>

          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={
                  i < Math.floor(calculateRating(courseData))
                    ? assets.star
                    : assets.star_blank
                }
                alt="star"
                className="w-4 h-4"
              />
            ))}
          </div>

          <p className="text-blue-600">
            ({courseData.courseRating?.length || 0}{" "}
            {courseData.courseRating?.length > 1 ? "ratings" : "rating"})
          </p>

          <p>
            {courseData.enrolledStudents?.length || 0}{" "}
            {courseData.enrolledStudents?.length > 1
              ? "students"
              : "student"}
          </p>
        </div>

        {/* Instructor */}
        <p className="mt-3">
          Course by{" "}
          <span className="text-blue-600 underline">
            {courseData.educator?.name || "Instructor"}
          </span>
        </p>
      </div>

      {/* RIGHT */}
      <div className="w-full md:w-1/3 bg-white shadow-lg p-5 rounded-xl">
        {/* Course Thumbnail */}
        <div className="mb-4">
          <img
            src={courseData.courseThumbnail}
            alt={courseData.courseTitle}
            className="w-full h-48 object-cover rounded-lg"
            onError={(e) => {
              e.target.src = assets.course_1_thumbnail; // Fallback image
            }}
          />
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-gray-800">
              $
              {(courseData.coursePrice - (courseData.coursePrice * (courseData.discount || 0) / 100)).toFixed(2)}
            </p>
            {courseData.discount > 0 && (
              <span className="text-sm text-gray-400 line-through">
                ${courseData.coursePrice}
              </span>
            )}
          </div>
          {courseData.discount > 0 && (
            <p className="text-red-500 text-sm">{courseData.discount}% off</p>
          )}
        </div>

        {/* Course Stats */}
        <div className="flex items-center gap-4 pt-4 text-gray-500 text-sm">
          <p>Rating: {averageRating}</p>
          <p>Duration: {calculateCourseDuration(courseData)}</p>
          <p>Lessons: {calculateNoOfLectures(courseData)}</p>
        </div>

        {/* Enrollment Info */}
        <div className="mt-4 text-sm text-gray-500 space-y-1">
          <p>Students enrolled: {courseData.enrolledStudents?.length || 0}</p>
          <p>Instructor: {courseData.educator?.name || "GreatStack"}</p>
        </div>

        {/* Additional Info */}
        <div className="mt-4 text-sm text-gray-500 space-y-1">
          <p>Lifetime access</p>
          <p>Certificate of completion</p>
          <p>Learn at your own pace</p>
        </div>

        {/* Enroll Button */}
        <div className="mt-6">
          <button
            className={`w-full py-3 rounded-md text-white font-medium transition-colors ${
              isAlreadyEnrolled
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={() => {
              if (!isAlreadyEnrolled) {
                // Show payment modal
                setShowPayment(true);
              } else {
                // Navigate to course player
                window.location.href = `/player/${courseData._id}`;
              }
            }}
          >
            {isAlreadyEnrolled ? "Go to Course" : "Enroll Now"}
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <Payment
          course={courseData}
          onPaymentSuccess={(paymentData) => {
            setShowPayment(false);
            setIsAlreadyEnrolled(true);
            console.log("Payment successful:", paymentData);
            // You can add success toast here
          }}
          onPaymentCancel={() => {
            setShowPayment(false);
          }}
        />
      )}
    </div>
  );
};

export default CourseDetails;
