import express from "express";
import multer from "multer";
import {
  addCourse,
  getEducatorCourses,
  updateRoleToEducator,
  getEducatorDashboardData,
  getEnrolledStudentsData,
} from "../controllers/educatorController.js";
import { protectEducator } from "../middlewares/authMiddleware.js";

const educatorRouter = express.Router();

// multer config
const upload = multer({ dest: "uploads/" });

// Add Educator Role
educatorRouter.get("/update-role", updateRoleToEducator);

// Add Course
educatorRouter.post(
  "/add-course",
  upload.single("image"),
  protectEducator,
  addCourse,
);


educatorRouter.get("/courses", protectEducator, getEducatorCourses);
educatorRouter.get("/dashboard", protectEducator, getEducatorDashboardData)
educatorRouter.get("/enrolled-students", protectEducator, getEnrolledStudentsData)
export default educatorRouter;
