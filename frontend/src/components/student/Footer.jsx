import React from "react";
import assets from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-gray-900 md:px-36 text-left w-full mt-10">
      <div className="flex md:px-0 justify-center gap-10 flex-col md:flex-row items-start px-8 md:gap-32 py-10 border-b border-white/30">
        <div className="flex flex-col md:items-start items-center w-full">
          <img src={assets.logo_dark} alt="logo" />
          <p className="text-white mt-4 text-sm">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad, nemo
            aspernatur. Debitis vitae iusto ratione labore animi, illum autem
            neque, veritatis quae laudantium dolore accusamus excepturi eligendi
            facilis corporis deleniti?
          </p>
        </div>
        <div className="flex flex-col md:items-start items-center w-full">
          <h2 className="font-semibold text-white mb-5">Company</h2>
          <ul className="flex md:flex-col w-full justify-between text-sm text-white md:space-y-2">
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">About us</a>
            </li>
            <li>
              <a href="#">Contact us</a>
            </li>
            <li>
              <a href="#">Privacy policy</a>
            </li>
          </ul>
        </div>
        <div className="hidden md:flex flex-col items-start w-full">
          <h2 className=" font-semibold text-white mb-5">
            Subscribe to our newsletter
          </h2>
          <p className="text-sm text-white/80">
            {" "}
            The latest news, articles , and resoures ,sent to your inbox weekly.
          </p>
          <div className="flex item-center gap-2 pr-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-gray-800 text-white placeholder:text-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className=" bg-blue-600 w-24 h-9 text-white rounded">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <p className="text-white/70 text-sm py-4" text-center>
        Copyright 2026 @ GreatStack. All Right Reserved
      </p>
    </footer>
  );
};

export default Footer;
