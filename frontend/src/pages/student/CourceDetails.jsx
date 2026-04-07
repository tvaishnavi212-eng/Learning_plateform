import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import Loading from "../../components/student/Loading";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import Footer from "../../components/student/Footer";
//import Footer from "../../components/student/Footer";
//import Footer from "../../components/educator/Footer";

const CourseDetails = () => {
  const { id } = useParams();

  const {
    allCourses,
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    currency,
  } = useContext(AppContext);

  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);

  // ✅ Fetch Course
  useEffect(() => {
    if (!id || allCourses.length === 0) return;

    const findCourse = allCourses.find(
      (course) =>
        course &&
        (course.id?.toString() === id || course._id?.toString() === id),
    );

    setCourseData(findCourse || null);
  }, [allCourses, id]);

  // ✅ Toggle Accordion
  const toggleSection = (index) => {
    setOpenSection((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // ✅ Loading
  if (!courseData) {
    return <Loading />;
  }

  // ✅ Rating
  const rating = Number(calculateRating(courseData)) || 0;

  // ✅ Price
  const price = courseData.coursePrice || 0;
  const discount = courseData.discount || 0;
  const finalPrice = price - (discount * price) / 100;

  return (
    <div className="md:px-36 px-6 pt-20 pb-20">
      <div className="flex md:flex-row flex-col-reverse gap-10">
        {/* LEFT */}
        <div className="flex-1 text-gray-600">
          <h1 className="text-2xl md:text-4xl font-semibold text-gray-800">
            {courseData.courseTitle}
          </h1>

          <p
            className="pt-4 text-sm md:text-base"
            dangerouslySetInnerHTML={{
              __html: courseData.courseDescription?.slice(0, 200) || "",
            }}
          />

          {/* ⭐ RATING WITH HALF STAR */}
          <div className="flex items-center gap-2 pt-4">
            <p className="font-medium">{rating}</p>

            <div className="flex">
              {[...Array(5)].map((_, i) => {
                if (rating >= i + 1) {
                  return (
                    <img
                      key={i}
                      src={assets.star}
                      alt="star"
                      className="w-4 h-4"
                    />
                  );
                } else if (rating >= i + 0.5) {
                  return (
                    <img
                      key={i}
                      src={assets.star_half}
                      alt="half star"
                      className="w-4 h-4"
                    />
                  );
                } else {
                  return (
                    <img
                      key={i}
                      src={assets.star_blank}
                      alt="blank star"
                      className="w-4 h-4"
                    />
                  );
                }
              })}
            </div>

            <p className="text-blue-600">
              ({courseData.courseRating?.length || 0} ratings)
            </p>
          </div>

          {/* COURSE STRUCTURE */}
          <div className="pt-8">
            <h2 className="text-xl font-semibold text-gray-800">
              Course Structure
            </h2>

            <div className="pt-4">
              {courseData.courseContent?.map((chapter, index) => (
                <div key={index} className="border-b">
                  {/* HEADER */}
                  <div
                    onClick={() => toggleSection(index)}
                    className="flex justify-between items-center cursor-pointer py-3"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={assets.down_arrow_icon}
                        alt="arrow"
                        className={`w-4 transition-transform ${
                          openSection[index] ? "rotate-180" : ""
                        }`}
                      />
                      <p className="font-medium">{chapter.chapterTitle}</p>
                    </div>

                    <p className="text-sm text-gray-500">
                      {chapter.chapterContent?.length || 0} lectures •{" "}
                      {calculateChapterTime(chapter)}
                    </p>
                  </div>

                  {/* LECTURES */}
                  {openSection[index] && (
                    <div className="pl-6 pb-3">
                      <ul className="text-sm text-gray-600 space-y-2">
                        {chapter.chapterContent?.map((lecture, i) => (
                          <li key={i} className="flex gap-2">
                            <img
                              src={assets.play_icon}
                              alt="play"
                              className="w-4 h-4 mt-1"
                            />

                            <div>
                              <p>{lecture.lectureTitle}</p>

                              <div className="flex gap-3 text-xs text-gray-500">
                                {lecture.isPreviewFree && (
                                  <p
                                    onClick={() =>
                                      setPlayerData({
                                        videoId: lecture.lectureUrl
                                          ?.split("/")
                                          .pop(),
                                      })
                                    }
                                    className="text-blue-500 cursor-pointer"
                                  >
                                    Preview
                                  </p>
                                )}

                                <span>
                                  {humanizeDuration(
                                    lecture.lectureDuration * 60 * 1000,
                                    { units: ["m"], round: true },
                                  )}
                                </span>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="pt-10">
            <h3 className="text-xl font-semibold text-gray-800">
              Course Description
            </h3>

            <p
              className="pt-3 text-sm md:text-base text-gray-600"
              dangerouslySetInnerHTML={{
                __html: courseData.courseDescription || "",
              }}
            />
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-full md:w-1/3 bg-white shadow-lg rounded-xl overflow-hidden h-fit sticky top-20">
          {/* VIDEO OR IMAGE */}
          {playerData ? (
            <YouTube
              videoId={playerData.videoId}
              opts={{ playerVars: { autoplay: 1 } }}
              iframeClassName="w-full aspect-video"
            />
          ) : (
            <img
              src={courseData.courseThumbnail}
              alt="course"
              className="w-full h-52 object-cover"
            />
          )}

          <div className="p-5">
            {/* OFFER */}
            <div className="flex items-center gap-2">
              <img
                className="w-4"
                src={assets.time_left_clock_icon}
                alt="time"
              />
              <p className="text-red-500 text-sm">
                <span className="font-medium">5 days</span> left at this price!
              </p>
            </div>

            {/* PRICE */}
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-800">
                {currency}
                {finalPrice.toFixed(2)}
              </p>

              <p className="text-gray-500 line-through">
                {currency}
                {price}
              </p>

              <p className="text-gray-500">{discount}% off</p>
            </div>

            {/* STATS */}
            <div className="flex items-center gap-4 pt-4 text-gray-500 text-sm">
              <p>⭐ {rating}</p>
              <p>⏱ {calculateCourseDuration(courseData)}</p>
              <p>📚 {calculateNoOfLectures(courseData)} lessons</p>
            </div>

            {/* ✅ INFO SECTION */}
            <div className="mt-4 text-sm text-gray-500 space-y-1">
              <p>✔ Lifetime access</p>
              <p>✔ Certificate of completion</p>
              <p>✔ Learn at your own pace</p>
            </div>

            {/* BUTTON */}
            <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md">
              {isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
<Footer />;

export default CourseDetails;
