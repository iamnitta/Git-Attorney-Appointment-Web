import React, { useContext, useEffect, useState } from "react";
import { LawyerContext } from "../../context/LawyerContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Document, Page, pdfjs } from "react-pdf"; // เพิ่มการนำเข้า
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { assets } from "../../assets/assets";
import Select from "react-select";
// ตั้งค่า worker โดยใช้ CDN ที่ถูกต้อง
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const LawyerCase = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [caseNumber, setCaseNumber] = useState("");
  const [courtName, setCourtName] = useState("");
  const [courtLevel, setCourtLevel] = useState("");
  const [caseCompletionDate, setCaseCompletionDate] = useState("");
  const [caseTitle, setCaseTitle] = useState("");
  const [caseCategory, setCaseCategory] = useState("");
  const [caseClientSide, setCaseClientSide] = useState("");
  const [caseOutcome, setCaseOutcome] = useState("");
  const [file, setFile] = useState(""); // จัดการไฟล์
  const [isLoading, setIsLoading] = useState(false);

  //จัดการไฟล์
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [numPages, setNumPages] = useState(null);

  const {
    backendUrl,
    lawyerToken,
    cases,
    getCases,
    courts,
    getCourts,
    deleteCase,
  } = useContext(LawyerContext);

  const [courtLevelFilter, setCourtLevelFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [clientSideFilter, setClientSideFilter] = useState("all");
  const [caseOutcomeFilter, setCaseOutcomeFilter] = useState("all");

  // เพิ่ม state สำหรับจัดการ popup
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // จำนวนแถวต่อหน้า
  const rowsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (pageNumber) => {
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
          className={`px-4 py-1 mx-1 rounded-full ${
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

  const courtOptions = courts.map((court) => ({
    value: court.courtName,
    label: court.courtName,
  }));

  // เพิ่มฟังก์ชันสำหรับจัดการเมื่อเลือกศาล
  const handleCourtSelect = (selectedOption) => {
    const selectedCourtName = selectedOption ? selectedOption.value : "";
    const selectedCourt = courts.find(
      (court) => court.courtName === selectedCourtName
    );
    if (selectedCourt) {
      setCourtName(selectedCourt.courtName);
      setCourtLevel(selectedCourt.courtLevel);
    } else {
      setCourtName("");
      setCourtLevel("");
    }
  };

  //ฟังก์ชั่นสำหรับส่งข้อมูลไป backend
  const onSubmitHandler = async (event) => {
    try {
      setIsLoading(true);

      // สร้าง FormData object
      const formData = new FormData();

      // เพิ่มข้อมูลเข้าไปใน FormData
      formData.append("caseNumber", caseNumber);
      formData.append("courtName", courtName);
      formData.append("courtLevel", courtLevel);
      formData.append("caseCompletionDate", caseCompletionDate);
      formData.append("caseTitle", caseTitle);
      formData.append("caseCategory", caseCategory);
      formData.append("caseClientSide", caseClientSide);
      formData.append("caseOutcome", caseOutcome);
      formData.append("file", file);

      console.log(file);

      // แสดงข้อมูลทั้งหมดใน FormData
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const { data } = await axios.post(
        backendUrl + "/api/lawyer/add-case",
        formData,
        { headers: { lawyerToken, "Content-Type": "multipart/form-data" } }
      );

      if (data.success) {
        toast.success(data.message);
        setCaseNumber("");
        setCourtName("");
        setCourtLevel("");
        setCaseCompletionDate("");
        setCaseTitle("");
        setCaseCategory("");
        setCaseClientSide("");
        setCaseOutcome("");
        setIsModalOpen(false);
        setFile("");
        getCases();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // แก้ไขฟังก์ชันการลบ
  const handleDeleteClick = (caseId) => {
    setCaseToDelete(caseId);
    setShowDeleteConfirm(true);
  };

  // ฟังก์ชันยืนยันการลบ
  const confirmDelete = () => {
    deleteCase(caseToDelete);
    setShowDeleteConfirm(false);
    setCaseToDelete(null);
  };

  // ฟังก์ชันยกเลิกการลบ
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setCaseToDelete(null);
  };

  useEffect(() => {
    if (lawyerToken) {
      getCases();
      getCourts();
    }
  }, [lawyerToken]);

  const totalCases = cases.length;
  const wonCases = cases.filter(
    (caseItem) => caseItem.caseOutcome === "ชนะ"
  ).length;
  const validCases = cases.filter(
    (caseItem) => caseItem.caseOutcome !== "ยอมความ"
  ).length;
  const winPercentage = totalCases > 0 ? (wonCases / validCases) * 100 : 0;

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
    <div className="p-8 w-full animate-fadeIn">
      <div className="flex items-start w-full">
        <h1 className="rounded text-dark-brown text-2xl font-medium mb-6">
          ข้อมูลการว่าความ
        </h1>
      </div>
      <div className="">
        <div className="flex flex-row items-center mb-4 gap-4 mt-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-base bg-dark-brown text-white px-4 py-2 rounded-lg mb-2"
          >
            + เพิ่มบันทึกคดีความ
          </button>
          <p className="text-dark-brown font-medium">
            ทั้งหมด{" "}
            <span className="bg-primary text-white px-4 rounded-full text-sm">
              {totalCases}
            </span>{" "}
            คดี
          </p>
          <p className="text-dark-brown font-medium">
            ชนะคิดเป็นร้อยละ{" "}
            <span className="bg-primary text-white px-4 rounded-full text-sm">
              {winPercentage.toFixed(2)}
            </span>
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-row justify-between items-end mt-10">
          <div className="flex flex-row gap-2">
            <div>
              <select
                className="bg-white rounded-lg border-2 border-[#E7E7E7] px-4 py-2 mt-2 mb-4"
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
                className="bg-white rounded-lg border-2 border-[#E7E7E7] px-4 py-2 mt-2 mb-4"
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

            <div>
              <select
                className="bg-white rounded-lg border-2 border-[#E7E7E7] px-4 py-2 mt-2 mb-4"
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
                className="bg-white rounded-lg border-2 border-[#E7E7E7] px-4 py-2 mt-2 mb-4"
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

          <div>
            <h1 className="text-sm text-dark-brown mb-4">
              พบ {filteredCases.length} จาก {totalCases} คดีความ
            </h1>
          </div>
        </div>
        {/* Popup เพิ่มบันทึกคดีความ */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[95vh] flex flex-col animate-popupCenter">
              <div className="relative p-6">
                <div className="absolute right-8 top-1/2 -translate-y-1/2">
                  <img
                    onClick={() => setIsModalOpen(false)}
                    src={assets.Close_2}
                    alt="ปิด"
                    className="w-7 h-7 cursor-pointer"
                  />
                </div>
                <h2 className="text-xl text-left text-dark-brown font-medium">
                  บันทึกการว่าความ
                </h2>
              </div>

              <div className="flex flex-row gap-2 px-12 mt-2 overflow-y-auto items-center">
                <p className="text-dark-brown font-medium text-lg">
                  รายละเอียดของคดีความ
                </p>
                <img src={assets.Case_Lawyer} alt="" className="w-5 h-5" />
              </div>

              <div className="mt-6 px-20 space-y-4 overflow-y-auto">
                {/* หมายเลขคดี, เรื่อง */}
                <div className="flex gap-6">
                  <div className="w-1/2">
                    <p className="block mb-1 text-dark-brown">หมายเลขคดี</p>
                    <input
                      type="text"
                      className="w-full px-2 py-1.5 border border-[#DADADA] rounded-md focus:outline-none focus:border-[#A17666]"
                      placeholder="ประเภทคดี เลขที่คดี/ปี พ.ศ. (เช่น อ123/2567)"
                      value={caseNumber}
                      onChange={(e) => setCaseNumber(e.target.value)}
                    />
                  </div>

                  <div className="w-1/2">
                    <label className="block mb-1 text-dark-brown">เรื่อง</label>
                    <input
                      type="text"
                      className="w-full px-2 py-1.5 border border-[#DADADA] rounded-md focus:outline-none focus:border-[#A17666]"
                      placeholder="เรื่องของคดีความ (เช่น ลักทรัพย์)"
                      value={caseTitle}
                      onChange={(e) => setCaseTitle(e.target.value)}
                    />
                  </div>
                </div>

                {/* ศาลที่พิจารณา, ลำดับชั้นของศาล */}
                <div className="flex gap-6">
                  <div className="w-1/2">
                    <label className="block mb-1 text-dark-brown">
                      ศาลที่พิจารณา
                    </label>
                    <Select
                      className="w-full rounded-md focus:outline-none focus:border-[#A17666]"
                      value={courtOptions.find(
                        (option) => option.value === courtName
                      )}
                      onChange={handleCourtSelect}
                      options={courtOptions}
                      placeholder="เลือกศาลที่พิจารณา"
                      isClearable
                    />
                  </div>

                  <div className="w-1/2">
                    <label className="block mb-1 text-dark-brown">
                      ลำดับชั้นของศาล
                    </label>
                    <p
                      className="w-full py-1.5
                      rounded-md focus:outline-none focus:border-[#A17666] text-primary"
                    >
                      {courtLevel ? courtLevel : "เลือกศาลที่พิจารณา"}
                    </p>
                  </div>
                </div>

                {/* หมวดหมู่, ฝั่งของลูกความ, ผลคดี */}
                <div className="flex gap-6">
                  <div className="w-1/3">
                    <label className="block mb-1 text-dark-brown">
                      หมวดหมู่กฎหมาย
                    </label>
                    <select
                      className="w-full px-2 py-1.5 border border-[#DADADA] rounded-md focus:outline-none focus:border-[#A17666]"
                      value={caseCategory}
                      onChange={(e) => setCaseCategory(e.target.value)}
                    >
                      <option value="" disabled>
                        เลือกหมวดหมู่
                      </option>
                      <option value="อาญา">อาญา</option>
                      <option value="แรงงาน">แรงงาน</option>
                      <option value="ยาเสพติด">ยาเสพติด</option>
                      <option value="แพ่ง">แพ่ง</option>
                      <option value="ทรัพย์สินทางปัญญา">
                        ทรัพย์สินทางปัญญา
                      </option>
                      <option value="ภาษี">ภาษี</option>
                      <option value="ผู้บริโภค">ผู้บริโภค</option>
                      <option value="ครอบครัวและมรดก">ครอบครัวและมรดก</option>
                      <option value="ล้มละลาย">ล้มละลาย</option>
                    </select>
                  </div>

                  <div className="w-1/3">
                    <label className="block mb-1 text-dark-brown">
                      ฝั่งของลูกความ
                    </label>
                    <select
                      className="w-full px-2 py-1.5 border border-[#DADADA] rounded-md focus:outline-none focus:border-[#A17666]"
                      value={caseClientSide}
                      onChange={(e) => setCaseClientSide(e.target.value)}
                    >
                      <option value="" disabled>
                        เลือกฝั่งลูกความ
                      </option>
                      <option value="โจทก์">โจทก์</option>
                      <option value="จำเลย">จำเลย</option>
                      <option value="ผู้ร้อง">ผู้ร้อง</option>
                    </select>
                  </div>

                  <div className="w-1/3">
                    <label className="block mb-1 text-dark-brown">ผลคดี</label>
                    <select
                      className="w-full px-2 py-1.5 border border-[#DADADA] rounded-md focus:outline-none focus:border-[#A17666]"
                      value={caseOutcome}
                      onChange={(e) => setCaseOutcome(e.target.value)}
                    >
                      <option value="" disabled>
                        เลือกผลคดี
                      </option>
                      <option value="ชนะ">ชนะ</option>
                      <option value="แพ้">แพ้</option>
                      <option value="ยอมความ">ยอมความ</option>
                    </select>
                  </div>
                </div>

                {/* วันที่คดีเสร็จสิ้น */}
                <div className="w-1/3">
                  <div className="w-[229.34px]">
                    <label className="block mb-1 text-dark-brown">
                      วันที่คดีเสร็จสิ้น
                    </label>
                    <input
                      type="date"
                      className="w-full px-2 py-1.5 border border-[#DADADA] rounded-md focus:outline-none focus:border-[#A17666]"
                      value={caseCompletionDate}
                      onChange={(e) => setCaseCompletionDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* เอกสารคำพิพากษา */}
                <div className="mb-4">
                  <label className="block mb-2 text-dark-brown">
                    เอกสารคำพิพากษา
                  </label>
                  <div className="w-full p-6 border border-[#DADADA] rounded-lg hover:border-primary transition-colors">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <img
                        src={assets.Upload_File}
                        alt="Upload File"
                        className="w-12 h-12 cursor-pointer"
                      />

                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => setFile(e.target.files[0])}
                          className="hidden"
                        />
                        <span className="px-2 py-1 text-dark-brown text-sm border border-dark-brown rounded hover:bg-dark-brown hover:text-white transition-colors">
                          เลือกไฟล์ PDF
                        </span>
                      </label>

                      {file && (
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <span>{file.name}</span>
                        </div>
                      )}

                      <p className="text-xs text-[#757575]">
                        รองรับไฟล์ PDF ขนาดไม่เกิน 5MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mb-8 mt-8">
                <button
                  className="bg-dark-brown text-white px-6 py-1 rounded"
                  onClick={onSubmitHandler}
                >
                  บันทึกข้อมูล
                </button>
              </div>
            </div>
          </div>
        )}

        <table className="w-full bg-white border-collapse rounded overflow-hidden">
          <thead className="bg-[#D4C7BD]">
            <tr>
              <th className="px-3 py-4 font-medium text-left"></th>
              <th className="px-3 py-4 font-medium text-left">หมายเลขคดี</th>
              <th className="px-3 py-4 font-medium text-left">
                วันที่เสร็จสิ้น
              </th>
              <th className="px-3 py-4 font-medium text-left">ศาลที่พิจารณา</th>
              <th className="px-3 py-4 font-medium text-left">
                ลำดับชั้นของศาล
              </th>
              <th className="px-3 py-4 font-medium text-left">เรื่อง</th>
              <th className="px-3 py-4 font-medium text-left">หมวดหมู่</th>
              <th className="px-3 py-4 font-medium text-left">
                ฝั่งของลูกความ
              </th>
              <th className="px-3 py-4 font-medium text-left">ผลคดี</th>
              <th className="px-3 py-4 font-medium text-left">คำพิพากษา</th>
              <th className="px-3 py-4 font-medium text-left"></th>
            </tr>
          </thead>
          <tbody>
            {currentCases.map((caseItem, index) => (
              <tr
                key={caseItem._id}
                className="border-b border-[#DADADA]"
                style={{ height: "65px" }}
              >
                <td className="px-3 py-4">
                  {(currentPage - 1) * rowsPerPage + index + 1}
                </td>
                <td className="px-3 py-4">{caseItem.caseNumber}</td>
                <td className="px-3 py-4">
                  {new Date(caseItem.caseCompletionDate).toLocaleDateString(
                    "th-TH"
                  )}
                </td>
                <td className="px-3 py-4">{caseItem.courtName}</td>
                <td className="px-3 py-4">
                  <span
                    className={`px-3 rounded ${
                      caseItem.courtLevel === "ศาลชั้นต้น"
                        ? "text-[#D47966] bg-[#D47966] bg-opacity-30"
                        : caseItem.courtLevel === "ศาลอุทธรณ์"
                        ? "text-[#1975A4] bg-[#1975A4] bg-opacity-30"
                        : "text-[#7C3D5F] bg-[#7C3D5F] bg-opacity-30"
                    }`}
                  >
                    {caseItem.courtLevel}
                  </span>
                </td>
                <td className="px-3 py-4">{caseItem.caseTitle}</td>
                <td className="px-3 py-4 text-primary">
                  {caseItem.caseCategory}
                </td>
                <td className="px-3 py-4">{caseItem.caseClientSide}</td>
                <td className="px-3 py-4">
                  <span
                    className={`px-6 rounded-full ${
                      caseItem.caseOutcome === "ชนะ"
                        ? "text-[#008529] bg-[#008529] bg-opacity-20"
                        : caseItem.caseOutcome === "แพ้"
                        ? "text-[#C5211D] bg-[#C5211D] bg-opacity-20"
                        : "text-[#007AFF] bg-[#007AFF] bg-opacity-20"
                    }`}
                  >
                    {caseItem.caseOutcome}
                  </span>
                </td>
                <td className="px-3 py-4 flex items-center justify-center">
                  <img
                    onClick={() => {
                      console.log("caseDocument:", caseItem.caseDocument);
                      setSelectedAppointment(caseItem);
                      setShowPdfModal(true);
                    }}
                    src={assets.File_Lawyer_Icon}
                    alt="ดูเอกสาร"
                    className="w-7 h-7 cursor-pointer"
                  />
                </td>
                <td className="px-3 py-4">
                  <button
                    className="flex items-center justify-center text-white hover:scale-105 transition-transform duration-200"
                    onClick={() => handleDeleteClick(caseItem._id)}
                  >
                    <img
                      src={assets.Delete_2}
                      alt="Delete Icon"
                      className="w-6 h-6"
                    />
                  </button>
                </td>
              </tr>
            ))}
            {Array.from({ length: rowsPerPage - currentCases.length }).map(
              (_, index) => (
                <tr
                  key={`empty-${index}`}
                  className="border-b border-[#DADADA]"
                  style={{ height: "65px" }}
                >
                  <td className="p-4">&nbsp;</td>
                  <td className="p-4">&nbsp;</td>
                  <td className="p-4">&nbsp;</td>
                  <td className="p-4">&nbsp;</td>
                  <td className="p-4">&nbsp;</td>
                  <td className="p-4">&nbsp;</td>
                  <td className="p-4">&nbsp;</td>
                  <td className="p-4">&nbsp;</td>
                  <td className="p-4">&nbsp;</td>
                  <td className="p-4">&nbsp;</td>
                </tr>
              )
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-end mt-2">
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
      </div>
      {showPdfModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-[850px] h-[90vh] overflow-y-auto animate-popupCenter">
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

      
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg w-[500px] animate-popupCenter">
            <div className="flex flex-col items-center gap-4">
              <img
                src={assets.Caution_Icon}
                alt="Caution Icon"
                className="w-10 h-10 cursor-pointer"
              />
              <p className="text-dark-brown font-medium">
                ยืนยัน{" "}
                <span className="text-[#C5211D] text-xl">ลบ</span>{" "}
                ข้อมูลคดีความนี้
              </p>
            </div>

            <div className="flex flex-row justify-center mt-8 gap-2">
              <button
                onClick={cancelDelete}
                className="px-8 py-1 border border-primary text-primary rounded-full hover:bg-primary hover:text-white"
              >
                ปิด
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-1 bg-primary text-white rounded-full hover:bg-[#927663]"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">กำลังบันทึกข้อมูล...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LawyerCase;
