import React from "react";
import assets, { dummyEducatorData } from "../../assets/assets";
import { UserButton, useUser } from "@clerk/react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const educatorData = dummyEducatorData;
  const { user } = useUser();

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b">
      {/* Logo */}
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="w-28 lg:w-32" />
      </Link>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <p className="text-sm">Hi! {user ? user.fullName : "Developers"}</p>

        {user ? (
          <UserButton />
        ) : (
          <img
            className="w-8 h-8 rounded-full"
            src={assets.profile_img}
            alt="profile"
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;
