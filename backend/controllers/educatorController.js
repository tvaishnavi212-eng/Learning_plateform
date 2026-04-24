import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import Purchase from "../models/Purchase.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";

// ✅ Update role
export const updateRoleToEducator = async (req, res) => {
  try {
    const { userId } = req.auth(); // ✅ FIXED

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No userId",
      });
    }

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      },
    });

    res.json({
      success: true,
      message: "Role updated",
    });
  } catch (error) {
    console.error("❌ BACKEND ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Add Course
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;

    const { userId: educatorId } = req.auth(); // ✅ FIXED

    if (!educatorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!imageFile) {
      return res.json({
        success: false,
        message: "Thumbnail Not Attached",
      });
    }

    const parsedCourseData = JSON.parse(courseData);
    parsedCourseData.educator = educatorId;

    const newCourse = await Course.create(parsedCourseData);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    newCourse.courseThumbnail = imageUpload.secure_url;

    await newCourse.save();

    res.json({
      success: true,
      message: "Course Added",
    });
  } catch (error) {
    console.error("❌ ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get educated courses
export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth.userId;

    const courses = await Course.find({ educator });
    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
//get educator dashboard data(Total earning,enrolled student,no.of courses)
export const getEducatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const totalCourses = courses.length;
    const courseIds = courses.map((course) => course._id);
    //calculate total earning from purchess
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });
    const totalEarnings = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0,
    );
    const enrolledStudentsData = [];
    for (const course of courses) {
      const students = await User.find(
        {
          _id: { $in: course.enrolledStudents },
        },
        "name imageUrl",
      );
      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }
    res.json({
      success: true,
      dashboardData: {
        totalEarnings,
        enrolledStudentsData,
        totalCourses,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
//get enrolled students data prchess data
export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const courseIds = courses.map((course) => course._id);
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });
    const enrolledStudentsData = [];
    for (const purchase of purchases) {
      const student = await User.findById(purchase.userId);
      enrolledStudentsData.push({
        courseTitle: purchase.courseTitle,
        student,
      });
    }
    res.json({
      success: true,
      enrolledStudentsData,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
