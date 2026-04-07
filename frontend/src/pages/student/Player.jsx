import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import { Rating } from "react-simple-star-rating";

const Player = () => {
  const { enrolledCourses, calculateChapterTime } = useContext(AppContext);
  const { courseId } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [rating, setRating] = useState(0);

  // Fetch Course Data
  useEffect(() => {
    const course = enrolledCourses.find((course) => course._id === courseId);
    setCourseData(course);
  }, [courseId, enrolledCourses]);

  // Toggle Accordion
  const toggleSection = (index) => {
    setOpenSection((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Handle Rating
  const handleRating = (rate) => {
    setRating(rate);
    console.log("Rated:", rate);
  };

  // Extract YouTube video ID
  const getVideoId = (url) => {
    const regExp =
      /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url?.match(regExp);
    return match ? match[1] : null;
  };

  return (
    <div className="p-4 sm:p-10 grid md:grid-cols-2 gap-10 md:px-36">
      {/* LEFT COLUMN */}
      <div className="text-gray-800">
        <h2 className="text-xl font-semibold">Course Structure</h2>

        <div className="pt-4">
          {courseData &&
            courseData.courseContent?.map((chapter, index) => (
              <div key={index} className="border-b">
                {/* Chapter Header */}
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

                {/* Lectures */}
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
                              {lecture.lectureUrl && (
                                <p
                                  onClick={() =>
                                    setPlayerData({
                                      ...lecture,
                                      chapter: index + 1,
                                      lecture: i + 1,
                                    })
                                  }
                                  className="text-blue-500 cursor-pointer"
                                >
                                  Watch
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

      {/* RIGHT COLUMN */}
      <div className="flex flex-col gap-6">
        {/* VIDEO / IMAGE CARD */}
        <div className="bg-white shadow-md rounded-lg p-4">
          {playerData ? (
            <>
              <YouTube
                videoId={getVideoId(playerData.lectureUrl)}
                opts={{ playerVars: { autoplay: 1 } }}
                iframeClassName="w-full aspect-video rounded"
              />

              <p className="mt-3 font-medium">
                {playerData.chapter}.{playerData.lecture}{" "}
                {playerData.lectureTitle}
              </p>

              <button className="mt-3 text-blue-600 font-medium">
                Mark Completed
              </button>
            </>
          ) : (
            <img
              src={courseData?.courseThumbnail || ""}
              alt="thumbnail"
              className="w-full h-52 object-cover rounded"
            />
          )}
        </div>

        {/* ⭐ RATING CARD */}
        <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center gap-3">
          <h1 className="text-lg font-semibold">Rate this Course</h1>

          <Rating
            onClick={handleRating}
            ratingValue={rating}
            size={28}
            allowFraction={false}
          />

          <p className="text-sm text-gray-500 flex items-center gap-1">
            {rating ? `${rating / 20} / 5` : "No rating yet"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Player;
