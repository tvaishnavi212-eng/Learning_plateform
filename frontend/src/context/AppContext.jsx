import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dummyCourses } from "../assets/assets";
import humanizeDuration from "humanize-duration";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const currency = import.meta.env.VITE_CURRENCY || "₹";

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // ✅ Fetch all courses
  const fetchAllCourses = async () => {
    setAllCourses(dummyCourses || []);
  };

  // ✅ Calculate average rating
  // ✅ Calculate average rating (FIXED)
  const calculateRating = (course) => {
    if (!course?.courseRating || course.courseRating.length === 0) {
      return 0;
    }

    let totalRating = 0;

    course.courseRating.forEach((item) => {
      totalRating += Number(item.rating) || 0;
    });

    const avg = totalRating / course.courseRating.length;

    return Math.round(avg * 10) / 10; // ✅ returns NUMBER like 4.5
  };
  // ✅ Calculate chapter time
  const calculateChapterTime = (chapter) => {
    let time = 0;

    chapter?.chapterContent?.forEach((lecture) => {
      time += lecture.lectureDuration;
    });

    return humanizeDuration(time * 60 * 1000, {
      units: ["h", "m"],
      round: true,
    });
  };

  // ✅ Calculate course duration
  const calculateCourseDuration = (course) => {
    let time = 0;

    course?.courseContent?.forEach((chapter) => {
      chapter?.chapterContent?.forEach((lecture) => {
        time += lecture.lectureDuration;
      });
    });

    return humanizeDuration(time * 60 * 1000, {
      units: ["h", "m"],
      round: true,
    });
  };

  // ✅ Calculate number of lectures
  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;

    course?.courseContent?.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });

    return totalLectures;
  };
  //fetch user enrolled courses
  const fetchUserEnrolledCourses = async () => {
    setEnrolledCourses(dummyCourses);
  };

  // ✅ Load data on mount
  useEffect(() => {
    fetchAllCourses();
    fetchUserEnrolledCourses();
  }, []);

  const value = {
    currency,
    allCourses,
    setAllCourses,
    navigate,
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    isEducator,
    setIsEducator,
    enrolledCourses,
    fetchUserEnrolledCourses,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
