import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isCourseListPage = location.pathname.includes('/course-list');

  const { openSignIn } = useClerk();
  const { user, isSignedIn } = useUser();

  return (
    <div className={`flex w-full items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 
    ${isCourseListPage ? 'bg-white' : 'bg-cyan-100/70'}`}>

      {/* Logo */}
      <img 
        src={assets.logo} 
        alt="Logo" 
        onClick={() => navigate('/')}
        className="w-28 lg:w-32 cursor-pointer" 
      />

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-5 text-gray-500">

        <div className="flex items-center gap-5">
          <button 
            onClick={(e) => {
              e.preventDefault();
              navigate('/educator');
            }}
            type="button"
          >
            Become Educator
          </button>
          <Link to="/my-enrollments">My Enrollments</Link>
        </div>

        {/* Auth Toggle */}
        {
          isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <button 
              onClick={() => openSignIn()} 
              className="bg-blue-600 text-white px-5 py-2 rounded-full"
            >
              Login / Sign Up
            </button>
          )
        }

      </div>

      {/* Mobile Menu */}
      <div className="md:hidden flex items-center gap-2 sm:gap-5 text-gray-500">

        <div>
          <button 
            onClick={(e) => {
              e.preventDefault();
              navigate('/educator');
            }}
            type="button"
          >
            Become Educator
          </button>
          <Link to="/my-enrollments">My Enrollments</Link>
        </div>

        {/* 🔐 Auth Toggle Mobile */}
        {
          isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <button onClick={() => openSignIn()}>
              <img src={assets.user_icon} alt="User" />
            </button>
          )
        }

      </div>

    </div>
  );
};

export default Navbar;