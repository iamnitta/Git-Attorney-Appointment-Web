import React from "react";

const Footer = () => {
  return (
    <div className="bg-gray">
      <div className="md:mx-10 bg-gray">
        <div className="flex flex-col sm:grid grid-cols-[2fr_1fr_1fr_1fr] gap-14  pt-10 pb-5 text-sm">
          {/* ----- first section -----*/}
          <div>
            <p className="text-xl font medium mb-5">สำนักงานกฎหมายทนายนอร์ท</p>
            <p className="w-full md:w-2/3 leading-6">
              สำนักงานกฎหมายทนายนอร์ทผู้ให้คำปรึกษาทุกเรื่องด้านกฎหมายจากทีมผู้เชี่ยวชาญหลากหลายสาขา
            </p>
          </div>

          {/* ----- Second section -----*/}
          <div>
            <p className="text-xl font medium mb-5">ที่ตั้งสำนักงาน</p>
            <p>ตำบลทับมา อำเภอเมือง จังหวัดระยอง 21000</p>
          </div>

          {/* ----- third section -----*/}
          <div>
            <p className="text-xl font medium mb-5">ติดต่อ</p>
            <p>โทร 000-000-0000</p>
            <p>Line ID @xxx</p>
          </div>

          {/* ----- fourth section -----*/}
          <div>
            <p className="text-xl font medium mb-5">เมนู</p>
            <ul className="flex flex-col gap-2">
              <li>หน้าหลัก</li>
              <li>ทนายความทั้งหมด</li>
              <li>เกี่ยวกับเรา</li>
              <li>ติดต่อเรา</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
