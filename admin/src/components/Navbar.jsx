import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext)

  const navigate = useNavigate()

  const logout = () => {
    navigate('/')
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
  }

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-light-brown">
      <div className="flex items-center gap-2">
        <p>สำนักงานกฎหมายทนายนอร์ท</p>
        <p className="border px-2.5 py-0.5 rounded-full border-black text-sm">{aToken ? 'แอดมิน' : 'ทนายความ'}</p>
      </div>
      <button onClick={logout} className="bg-primary text-sm px-10 py-2 rounded-full text-white">ออกจากระบบ</button>
    </div>
  );
};

export default Navbar;
