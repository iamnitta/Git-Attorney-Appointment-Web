import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {
    const { aToken, setAToken } = useContext(AdminContext)

  const navigate = useNavigate()

  const logout = () => {
    navigate('/')
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
  }

  return (
    <div className="min-h-screen bg-light-gray">
      {aToken && (

        
        <ul className="mt-5">
       <div className="p-4 text-center">
            <h1 className="text-xl font-bold mb-4">สำนักงานกฎหมายทนายนอร์ท</h1>
            <div className="inline-block">
              <span className="bg-[#E8E1DD] rounded-full py-0.5 px-2.5 ">{aToken ? 'แอดมิน' : 'ทนายความ'}</span>
            </div>
          </div>
                       

          <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-brown-lawyerpic':''}`} to={'/all-appointments'}>
            <img src={assets.home_icon} alt="" />
            <p>การนัดหมายทั้งหมด</p>
          </NavLink>

          <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-brown-lawyerpic':''}`} to={'/lawyer-list'}>
            <img src={assets.home_icon} alt="" />
            <p>ทนายความทั้งหมด</p>
          </NavLink>

          <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-brown-lawyerpic':''}`} to={'/add-lawyer'}>
            <img src={assets.home_icon} alt="" />
            <p>ลงทะเบียนทนายความ</p>
          </NavLink>

          <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-brown-lawyerpic':''}`} to={'/finance-lawyer'}>
            <img src={assets.home_icon} alt="" />
            <p>ข้อมูลการเงิน</p>
          </NavLink>

          <NavLink  onClick={logout} className= "flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer" >
              <img src={assets.home_icon} alt="" className="w-6 h-6" />
              <p>ออกจากระบบ</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
