import React, { useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  //javascript
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [token, setToken] = useState(true);

  return (
    <div className="flex items-center justify-between text-sm py-4  bg-light-brown font-prompt">
      {/* <img className="w-44 cursor-pointer ml-5" src={assets.logo} alt="" /> */}

      <ul className=" md:flex items-start gap-5 font-medium">
        <NavLink to="/">
          <li className="py-1 text-gray-700 hover:text-gray-900 md:text-lg text-sm ml-5">
            สำนักงานกฎหมายทนายนอร์ท
          </li>
        </NavLink>
      </ul>

      <ul className="hidden md:flex items-start gap-10 font-regular text-dark-brown">
        <NavLink to="/">
          <li className="py-1 text-gray-700 hover:text-gray-900 text-lg ">
            หน้าหลัก
          </li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/lawyers">
          <li className="py-1 text-gray-700 hover:text-gray-900 text-lg ">
            ทนายความทั้งหมด
          </li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/about">
          <li className="py-1 text-gray-700 hover:text-gray-900 text-lg">
            เกี่ยวกับเรา
          </li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1 text-gray-700 hover:text-gray-900 text-lg">
            ติดต่อเรา
          </li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden " />
        </NavLink>
      </ul>
      <div className="flex items-center gap-4 mr-2 ">
        {token ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img className="w-8 rounded-full" src={assets.Profile_Users} alt="" />
            <img className="w-4" src={assets.Dropdown_button} alt="" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-700 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="hover:text-primary cursor-pointer flex items-center"
                >
                  <img
                    src={assets.Profile_Users}
                    alt="Profile"
                    className="w-6 h-6 mr-4"
                  />
                  โปรไฟล์
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className="hover:text-primary cursor-pointer flex items-center"
                >
                  <img
                    src={assets.Booking_Users}
                    alt="Appointments"
                    className="w-6 h-6 mr-4"
                  />
                  สถานะการจอง
                </p>
                <p
                  onClick={() => setToken(false)}
                  className="hover:text-primary cursor-pointer flex items-center"
                >
                  <img
                    src={assets.Logout_Users}
                    alt="Logout"
                    className="w-6 h-6 mr-4"
                  />
                  ออกจากระบบ
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className=" px-6 py-2 rounded-full font-medium outline outline-[1px] outline-gray-700 hidden md:block text-gray-700 hover:text-gray-900 text-lg"
          >
            เข้าสู่ระบบ
          </button>
        )}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={assets.Menu_button}
          alt=""
        />
        {/* mobile */}
        <div
          className={` ${
            showMenu ? "fixed w-full" : "h-0 w-0"
          } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <p className="py-1 text-gray-700 hover:text-gray-900 text-lg font-regular ml-5">
              สำนักงานกฎหมายทนายนอร์ท
            </p>
            <img
              className="w-6"
              onClick={() => setShowMenu(false)}
              src={assets.Cross_button}
              alt=""
            />
          </div>

          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-regular">
            <NavLink onClick={() => setShowMenu(false)} to="/">
              <p className="px-4 py-2 rounded inline-block">หน้าหลัก</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/lawyers">
              <p className="px-4 py-2 rounded inline-block">ทนายความทั้งหมด</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/about">
              <p className="px-4 py-2 rounded inline-block">เกี่ยวกับเรา</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact">
              <p className="px-4 py-2 rounded inline-block">ติดต่อเรา</p>
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
