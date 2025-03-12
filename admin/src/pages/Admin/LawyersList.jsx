import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const LawyersList = () => {
  const { lawyers, aToken, getAllLawyers } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllLawyers();
    }
  }, [aToken]);

  const [searchTerm, setSearchTerm] = useState(""); // เก็บคำค้นหาที่ผู้ใช้กรอกเข้ามา
  const rowsPerPage = 7; // จำนวนแถวที่ต้องการแสดงในแต่ละหน้า
  const [currentPage, setCurrentPage] = useState(1); // หน้าปัจจุบัน (เริ่มต้นที่ 1)
  const [showMoreSpecialities, setShowMoreSpecialities] = useState(false);
  const [selectedSpecialities, setSelectedSpecialities] = useState([]);
  const [expandedLawyers, setExpandedLawyers] = useState({});
  const [specialityFilter, setSpecialityFilter] = useState("all");
  const allSpecialities = Array.from(
    new Set(lawyers.flatMap((lawyer) => lawyer.speciality))
  );
  const navigate = useNavigate()

  //จัดรูปแบบเบอร์โทร
  const formatPhoneNumber = (phone) => {
    const value = phone.replace(/\D/g, ""); // กรองให้เหลือแค่ตัวเลข
    const formattedValue = value
      .replace(/^(\d{3})(?=\d)/, "$1-") // จับ 3 ตัวแรก
      .replace(/^(\d{3}-\d{3})(?=\d)/, "$1-"); // จับ 3 ตัวถัดไป
    return formattedValue;
  };

  // กรองรายการทนายความตามคำค้นหา
  const filteredLawyers = lawyers.filter((lawyer) => {
    const matchesSearchTerm =
      `${lawyer.firstName} ${lawyer.lastName} ${lawyer.email} ${lawyer.phone}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesSpeciality =
      specialityFilter === "all" ||
      lawyer.speciality.includes(specialityFilter);
    return matchesSearchTerm && matchesSpeciality;
  });

  const totalPages = Math.ceil(filteredLawyers.length / rowsPerPage); // จำนวนหน้าทั้งหมด

  // คำนวณช่วงของข้อมูลที่จะนำมาแสดงในแต่ละหน้า
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredLawyers.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const handleShowMoreSpecialities = (specialities) => {
    setSelectedSpecialities(specialities);
    setShowMoreSpecialities(true);
  };

  const handleToggleSpecialities = (index) => {
    setExpandedLawyers((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handlePageChange = (pageNumber) => {
    // ถ้าเปลี่ยนหน้าไปเกินจำนวนหน้า ให้รีเซ็ตเป็นหน้าสุดท้ายที่มี
    if (pageNumber < 1) {
      setCurrentPage(1);
    } else if (pageNumber > totalPages) {
      setCurrentPage(totalPages);
    } else {
      setCurrentPage(pageNumber);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded ${
            i === currentPage
              ? "bg-[#D4C7BD] text-dark-brown"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [searchTerm, totalPages, currentPage]);

  return (
    <div className="p-8 w-full animate-fadeIn">
      <div className="flex justify-center w-full">
        <h1 className="rounded text-dark-brown text-2xl font-medium mb-6">
          ทนายความทั้งหมด
        </h1>
      </div>

      <div className="mb-4 flex justify-center">
        <div className="flex items-center bg-white rounded-full w-1/3 mt-2 mb-2">
          <input
            type="text"
            placeholder="ค้นหาตามชื่อหรืออีเมล..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full focus:outline-none ml-6"
          />
          <button
            onClick={() => console.log("Searching...")}
            className="flex items-center justify-center w-9 h-7 bg-primary rounded-full text-white hover:opacity-90 mt-2 mb-2 mr-2"
          >
            <img src={assets.Search} alt="Search Icon" className="w-6 h-6" />
          </button>
        </div>

        <div>
          <select
            className="bg-white rounded-full px-4 py-2 mt-2 mb-2 ml-4 h-12"
            value={specialityFilter}
            onChange={(e) => setSpecialityFilter(e.target.value)}
          >
            <option value="all">ความเชี่ยวชาญทั้งหมด</option>
            {allSpecialities.map((spec, idx) => (
              <option key={idx} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-2 flex justify-between items-center">
        <h1 className="text-lg text-dark-brown">
          ทนายความทั้งหมด <span className="text-lg">({lawyers.length})</span>
        </h1>
        {(searchTerm || specialityFilter !== "all") && (
          <h1 className="text-sm text-dark-brown">
            พบ {filteredLawyers.length} จาก {lawyers.length} ทนายความ
          </h1>
        )}
      </div>

      <div className="bg-[#F7F7F7] rounded overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-[#D4C7BD]">
            <tr>
              <th className="p-4 w-100 font-medium text-left"></th>
              <th className="p-4 w-200 font-medium text-left"></th>
              <th className="p-4 w-300 font-medium text-left">ทนายความ</th>
              <th className="p-4 w-300 font-medium text-left">อีเมล</th>
              <th className="p-4 w-300 font-medium text-left">เบอร์โทร</th>
              <th className="py-4 w-300 font-medium text-left">
                ความเชี่ยวชาญ
              </th>
              <th className="p-4 w-300 font-medium text-left"></th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((lawyer, index) => (
              <tr
                key={index}
                className="bg-[#F7F7F7] border-b border-[#DADADA] hover:bg-gray-100"
                style={{ height: "65px" }}
              >
                <td className="p-3">{startIndex + index + 1}</td>
                <td className="p-3">
                  <img
                    src={lawyer.image}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="p-3 text-nowrap">
                  {lawyer.firstName} {lawyer.lastName}
                </td>
                <td className="p-3 text-nowrap">{lawyer.email}</td>
                <td className="p-3 text-nowrap">
                  {formatPhoneNumber(lawyer.phone)}
                </td>
                <td className="py-5 flex flex-wrap gap-1 items-center">
                  {lawyer.speciality
                    .filter((spec) => spec === specialityFilter)
                    .concat(
                      lawyer.speciality.filter(
                        (spec) => spec !== specialityFilter
                      )
                    )
                    .slice(0, 1)
                    .map((spec, idx) => (
                      <p
                        key={idx}
                        className="font-prompt text-xs bg-gradient-to-r from-primary to-dark-brown text-white rounded-full px-2 py-1"
                      >
                        {spec.trim()}
                      </p>
                    ))}
                  {!expandedLawyers[index] && lawyer.speciality.length > 1 && (
                    <button
                      onClick={() => handleToggleSpecialities(index)}
                      className="font-prompt text-xs bg-gradient-to-r from-primary to-dark-brown text-white rounded-full px-2 py-1"
                    >
                      +{lawyer.speciality.length - 1}
                    </button>
                  )}
                  {expandedLawyers[index] &&
                    lawyer.speciality
                      .filter((spec) => spec === specialityFilter)
                      .concat(
                        lawyer.speciality.filter(
                          (spec) => spec !== specialityFilter
                        )
                      )
                      .slice(1)
                      .map((spec, idx) => (
                        <p
                          key={idx}
                          className="font-prompt text-xs bg-gradient-to-r from-primary to-dark-brown text-white rounded-full px-2 py-1"
                        >
                          {spec.trim()}
                        </p>
                      ))}
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-6">
                    <button 
                    className="text-nowrap px-4 py-1 border border-dark-brown text-dark-brown rounded-full hover:bg-dark-brown hover:text-white flex items-center"
                    onClick = {() => navigate(`/about-lawyer/${lawyer._id}`)}
                    >
                      ดูเพิ่มเติม
                    </button>

                    <button className="flex items-center justify-center rounded-full text-white hover:scale-105 transition-transform duration-200 mt-2 mb-2 mr-2">
                      <img
                        src={assets.Delete}
                        alt="Delete Icon"
                        className="w-6 h-6"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {/* เติมแถวเปล่าให้ครบ 6 แถว */}
            {Array.from({ length: rowsPerPage - currentData.length }).map(
              (_, index) => (
                <tr
                  key={`empty-${index}`}
                  className="bg-[#F7F7F7] border-b border-[#DADADA]"
                  style={{ height: "65px" }}
                >
                  <td className="p-3">&nbsp;</td>
                  <td className="p-3">&nbsp;</td>
                  <td className="p-3">&nbsp;</td>
                  <td className="p-3">&nbsp;</td>
                  <td className="p-3">&nbsp;</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 mx-1 rounded text-dark-brown ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {"<"}
        </button>

        {renderPageNumbers()}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 mx-1 rounded text-dark-brown ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default LawyersList;
