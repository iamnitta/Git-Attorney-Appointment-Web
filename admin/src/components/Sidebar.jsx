import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { aToken, setAToken } = useContext(AdminContext);

  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
    aToken && setAToken("");
    aToken && localStorage.removeItem("aToken");
  };

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-light-gray flex flex-col">
      {aToken && (
        <>
          <div className="flex-grow overflow-y-auto">
            <ul className="mt-5">
              <div className="p-4 text-center">
                <h1 className="text-lg font-medium mb-4">
                  สำนักงานกฎหมายทนายนอร์ท
                </h1>
                <div className="inline-flex items-center gap-2">
                <img
                      src={assets.Logo_2}
                      alt="icon"
                      className="w-6 h-6"
                    />
                  <span className="bg-[#E8E1DD] rounded-full py-0.5 px-2.5 ">
                    {aToken ? "แอดมิน" : "ทนายความ"}
                  </span>
                </div>
              </div>

              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                    isActive ? "bg-brown-lawyerpic" : ""
                  }`
                }
                to={"/all-appointments"}
              >
                <img src={assets.Booking_Admin} alt="" className="w-6 h-6" />
                <p>การนัดหมายทั้งหมด</p>
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                    isActive ? "bg-brown-lawyerpic" : ""
                  }`
                }
                to={"/lawyer-list"}
              >
                <img src={assets.Lawyers_Admin} alt="" className="w-6 h-6" />
                <p>ทนายความทั้งหมด</p>
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                    isActive ? "bg-brown-lawyerpic" : ""
                  }`
                }
                to={"/add-lawyer"}
              >
                <img src={assets.AddLawyer2_Admin} alt="" className="w-6 h-6" />
                <p>ลงทะเบียนทนายความ</p>
              </NavLink>

              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                    isActive ? "bg-brown-lawyerpic" : ""
                  }`
                }
                to={"/finance-lawyer"}
              >
                <img src={assets.Finance_Admin} alt="" className="w-6 h-6" />
                <p>ข้อมูลการเงิน</p>
              </NavLink>
            </ul>
          </div>

          <div className="mt-auto">
            <NavLink
              onClick={logout}
              className="flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer"
            >
              <img src={assets.Logout_Admin} alt="" className="w-6 h-6" />
              <p>ออกจากระบบ</p>
            </NavLink>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
