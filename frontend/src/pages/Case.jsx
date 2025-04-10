import React, { useState, useEffect, useContext } from "react";
import { assets } from "../assets/assets";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// ตั้งค่า worker โดยใช้ CDN ที่ถูกต้อง
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const Case = () => {
  const rowsPerPage = 6; // จำนวนแถวที่ต้องการแสดงในแต่ละหน้า
  const [currentPage, setCurrentPage] = useState(1);
  const [lawInfo, setLawInfo] = useState(null);
  const { lawId } = useParams();
  const navigate = useNavigate();

  const [courtLevelFilter, setCourtLevelFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [clientSideFilter, setClientSideFilter] = useState("all");
  const [caseOutcomeFilter, setCaseOutcomeFilter] = useState("all");

  //จัดการไฟล์
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [numPages, setNumPages] = useState(null);

  const {
    lawyers,
    cases,
    getCases,
    slotDateFormat,
    appointments,
    getAppoinetments,
  } = useContext(AppContext);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const fetchLawInfo = async () => {
    const lawInfo = lawyers.find((law) => law._id === lawId);
    setLawInfo(lawInfo);
    console.log(lawInfo);
  };

  useEffect(() => {
    fetchLawInfo();
  }, [lawyers, lawId]);

  useEffect(() => {
    if (lawInfo) {
      getCases(lawInfo._id);
    }
  }, [lawInfo]);

  useEffect(() => {
    if (lawId) {
      getAppoinetments(lawId);
    }
  }, [lawId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-1 mx-1 rounded-full ${
            currentPage === i
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

  const filteredCases = cases.filter((caseItem) => {
    return (
      (courtLevelFilter === "all" ||
        caseItem.courtLevel === courtLevelFilter) &&
      (categoryFilter === "all" || caseItem.caseCategory === categoryFilter) &&
      (clientSideFilter === "all" ||
        caseItem.caseClientSide === clientSideFilter) &&
      (caseOutcomeFilter === "all" ||
        caseItem.caseOutcome === caseOutcomeFilter)
    );
  });

  const totalPages = Math.ceil(filteredCases.length / rowsPerPage);
  const currentCases = filteredCases.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    lawInfo && (
      <div className="p-4 animate-fadeIn">
        <div className="mb-8 lg:w-[95%] mx-auto flex flex-row gap-2">
{/*           <button
            className="text-lg font-medium text-dark-brown text-opacity-70 hover:text-dark-brown"
            onClick={() => navigate(`/appointment/${lawId}`)}
          >
            ประวัติของทนายความ
          </button> */}
          <p className="text-lg font-medium text-dark-brown text-opacity-70">
            {" "}
            {">"}
          </p>
          <h1 className="text-lg font-medium text-dark-brown">
            ข้อมูลการว่าความ
          </h1>
        </div>

        <div className="flex justify-center bg-light-brown rounded-lg mx-auto shadow-lg lg:w-[95%] p-4">
          <div className="flex flex-col lg:flex-row lg:gap-20 gap-4 p-4 justify-center items-center">
            <img
              className="lg:w-[150px] lg:h-[150px] w-[120px] h-[120px] object-cover bg-brown-lawyerpic rounded-full"
              src={lawInfo.image}
              alt=""
            />

            {/* ก้อนทางขวา รายละเอียดของทนายความ */}
            <div className="flex flex-col">
              <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                <p className="font-medium lg:text-xl text-xl text-dark-brown">
                  ทนาย {lawInfo.firstName} {lawInfo.lastName}
                </p>
                {lawInfo.is_thaibar && (
                  <div className="flex flex-row items-center">
                    <p className="text-dark-brown border border-dark-brown rounded-full px-4">
                      เนติบัณฑิต
                    </p>
                  </div>
                )}
              </div>
              <p className="font-regular mt-5 text-lg text-dark-brown">
                เลขที่ใบอนุญาตว่าความ {lawInfo.license_number}
              </p>
              <div className="flex flex-col sm:flex-row justify-between w-full lg:mt-4">
                <div className="flex flex-row items-center mt-4 mr-8 lg:mb-0 mb-2">
                  <img
                    className="w-8 h-8 mr-4 rounded-full"
                    src={assets.Case}
                    alt="จำนวนคดี"
                  />
                  <p className="flex-1 lg:text-center text-dark-brown text-lg">
                    ว่าความมาแล้ว{" "}
                    <span className="text-white bg-primary rounded-full px-6 text-base">
                      {cases ? cases.length : 0}
                    </span>{" "}
                    คดี
                  </p>
                </div>

                <div className="flex flex-row items-center lg:mt-4 mr-8">
                  <img
                    className="w-8 h-8 mr-4 rounded-full"
                    src={assets.Win_1}
                    alt="จำนวนคดีที่ชนะ"
                  />
                  <p className="flex-1 lg:text-center text-dark-brown text-lg">
                    ชนะคิดเป็นร้อยละ{" "}
                    <span className="text-white bg-primary rounded-full px-4 text-base">
                      {cases && cases.length > 0
                        ? Math.round(
                            (cases.filter((c) => c.caseOutcome === "ชนะ")
                              .length /
                              cases.filter((c) => c.caseOutcome !== "ยอมความ")
                                .length) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex lg:flex-row flex-col justify-between lg:w-[95%] mx-auto mt-10">
          <div className="flex flex-row gap-2">
            <div className="hidden md:block">
              <select
                className="bg-white rounded-lg border-2 border-[#D4C7BD] px-4 py-2 mt-2 mb-4"
                value={courtLevelFilter}
                onChange={(e) => setCourtLevelFilter(e.target.value)}
              >
                <option value="all">ลำดับชั้นของศาล</option>
                <option value="ศาลชั้นต้น">ศาลชั้นต้น</option>
                <option value="ศาลอุทธรณ์">ศาลอุทธรณ์</option>
                <option value="ศาลฎีกา">ศาลฎีกา</option>
              </select>
            </div>

            <div>
              <select
                className="bg-white rounded-lg border-2 border-[#D4C7BD] px-4 py-2 mt-2 mb-4"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">หมวดหมู่</option>
                <option value="อาญา">อาญา</option>
                <option value="แรงงาน">แรงงาน</option>
                <option value="ยาเสพติด">ยาเสพติด</option>
                <option value="แพ่ง">แพ่ง</option>
                <option value="ทรัพย์สินทางปัญญา">ทรัพย์สินทางปัญญา</option>
                <option value="ภาษี">ภาษี</option>
                <option value="ผู้บริโภค">ผู้บริโภค</option>
                <option value="ครอบครัวและมรดก">ครอบครัวและมรดก</option>
                <option value="ล้มละลาย">ล้มละลาย</option>
              </select>
            </div>

            <div className="hidden md:block">
              <select
                className="bg-white rounded-lg border-2 border-[#D4C7BD] px-4 py-2 mt-2 mb-4"
                value={clientSideFilter}
                onChange={(e) => setClientSideFilter(e.target.value)}
              >
                <option value="all">ฝั่งของลูกความ</option>
                <option value="โจทก์">โจทก์</option>
                <option value="จำเลย">จำเลย</option>
                <option value="ผู้ร้อง">ผู้ร้อง</option>
              </select>
            </div>

            <div>
              <select
                className="bg-white rounded-lg border-2 border-[#D4C7BD] px-4 py-2 mt-2 mb-4"
                value={caseOutcomeFilter}
                onChange={(e) => setCaseOutcomeFilter(e.target.value)}
              >
                <option value="all">ผลคดี</option>
                <option value="ชนะ">ชนะ</option>
                <option value="แพ้">แพ้</option>
                <option value="ยอมความ">ยอมความ</option>
              </select>
            </div>
          </div>

          <div className="flex lg:items-end justify-end">
            <h1 className="text-sm text-dark-brown lg:mb-4 mb-2">
              พบ {filteredCases.length} จาก {cases.length} คดีความ
            </h1>
          </div>
        </div>

        <div className="bg-[#FFFFFF] rounded overflow-hidden lg:w-[95%] mx-auto">
          <table className="w-full border-collapse">
            <thead className="bg-[#D4C7BD] border border-[#D4C7BD]">
              <tr>
                <th className="p-3 w-100 text-left text-dark-brown hidden md:table-cell"></th>
                <th className="p-3 w-200 text-left text-dark-brown hidden md:table-cell">
                  หมายเลขคดี
                </th>
                <th className="p-3 w-200 text-left text-dark-brown hidden md:table-cell">
                  วันที่เสร็จสิ้น
                </th>
                <th className="p-3 w-200 text-left text-dark-brown hidden md:table-cell">
                  ศาลที่พิจารณา
                </th>
                <th className="p-3 w-200 text-left text-dark-brown hidden md:table-cell">
                  ลำดับชั้นของศาล
                </th>
                <th className="p-3 w-200 text-left text-dark-brown">เรื่อง</th>
                <th className="p-3 w-200 text-left text-dark-brown">
                  หมวดหมู่
                </th>
                <th className="p-3 w-200 text-left text-dark-brown hidden md:table-cell">
                  ฝั่งของลูกความ
                </th>
                <th className="p-3 w-200 text-left text-dark-brown">ผลคดี</th>
                <th className="p-3 w-200 text-center text-dark-brown">
                  คำพิพากษา
                </th>
              </tr>
            </thead>
            <tbody>
              {currentCases.map((data, index) => (
                <tr
                  key={index}
                  className="bg-[#FFFFFF] border-b border-l border-r border-[#DADADA] hover:bg-gray-100"
                  style={{ height: "65px" }}
                >
                  <td className="p-3 hidden md:table-cell">
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    {data.caseNumber}
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    {slotDateFormat(data.caseCompletionDate)}
                  </td>
                  <td className="p-3 hidden md:table-cell">{data.courtName}</td>
                  <td className="p-3 hidden md:table-cell">
                    <span
                      className={`px-4 rounded ${
                        data.courtLevel === "ศาลชั้นต้น"
                          ? "text-[#D47966] bg-[#D47966] bg-opacity-30"
                          : data.courtLevel === "ศาลอุทธรณ์"
                          ? "text-[#1975A4] bg-[#1975A4] bg-opacity-30"
                          : data.courtLevel === "ศาลฎีกา"
                          ? "text-[#7C3D5F] bg-[#7C3D5F] bg-opacity-30"
                          : ""
                      }`}
                    >
                      {data.courtLevel}
                    </span>
                  </td>
                  <td className="p-3">{data.caseTitle}</td>
                  <td className="p-3 text-primary">{data.caseCategory}</td>
                  <td className="p-3 hidden md:table-cell">
                    {data.caseClientSide}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-6 rounded-full ${
                        data.caseOutcome === "ชนะ"
                          ? "text-[#008529] bg-[#008529] bg-opacity-20"
                          : data.caseOutcome === "แพ้"
                          ? "text-[#C5211D] bg-[#C5211D] bg-opacity-20"
                          : data.caseOutcome === "ยอมความ"
                          ? "text-[#007AFF] bg-[#007AFF] bg-opacity-20"
                          : ""
                      }`}
                    >
                      {data.caseOutcome}
                    </span>
                  </td>
                  <td className="px-3 py-4 flex items-center justify-center">
                    <img
                      onClick={() => {
                        console.log("caseDocument:", data.caseDocument);
                        setSelectedAppointment(data);
                        setShowPdfModal(true);
                      }}
                      src={assets.File_Icon}
                      alt="ดูเอกสาร"
                      className="w-7 h-7 cursor-pointer"
                    />
                  </td>
                </tr>
              ))}

              {Array.from({ length: rowsPerPage - currentCases.length }).map(
                (_, index) => (
                  <tr
                    key={`empty-${index}`}
                    className="bg-[#FFFFFF] border-b border-l border-r border-[#DADADA]"
                    style={{ height: "65px" }}
                  >
                    <td className="p-3 hidden md:table-cell">&nbsp;</td>
                    <td className="p-3 hidden md:table-cell">&nbsp;</td>
                    <td className="p-3 hidden md:table-cell">&nbsp;</td>
                    <td className="p-3 hidden md:table-cell">&nbsp;</td>
                    <td className="p-3 hidden md:table-cell">&nbsp;</td>
                    <td className="p-3">&nbsp;</td>
                    <td className="p-3">&nbsp;</td>
                    <td className="p-3 hidden md:table-cell">&nbsp;</td>
                    <td className="p-3">&nbsp;</td>
                    <td className="p-3">&nbsp;</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-4 lg:w-[95%] mx-auto">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 mx-1 rounded text-dark-brown text-sm ${
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
            className={`px-4 py-2 mx-1 rounded text-dark-brown text-sm ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {">"}
          </button>
        </div>

        {showPdfModal && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg lg:w-[850px] w-[380px] h-[90vh] overflow-y-auto animate-popupCenter">
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-medium text-dark-brown">
                  เอกสารคำพิพากษา
                </h2>
                <img
                  onClick={() => setShowPdfModal(false)}
                  src={assets.Close_2}
                  alt="ปิด"
                  className="w-7 h-7 cursor-pointer"
                />
              </div>

              <div className="border border-[#D4C7BD] rounded-lg p-4 bg-[#F9F5F3] overflow-x-auto">
                <div className="max-w-[750px] mx-auto">
                  {selectedAppointment?.caseDocument ? ( // ใช้ caseDocument แทน documentUrl
                    <Document
                      file={selectedAppointment.caseDocument}
                      onLoadSuccess={onDocumentLoadSuccess}
                      className="pdf-document"
                    >
                      {Array.from(new Array(numPages), (el, index) => (
                        <Page
                          key={`page_${index + 1}`}
                          ç
                          pageNumber={index + 1}
                          width={750}
                        />
                      ))}
                    </Document>
                  ) : (
                    <p className="text-center text-dark-brown">
                      ไม่มีเอกสารคำพิพากษา
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default Case;
