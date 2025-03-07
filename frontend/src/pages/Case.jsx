import React, { useState, useEffect, useContext } from "react";
import { assets } from "../assets/assets";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { Document, Page, pdfjs } from "react-pdf"; // เพิ่มการนำเข้า
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// ตั้งค่า worker โดยใช้ CDN ที่ถูกต้อง
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const Case = () => {
  const rowsPerPage = 6; // จำนวนแถวที่ต้องการแสดงในแต่ละหน้า
  const [currentData, setCurrentData] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(currentData.length / rowsPerPage);
  const [lawInfo, setLawInfo] = useState(null);
  const { lawId } = useParams();

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

  useEffect(() => {
    // ตัวอย่างข้อมูลที่จะแสดงในตาราง
    const data = [
      {
        case_number: "อ.1219/2567",
        case_completion_date: "29/10/2567",
        court_name: "ศาลจังหวัดพัทยา",
        court_level: "ศาลชั้นต้น",
        case_title: "ลักทรัพย์",
        case_category: "อาญา",
        case_client_side: "โจทก์",
        case_outcome: "ชนะ",
        case_document: "",
      },
      {
        case_number: "อ.1219/2567",
        case_completion_date: "29/10/2567",
        court_name: "ศาลจังหวัดพัทยา",
        court_level: "ศาลอุทธรณ์",
        case_title: "ลักทรัพย์",
        case_category: "อาญา",
        case_client_side: "โจทก์",
        case_outcome: "แพ้",
        case_document: "",
      },
      {
        case_number: "อ.1219/2567",
        case_completion_date: "29/10/2567",
        court_name: "ศาลจังหวัดพัทยา",
        court_level: "ศาลฎีกา",
        case_title: "ลักทรัพย์",
        case_category: "อาญา",
        case_client_side: "โจทก์",
        case_outcome: "ยอมความ",
        case_document: "",
      },
    ];

    setCurrentData(data);
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setStartIndex((page - 1) * rowsPerPage);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 mx-1 rounded text-dark-brown ${
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

  return (
    lawInfo && (
      <div className="p-4 animate-fadeIn">
        <div className="mb-8 lg:w-[95%] mx-auto">
          <h1 className="text-xl font-medium text-dark-brown">
            รายละเอียดการว่าความ
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
                              cases.length) *
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

        <div className="bg-[#FFFFFF] rounded overflow-hidden lg:w-[95%] mx-auto mt-8">
          <table className="w-full border-collapse">
            <thead className="bg-[#D4C7BD] border border-[#D4C7BD]">
              <tr>
                <th className="p-3 w-100 text-left text-dark-brown"></th>
                <th className="p-3 w-200 text-left text-dark-brown">
                  หมายเลขคดี
                </th>
                <th className="p-3 w-200 text-left text-dark-brown">
                  วันที่เสร็จสิ้น
                </th>
                <th className="p-3 w-200 text-left text-dark-brown">
                  ศาลที่พิจารณา
                </th>
                <th className="p-3 w-200 text-left text-dark-brown">
                  ลำดับชั้นของศาล
                </th>
                <th className="p-3 w-200 text-left text-dark-brown">เรื่อง</th>
                <th className="p-3 w-200 text-left text-dark-brown">
                  หมวดหมู่
                </th>
                <th className="p-3 w-200 text-left text-dark-brown">
                  ฝั่งของลูกความ
                </th>
                <th className="p-3 w-200 text-left text-dark-brown">ผลคดี</th>
                <th className="p-3 w-200 text-center text-dark-brown">
                  คำพิพากษา
                </th>
              </tr>
            </thead>
            <tbody>
              {cases &&
                cases.map((data, index) => (
                  <tr
                    key={index}
                    className="bg-[#FFFFFF] border-b border-l border-r border-[#DADADA] hover:bg-gray-100"
                    style={{ height: "65px" }}
                  >
                    <td className="p-3">{startIndex + index + 1}</td>
                    <td className="p-3">{data.caseNumber}</td>
                    <td className="p-3">
                      {slotDateFormat(data.caseCompletionDate)}
                    </td>
                    <td className="p-3">{data.courtName}</td>
                    <td className="p-3">
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
                    <td className="p-3">{data.caseClientSide}</td>
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

              {/* เติมแถวเปล่าให้ครบ 6 แถว
              {Array.from({ length: rowsPerPage - currentData.length }).map(
                (_, index) => (
                  <tr
                    key={`empty-${index}`}
                    className="bg-[#FFFFFF] border-b border-l border-r border-[#DADADA]"
                    style={{ height: "65px" }}
                  >
                    <td className="p-3">&nbsp;</td>
                    <td className="p-3">&nbsp;</td>
                    <td className="p-3">&nbsp;</td>
                    <td className="p-3">&nbsp;</td>
                    <td className="p-3">&nbsp;</td>
                  </tr>
                )
              )} */}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-4 lg:w-[95%] mx-auto">
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

        {showPdfModal && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg w-[850px] h-[90vh] overflow-y-auto">
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
                    <p className="text-center text-dark-brown">ไม่มีเอกสารคำพิพากษา</p>
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
