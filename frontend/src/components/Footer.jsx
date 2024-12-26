import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const handleNavLinkClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="bg-gray">
      <div className="sm:ml-4 md:mx-10 bg-gray">
        <div className="flex flex-col sm:grid grid-cols-[2fr_1fr_1fr_1fr] gap-14  pt-10 pb-5 text-sm">
          {/* ----- first section -----*/}
          <div className="pl-4 sm:pl-0">
            <p className="text-xl font medium mb-5">สำนักงานกฎหมายทนายนอร์ท</p>
            <p className="w-full md:w-2/3 leading-6">
              สำนักงานกฎหมายทนายนอร์ทผู้ให้คำปรึกษาทุกเรื่องด้านกฎหมายจากทีมผู้เชี่ยวชาญหลากหลายสาขา
            </p>
          </div>

          {/* ----- Second section -----*/}
          <div className="pl-4 sm:pl-0">
            <p className="text-xl font medium mb-5">ที่ตั้งสำนักงาน</p>
            <p>เลขที่ 109/10 หมู่ 4 ตำบลทับมา อำเภอเมือง จังหวัดระยอง 21000</p>
          </div>

          {/* ----- third section -----*/}
          <div className="pl-4 sm:pl-0">
            <p className="text-xl font medium mb-5">ติดต่อ</p>
            <p>โทร 098-887-8916</p>
            <p>Line ID att.northlaw</p>
          </div>

          {/* ----- fourth section -----*/}
          <div className="pl-4 sm:pl-0">
            <p className="text-xl font medium mb-5">เมนู</p>
            <ul className="flex flex-col gap-2">
              <NavLink to="/" onClick={handleNavLinkClick}>
              <li>หน้าหลัก</li>
              </NavLink>

              <NavLink to="/lawyers" onClick={handleNavLinkClick}>
              <li>ทนายความทั้งหมด</li>
              </NavLink>

              <NavLink to="/about" onClick={handleNavLinkClick}>
              <li>เกี่ยวกับเรา</li>
              </NavLink>

              <NavLink to="/contact" onClick={handleNavLinkClick}>
              <li>ติดต่อเรา</li>
              </NavLink>
              
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
