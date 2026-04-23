import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dummyCourses } from "../assets/assets";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useUnifiedAuth } from "../components/auth/UnifiedAuthProvider";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const { getToken, isLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const { isAuthenticated, user: unifiedUser, useClerk } = useUnifiedAuth();

  const currency = import.meta.env.VITE_CURRENCY || "₹";

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null);

  // ✅ Load dummy data
  const fetchAllCourses = async () => {
  try {
    const { data } = await axios.get(backendUrl + '/api/course/all');

    if (data.success) {
      setAllCourses(data.courses);

    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};

  // Call fetchAllCourses when component mounts
  useEffect(() => {
    fetchAllCourses();
  }, []);

  // fetch UserData
  const fetchUserData = async () => {
    try {
      // Only fetch if using Clerk authentication and user is logged in
      if (!useClerk || !user) {
        console.log(" Not using Clerk or user not logged in - skipping user data fetch");
        return;
      }
      
      const token = await getToken();
      
      if (!token) {
        console.log(" No token available");
        return;
      }
      
      const { data } = await axios.get(backendUrl + '/api/user/data', { headers: { Authorization: `Bearer ${token}` } });
      
      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }   
    } catch (error) {
      console.log(" User data fetch error:", error.message);
      // Don't show toast for network errors in development
      if (!error.message.includes('Network Error')) {
        toast.error(error.message);
      }
    }
  }
  // FINAL TOKEN + API LOGIC
  useEffect(() => {
    const sendToken = async () => {
      console.log(" Checking auth...");

      // wait for authentication system
      if (useClerk) {
        // Using Clerk - wait for Clerk to load
        if (!isLoaded || !userLoaded) {
          console.log(" Clerk loading...");
          return;
        }
        
        // check login - only proceed with API calls if Clerk user is logged in
        if (!user) {
          console.log(" Clerk user not logged in, skipping API call");
          return;
        }

        try {
          const token = await getToken();

          console.log(" TOKEN:", token);

          if (!token) {
            console.log(" No token");
            return;
          }

          // API CALL - only for Clerk authentication
          const res = await fetch(
            "http://localhost:5000/api/educator/update-role",
            {
              method: "GET", // FIXED
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            },
          );

          // HANDLE RESPONSE SAFELY
          const text = await res.text();
          console.log(" RAW RESPONSE:", text);

          let data;
          try {
            data = JSON.parse(text);
          } catch {
            console.log(" Response is NOT JSON (backend issue)");
            return;
          }

          // STATUS CHECK
          if (!res.ok) {
            console.log(" API ERROR:", data);
            return;
          }

          console.log(" SUCCESS:", data);
        } catch (error) {
          console.error(" Fetch Error:", error);
        }
      } else {
        // Using fallback auth - skip API calls since backend expects Clerk tokens
        console.log(" Using fallback auth - API calls disabled (backend expects Clerk tokens)");
        return;
      }
    };

    sendToken();
  }, [isLoaded, userLoaded, user, isAuthenticated, unifiedUser, useClerk]);

  // Utility functions
  const calculateRating = (course) => {
    if (!course.courseRating || course.courseRating.length === 0) {
      return 0;
    }
    const totalRating = course.courseRating.reduce((sum, rating) => sum + rating, 0);
    return (totalRating / course.courseRating.length).toFixed(1);
  };

  const calculateChapterTime = (chapter) => {
    if (!chapter.chapterContent) return "0 min";
    const totalDuration = chapter.chapterContent.reduce(
      (sum, lecture) => sum + (lecture.lectureDuration || 0),
      0
    );
    return humanizeDuration(totalDuration * 60 * 1000, { units: ["m"], round: true });
  };

  const calculateCourseDuration = (course) => {
    if (!course.courseContent) return "0 min";
    const totalDuration = course.courseContent.reduce((courseSum, chapter) => {
      const chapterDuration = chapter.chapterContent?.reduce(
        (chapterSum, lecture) => chapterSum + (lecture.lectureDuration || 0),
        0
      ) || 0;
      return courseSum + chapterDuration;
    }, 0);
    return humanizeDuration(totalDuration * 60 * 1000, { units: ["h", "m"], round: true });
  };

  const calculateNoOfLectures = (course) => {
    if (!course.courseContent) return 0;
    let totalLectures = 0;
    course.courseContent.forEach((chapter) => {
      if (chapter.chapterContent) {
        totalLectures += chapter.chapterContent.length;
      }
    });
    return totalLectures;
  };

  const value = {
    currency,
    allCourses,
    navigate,
    isEducator,
    setIsEducator,
    enrolledCourses,
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    backendUrl,
    userData,setUserData,getToken,fetchAllCourses
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
