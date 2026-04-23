import react from "react";
import { Route, Routes, useMatch } from "react-router-dom";
import Home from "./pages/student/Home";
import CoursesList from "./pages/student/CoursesList";
import CourceDetails from "./pages/student/CourceDetails";
import MyEnrollments from "./pages/student/MyEnrollments";
import Player from "./pages/student/Player";
import Loading from "./components/student/Loading";
import Login from "./pages/auth/Login";
import SimpleLogin from "./pages/auth/SimpleLogin";
import SampleLogin from "./pages/auth/SampleLogin";
import ClerkAuthSystem from "./components/auth/ClerkAuthSystem";
import AccountDetails from "./pages/auth/AccountDetails";
import Educator from "./pages/educator/Educator";
import AddCourse from "./pages/educator/AddCourse";
import MyCourses from "./pages/educator/MyCourses";
import StudentsEnrolled from "./pages/educator/StudentsEnrolled";
import Navbar from "./components/student/Navbar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import "quill/dist/quill.snow.css";
import {ToastContainer, toast} from "react-toastify";

const App = () => {
  const isEducatorRoute = useMatch("/educator/*");
  return (
    <div className="text-default min-h-screen bg-white">
      <ToastContainer/>
      {!isEducatorRoute && <Navbar />}
    <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/course-list" element={<CoursesList />} />
          <Route path="/course-list/:input" element={<CoursesList />} />
          <Route path="/course/:id" element={<CourceDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/simple-login" element={<SimpleLogin />} />
          <Route path="/sample-login" element={<SampleLogin />} />
          <Route path="/clerk-auth" element={<ClerkAuthSystem />} />
          <Route path="/account-details" element={<AccountDetails />} />
          <Route path="/my-enrollments" element={
            <ProtectedRoute>
              <MyEnrollments />
            </ProtectedRoute>
          } />
          <Route path="/player/:courseId" element={
            <ProtectedRoute>
              <Player />
            </ProtectedRoute>
          } />
          <Route path="/loading/:path" element={<Loading />} />
          <Route path="/educator" element={
            <ProtectedRoute>
              <Educator />
            </ProtectedRoute>
          }>
            <Route path="add-course" element={
              <ProtectedRoute>
                <AddCourse />
              </ProtectedRoute>
            } />
            <Route path="my-courses" element={
              <ProtectedRoute>
                <MyCourses />
              </ProtectedRoute>
            } />
            <Route path="student-enrolled" element={
              <ProtectedRoute>
                <StudentsEnrolled />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
    </div>
  );
};

export default App;
