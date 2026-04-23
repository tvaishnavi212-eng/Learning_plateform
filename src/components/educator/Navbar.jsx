import React from "react";
import assets from "../../assets/assets";
import { Link } from "react-router-dom";
import { UserButton, useUser, SignInButton } from "@clerk/clerk-react";

const Navbar = () => {
  const { user } = useUser();

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b">
      {/* Logo */}
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="w-28 lg:w-32" />
      </Link>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <p className="text-sm">Hi! {user ? user.fullName : "Guest"}</p>

        {user ? (
          <UserButton />
        ) : (
          <SignInButton mode="modal">
            <button className="bg-blue-500 text-white px-4 py-1 rounded">
              Login
            </button>
          </SignInButton>
        )}
      </div>
    </div>
  );
};

export default Navbar;
