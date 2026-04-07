import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import assets from "../../assets/assets"; // ✅ default import
import { useClerk, UserButton, useUser } from "@clerk/react";
import { AppContext } from "../../context/AppContext";

const Navbar = () => {
  const location = useLocation(); // ✅ FIX
  const navigate = useNavigate(); // ✅ FIX

  const isCourseListPage = location.pathname.includes("/course-list");

  const { openSignIn } = useClerk();
  const { user } = useUser();

  const { isEducator } = useContext(AppContext); // ✅ FIX

  return (
    <div
      className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-300 py-4 ${
        isCourseListPage ? "bg-white" : "bg-cyan-100/70"
      }`}
    >
      {/* Logo */}
      <img
        src={assets.logo}
        alt="Logo"
        onClick={() => navigate("/")}
        className="w-28 lg:w-32 cursor-pointer"
      />

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-5 text-gray-600">
        {user && (
          <>
            <button
              onClick={() => navigate("/educator")} // ✅ FIX
              className="hover:text-blue-600"
            >
              {isEducator ? "Educator Dashboard" : "Become Educator"}
            </button>

            <Link to="/my-enrollments" className="hover:text-blue-600">
              My Enrollments
            </Link>
          </>
        )}

        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()} // ✅ FIX
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Account
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden flex items-center gap-3 text-gray-600">
        {user && (
          <>
            <button onClick={() => navigate("/educator")} className="text-xs">
              {isEducator ? "Dashboard" : "Educator"}
            </button>

            <Link to="/my-enrollments" className="text-xs">
              Enrollments
            </Link>
          </>
        )}

        {user ? (
          <UserButton />
        ) : (
          <button onClick={() => openSignIn()}>
            <img src={assets.user_icon} alt="user" className="w-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
