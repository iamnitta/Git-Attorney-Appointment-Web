import React, { useContext, useEffect, useState } from "react";
import { LawyerContext } from "../../context/LawyerContext";
import axios from "axios";
import { toast } from "react-toastify";

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

  const { backendUrl, lawyerToken, cases, getCases, courts, getCourts } =
    useContext(LawyerContext);

  // เพิ่มฟังก์ชันสำหรับจัดการเมื่อเลือกศาล
  const handleCourtSelect = (e) => {
    const selectedCourtName = e.target.value;
    const selectedCourt = courts.find(
      (court) => court.courtName === selectedCourtName
    );
    if (selectedCourt) {
      setCourtName(selectedCourt.courtName);
      setCourtLevel(selectedCourt.courtLevel);
    }
  };

  //ฟังก์ชั่นสำหรับส่งข้อมูลไป backend
  const onSubmitHandler = async (event) => {
    try {
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
        getCases();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  useEffect(() => {
    if (lawyerToken) {
      getCases();
      getCourts();
    }
  }, [lawyerToken]);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">ข้อมูลการว่าความ</h1>
      <h2 className="text-xl mb-4">ทั้งหมด 5</h2>
      <div className="bg-white shadow-md p-6">
        <div className="flex justify-end items-center mb-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xl bg-dark-brown text-white px-4 py-2 rounded-full mb-4"
          >
            + เพิ่มบันทึกคดีความ
          </button>
        </div>
        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
              <div className="relative p-6">
                <div className="absolute right-8 top-1/2 -translate-y-1/2">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <h2 className="text-2xl text-center">บันทึกการว่าความ</h2>
              </div>

              <div className="p-8 pt-2 space-y-4 overflow-y-auto">
                <div className="flex gap-4">
                  <div className="w-1/4">
                    <label className="block mb-2">หมายเลขคดี</label>
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      placeholder="หมายเลขคดี"
                      value={caseNumber}
                      onChange={(e) => setCaseNumber(e.target.value)}
                    />
                  </div>

                  <div className="w-2/4">
                    <label className="block mb-2">ศาลที่พิจารณา</label>
                    <select
                      className="w-full border rounded p-2"
                      value={courtName}
                      onChange={handleCourtSelect}
                    >
                      <option value="" disabled>เลือกศาล</option>
                      {courts.map((court) => (
                        <option key={court._id} value={court.courtName}>
                          {court.courtName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-1/4">
                    <label className="block mb-2">ลำดับชั้นของศาล</label>
                    <input
                      type="text"
                      className="w-full border rounded p-2 bg-gray-100"
                      value={courtLevel}
                      readOnly
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-1/4">
                    <label className="block mb-2">วันที่คดีเสร็จสิ้น</label>
                    <input
                      type="date"
                      className="w-full border rounded p-2"
                      value={caseCompletionDate}
                      onChange={(e) => setCaseCompletionDate(e.target.value)}
                    />
                  </div>
                  <div className="w-2/4">
                    <label className="block mb-2">เรื่อง</label>
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      placeholder="เรื่องของคดีความ"
                      value={caseTitle}
                      onChange={(e) => setCaseTitle(e.target.value)}
                    />
                  </div>
                  <div className="w-1/4">
                    <label className="block mb-2">หมวดหมู่กฎหมาย</label>
                    <select
                      className="w-full border rounded p-2"
                      value={caseCategory}
                      onChange={(e) => setCaseCategory(e.target.value)}
                    >
                      <option value="" disabled>
                        เลือกหมวดหมู่
                      </option>
                      <option value="อาญา">อาญา</option>
                      <option value="แพ่ง">แพ่ง</option>
                      <option value="ปกครอง">ปกครอง</option>
                      <option value="ล้มละลาย">ล้มละลาย</option>
                      <option value="แรงงาน">แรงงาน</option>
                      <option value="ภาษีอากร">ภาษีอากร</option>
                      <option value="ทรัพย์สินทางปัญญา">
                        ทรัพย์สินทางปัญญา
                      </option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-1/4">
                    <label className="block mb-2">ฝั่งของลูกความ</label>
                    <select
                      className="w-full border rounded p-2"
                      value={caseClientSide}
                      onChange={(e) => setCaseClientSide(e.target.value)}
                    >
                      <option value="" disabled>
                        เลือกฝั่งลูกความ
                      </option>
                      <option value="โจทย์">โจทย์</option>
                      <option value="จำเลย">จำเลย</option>
                      <option value="ผู้ร้อง">ผู้ร้อง</option>
                    </select>
                  </div>
                  <div className="w-1/4">
                    <label className="block mb-2">ผลคดี</label>
                    <select
                      className="w-full border rounded p-2"
                      value={caseOutcome}
                      onChange={(e) => setCaseOutcome(e.target.value)}
                    >
                      <option value="" disabled>
                        เลือกผลคดี
                      </option>
                      <option value="ชนะ">ชนะ</option>
                      <option value="แพ้">แพ้</option>
                      <option value="ประณีประณอม">ประณีประณอม</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-2">เอกสารคำพิพากษา</label>
                  <div className="w-full p-6 border-2 border-dashed border-[#DADADA] rounded-lg hover:border-dark-brown transition-colors">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>

                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                        />
                        <span className="px-4 py-2 bg-dark-brown text-white rounded-full hover:bg-[#2C1810] transition-colors">
                          เลือกไฟล์ PDF
                        </span>
                      </label>

                      <p className="text-xs text-gray-500">
                        *รองรับไฟล์ PDF ขนาดไม่เกิน 5MB
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    className="bg-dark-brown text-white px-6 py-2 rounded-full"
                    onClick={onSubmitHandler}
                  >
                    บันทึกข้อมูล
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <table className="w-full border-collapse rounded overflow-hidden">
          <thead className="bg-[#D4C7BD]">
            <tr>
              <th className="p-4 font-medium text-left"></th>
              <th className="p-4 font-medium text-left">หมายเลขคดี</th>
              <th className="p-4 font-medium text-left">วันที่เสร็จสิ้น</th>
              <th className="p-4 font-medium text-left">ศาลที่พิจารณา</th>
              <th className="p-4 font-medium text-left">ลำดับชั้นของศาล</th>
              <th className="p-4 font-medium text-left">เรื่อง</th>
              <th className="p-4 font-medium text-left">หมวดหมู่</th>
              <th className="p-4 font-medium text-left">ฝั่งลูกความ</th>
              <th className="p-4 font-medium text-left">ผลคดี</th>
              <th className="p-4 font-medium text-left">คำพิพากษา</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((caseItem, index) => (
              <tr key={caseItem._id} className="border-b border-[#D4C7BD]">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{caseItem.caseNumber}</td>
                <td className="p-4">
                  {new Date(caseItem.caseCompletionDate).toLocaleDateString(
                    "th-TH"
                  )}
                </td>
                <td className="p-4">{caseItem.courtName}</td>
                <td className="p-4">{caseItem.courtLevel}</td>
                <td className="p-4">{caseItem.caseTitle}</td>
                <td className="p-4">{caseItem.caseCategory}</td>
                <td className="p-4">{caseItem.caseClientSide}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded ${
                      caseItem.caseOutcome === "ชนะ"
                        ? "bg-green-100"
                        : caseItem.caseOutcome === "แพ้"
                        ? "bg-red-100"
                        : "bg-yellow-100"
                    }`}
                  >
                    {caseItem.caseOutcome}
                  </span>
                </td>
                <td className="p-4">
                  <button className="p-2">
                    <i className="fas fa-file-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center gap-2 mt-4">
          <button className="px-3 py-1 border rounded">&lt;</button>
          <button className="px-3 py-1 border rounded bg-gray-200">1</button>
          <button className="px-3 py-1 border rounded">2</button>
          <button className="px-3 py-1 border rounded">&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default LawyerCase;
