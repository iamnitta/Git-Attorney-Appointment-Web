import React, { useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  //javascript
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [token, setToken] = useState(true);

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 bg-light-brown font-prompt">
      {/* <img className="w-44 cursor-pointer ml-5" src={assets.logo} alt="" /> */}

      <ul className=" md:flex items-start gap-5 font-medium">
        <NavLink to="/">
          <li className="py-1 text-gray-700 hover:text-gray-900 text-lg ml-5">
            สำนักงานกฎหมายทนายนอร์ท
          </li>
        </NavLink>
      </ul>

      <ul className="hidden md:flex items-start gap-5 font-medium">
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
      <div className="flex items-center gap-4 mr-10 ">
        
        {token ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img className="w-8 rounded-full" src={assets.profile_pic} alt="" />
            <img className="w-2.5" src={assets.dropdown_icon} alt="" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-700 hidden group-hover:block">
              <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                <p onClick={()=>navigate("/my-profile")} className="hover:text-black cursor-pointer">โปรไฟล์</p>
                <p onClick={()=>navigate("/my-appointments")} className="hover:text-black cursor-pointer">สถานะการจอง</p>
                <p onClick={()=>setToken(false)} className="hover:text-black cursor-pointer">ออกจากระบบ</p>
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
      </div>
    </div>
  );
};

export default Navbar;
