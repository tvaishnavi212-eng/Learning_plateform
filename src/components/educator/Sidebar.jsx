import React, { useContext } from "react";
import assets from "../../assets/assets";
import { NavLink } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const Sidebar = () => {
  const { isEducator } = useContext(AppContext);

  const menuItems = [
    { name: "Dashboard", path: "/educator", icon: assets.home_icon },
    {
      name: "Create Course",
      path: "/educator/add-course",
      icon: assets.add_icon,
    },
    {
      name: "My Courses",
      path: "/educator/my-courses",
      icon: assets.my_course_icon,
    },
    {
      name: "Student Enrollments",
      path: "/educator/student-enrolled",
      icon: assets.person_tick_icon,
    },
  ];

  if (!isEducator) return null; // cleaner than conditional JSX

  return (
    <div className="md:w-64 w-16 border-r min-h-screen text-base border-gray-200 py-2 flex flex-col">
      {menuItems.map((item) => (
        <NavLink
          to={item.path}
          key={item.name}
          end={item.path === "/educator"}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 transition-all duration-200
            ${
              isActive
                ? "bg-indigo-50 border-r-4 border-indigo-500 text-indigo-600 font-medium"
                : "hover:bg-gray-100 text-gray-700"
            }`
          }
        >
          <img src={item.icon} alt={item.name} className="w-6" />
          <p className="md:block hidden">{item.name}</p>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
