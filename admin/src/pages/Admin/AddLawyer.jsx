import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddLawyer = () => {
  const [lawImg, setLawImg] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [license_number, setLicense_Number] = useState("");
  const [lawyerNationalId, setLawyerNationalId] = useState("");
  const [speciality, setSpeciality] = useState([]);
  const [is_thaibar, setIs_thaibar] = useState(false);
  const [education, setEducation] = useState([
    {
      degree: "",
      institution: "",
      enrollmentYear: "",
      graduationYear: "",
    },
  ]);
  const [work_experience, setWork_experience] = useState([
    {
      startDate: "",
      endDate: "",
      position: "",
      company: "",
    },
  ]);
  const [fees_detail, setFees_detail] = useState("");
  const [bio, setBio] = useState("");
  const [available_slots, setAvailable_slots] = useState([
    {
      day: "",
      startTime: "",
      endTime: "",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const { backendUrl, aToken } = useContext(AdminContext);

  // จัดการการคลิกเลือกความเชี่ยวชาญ
  const handleSpecialityChange = (value) => {
    setSpeciality((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  //ฟังก์ชั่นสำหรับเพิ่มช่วงเวลา
  const handleAddSlot = () => {
    setAvailable_slots([
      ...available_slots,
      {
        day: "",
        startTime: "",
        endTime: "",
      },
    ]);
  };

  // เพิ่มฟังก์ชันสำหรับลบเวลาให้บริการ
  const handleDeleteSlot = (indexToDelete) => {
    setAvailable_slots(
      available_slots.filter((_, index) => index !== indexToDelete)
    );
  };

  // เพิ่มประวัติการศึกษา
  const handleAddEducation = () => {
    setEducation([
      ...education,
      {
        degree: "",
        institution: "",
        enrollmentYear: "",
        graduationYear: "",
      },
    ]);
  };

  // เพิ่มฟังก์ชันสำหรับลบประวัติการศึกษา
  const handleDeleteEducation = (indexToDelete) => {
    setEducation(education.filter((_, index) => index !== indexToDelete));
  };

  // เพิ่มประวัติการทำงาน
  const handleAddWorkExperience = () => {
    setWork_experience([
      ...work_experience,
      {
        startDate: "",
        endDate: "",
        position: "",
        company: "",
      },
    ]);
  };

  // ฟังก์ชันลบประวัติการทำงาน
  const handleDeleteWorkExperience = (indexToDelete) => {
    setWork_experience(
      work_experience.filter((_, index) => index !== indexToDelete)
    );
  };

  //ฟังก์ชันอัปเดตข้อมูลแต่ละช่องของเวลา
  const handleSlotChange = (index, field, value) => {
    const newSlots = [...available_slots];
    newSlots[index][field] = value;
    setAvailable_slots(newSlots);
  };

  //ฟังก์ชันอัปเดตข้อมูลในแต่ละช่องของการศึกษา
  const handleEducationChange = (index, field, value) => {
    const newEducation = [...education];
    newEducation[index][field] = value;
    setEducation(newEducation);
  };

  //ฟังก์ชันอัปเดตข้อมูลในแต่ละช่องของประสบการณ์ทำงาน
  const handleWorkExperienceChange = (index, field, value) => {
    const newWorkExperience = [...work_experience];
    newWorkExperience[index][field] = value;
    setWork_experience(newWorkExperience);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true); // เริ่ม loading

    try {
      //ตรวจสอบรูปแบบและความยาวของเบอร์โทร

      const formData = new FormData();

      formData.append("image", lawImg);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword)
      formData.append("phone", phone.replace(/-/g, ""));
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("license_number", license_number);
      formData.append("lawyerNationalId", lawyerNationalId.replace(/-/g, ""));
      formData.append("speciality", JSON.stringify(speciality));
      formData.append("is_thaibar", is_thaibar);
      formData.append("education", JSON.stringify(education));
      formData.append("work_experience", JSON.stringify(work_experience));
      formData.append("fees_detail", fees_detail);
      formData.append("bio", bio);
      formData.append("available_slots", JSON.stringify(available_slots));

      formData.forEach((value, key) => {
        console.log(`${key} : ${value}`);
      });

      const { data } = await axios.post(
        backendUrl + "/api/admin/add-lawyer",
        formData,
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setLawImg(false);
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setDob("");
        setGender("");
        setLicense_Number("");
        setLawyerNationalId("");
        setSpeciality([]);
        setIs_thaibar(false);
        setEducation([
          {
            degree: "",
            institution: "",
            enrollmentYear: "",
            graduationYear: "",
          },
        ]);
        setWork_experience([
          {
            startDate: "",
            endDate: "",
            position: "",
            company: "",
          },
        ]);
        setFees_detail("");
        setBio("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error);
      console.log(error);
    } finally {
      setIsLoading(false); // จบ loading ไม่ว่าจะสำเร็จหรือไม่
    }
  };

  return (
    <div className="p-8 w-full animate-fadeIn">
      <div className="flex items-start w-full">
        <h1 className="rounded text-dark-brown text-2xl font-medium mb-6">
          ลงทะเบียนทนายความ
        </h1>
      </div>
      <div className="bg-[#F7F7F7] w-[1150px] max-w-7xl min-h-[800px] mt-2 mx-auto px-20 py-10 mb-10 rounded">
        <form onSubmit={onSubmitHandler} className="mt-5">
          <div className="flex items-start">
            {/* รูป*/}
            <div className="w-full">
              <div className="flex flex-col">
                <label
                  htmlFor="lawyer-img"
                  className="flex flex-col items-center"
                >
                  <img
                    src={
                      lawImg ? URL.createObjectURL(lawImg) : assets.Myprofile
                    }
                    alt=""
                    className="w-60 h-60 rounded object-cover"
                  />

                  <button
                    type="button"
                    className="mt-5 py-2 px-4 border border-primary rounded-full text-primary hover:bg-primary hover:text-white"
                    onClick={() =>
                      document.getElementById("lawyer-img").click()
                    }
                  >
                    อัปโหลดรูปภาพ
                  </button>
                </label>

                <input
                  onChange={(e) => setLawImg(e.target.files[0])}
                  type="file"
                  id="lawyer-img"
                  hidden
                />
              </div>
            </div>
          </div>

          {/* กล่องกรอกข้อมูลฟอร์ม */}
          <div className="w-full space-y-4">
            <div>
              <p className="text-dark-brown text-xl mb-5 mt-10">
                ข้อมูลส่วนตัว
              </p>
            </div>

            <div className="flex gap-10">
              <div className="flex flex-col w-1/2">
                <label className="mb-2">ชื่อจริง</label>
                <input
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  type="text"
                  placeholder="ชื่อจริง"
                  className="w-full border border-[#DADADA] rounded p-2"
                />
              </div>

              <div className="flex flex-col w-1/2">
                <label className="mb-2">นามสกุล</label>
                <input
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  type="text"
                  placeholder="นามสกุล"
                  className="w-full border border-[#DADADA] rounded p-2"
                />
              </div>
            </div>

            <div className="flex gap-10">
              <div className="flex flex-col w-1/2">
                <label className="mb-2">วันเกิด</label>
                <input
                  onChange={(e) => setDob(e.target.value)}
                  value={dob}
                  type="date"
                  className="w-full border border-[#DADADA] rounded p-2"
                />
              </div>

              <div className="flex flex-col w-1/2">
                <label className="mb-2">เพศ</label>
                <select
                  onChange={(e) => setGender(e.target.value)}
                  value={gender}
                  className="w-full border border-[#DADADA] rounded p-2"
                >
                  <option value="" disabled>
                    เลือกเพศ
                  </option>
                  <option value="male">ชาย</option>
                  <option value="female">หญิง</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col w-full">
              <label className="mb-2">เบอร์โทร</label>
              <input
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // กรองให้เหลือแค่ตัวเลข
                  const formattedValue = value
                    .replace(/^(\d{3})(?=\d)/, "$1-") // จับ 3 ตัวแรก
                    .replace(/^(\d{3}-\d{3})(?=\d)/, "$1-"); // จับ 3 ตัวถัดไป
                  setPhone(formattedValue);
                }}
                value={phone}
                type="text"
                maxLength={12}
                inputMode="numeric"
                placeholder="เบอร์โทรศัพท์ 10 หลัก"
                className="w-full border border-[#DADADA] rounded p-2"
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="mb-2">อีเมล</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="example@email.com"
                className="w-full border border-[#DADADA] rounded p-2"
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="mb-2">รหัสผ่าน</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="รหัสผ่าน"
                className="w-full border border-[#DADADA] rounded p-2"
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="mb-2">ยืนยันรหัสผ่าน</label>
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                type="password"
                placeholder="ยืนยันรหัสผ่าน"
                className="w-full border border-[#DADADA] rounded p-2"
              />
            </div>
          </div>

          {/* เลขที่ใบอนุญาตว่าความ, บัตรประชาชน */}
          <div>
            <p className="text-dark-brown text-xl mb-5 mt-10">ข้อมูลการทำงาน</p>
          </div>
          <div className="mt-6 flex flex-row gap-10">
            <div className="flex flex-col w-full">
              <label className="mb-2">เลขที่ใบอนุญาตว่าความ</label>
              <input
                onChange={(e) => setLicense_Number(e.target.value)}
                value={license_number}
                type="text"
                placeholder="เลขที่ใบอนุญาตว่าความ"
                className="w-full border border-[#DADADA] rounded p-2"
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="mb-2">บัตรประชาชน</label>
              <input
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // กรองให้เหลือแค่ตัวเลข
                  const formattedValue = value
                    .replace(/^(\d{1})(?=\d)/, "$1-")
                    .replace(/^(\d{1}-\d{4})(?=\d)/, "$1-")
                    .replace(/^(\d{1}-\d{4}-\d{5})(?=\d)/, "$1-")
                    .replace(/^(\d{1}-\d{4}-\d{5}-\d{2})(?=\d)/, "$1-");
                  setLawyerNationalId(formattedValue);
                }}
                value={lawyerNationalId}
                type="text"
                maxLength={17}
                inputMode="numeric"
                placeholder="เลขบัตรประชาชน 13 หลัก"
                className="w-full border border-[#DADADA] rounded p-2"
              />
            </div>
          </div>

          {/* เวลาให้บริการ */}
          <div>
            <p className="text-dark-brown text-lg mb-2 mt-10">เวลาให้บริการ</p>

            {available_slots.map((slot, index) => (
              <div key={index} className="relative mb-6">
                <div className="flex gap-10">
                  <div className="flex flex-col w-1/3">
                    <label className="mb-2">วัน</label>
                    <select
                      value={slot.day}
                      onChange={(e) =>
                        handleSlotChange(index, "day", e.target.value)
                      }
                      className="w-full border border-[#DADADA] rounded p-2"
                    >
                      <option value="" disabled>
                        เลือกวัน
                      </option>
                      <option value="จันทร์">จันทร์</option>
                      <option value="อังคาร">อังคาร</option>
                      <option value="พุธ">พุธ</option>
                      <option value="พฤหัสบดี">พฤหัสบดี</option>
                      <option value="ศุกร์">ศุกร์</option>
                      <option value="เสาร์">เสาร์</option>
                      <option value="อาทิตย์">อาทิตย์</option>
                    </select>
                  </div>

                  <div className="flex flex-col w-1/3">
                    <label className="mb-2">เวลาเริ่มให้คำปรึกษา</label>
                    <select
                      value={slot.startTime}
                      onChange={(e) =>
                        handleSlotChange(index, "startTime", e.target.value)
                      }
                      className="w-full border border-[#DADADA] rounded p-2"
                    >
                      <option value="" disabled>
                        เลือกเวลา
                      </option>
                      <option value="08:00">08:00 น.</option>
                      <option value="08:30">08:30 น.</option>
                      <option value="09:00">09:00 น.</option>
                      <option value="09:30">09:30 น.</option>
                      <option value="10:00">10:00 น.</option>
                      <option value="10:30">10:30 น.</option>
                      <option value="11:00">11:00 น.</option>
                      <option value="11:30">11:30 น.</option>
                      <option value="12:00">12:00 น.</option>
                      <option value="12:30">12:30 น.</option>
                      <option value="13:00">13:00 น.</option>
                      <option value="13:30">13:30 น.</option>
                      <option value="14:00">14:00 น.</option>
                      <option value="14:30">14:30 น.</option>
                      <option value="15:00">15:00 น.</option>
                      <option value="15:30">15:30 น.</option>
                      <option value="16:00">16:00 น.</option>
                      <option value="16:30">16:30 น.</option>
                      <option value="17:00">17:00 น.</option>
                      <option value="17:30">17:30 น.</option>
                      <option value="18:00">18:00 น.</option>
                    </select>
                  </div>

                  <div className="flex flex-col w-1/3">
                    <label className="mb-2">เวลาสิ้นสุดการให้คำปรึกษา</label>
                    <select
                      value={slot.endTime}
                      onChange={(e) =>
                        handleSlotChange(index, "endTime", e.target.value)
                      }
                      className="w-full border border-[#DADADA] rounded p-2"
                    >
                      <option value="" disabled>
                        เลือกเวลา
                      </option>
                      <option value="08:00">08:00 น.</option>
                      <option value="08:30">08:30 น.</option>
                      <option value="09:00">09:00 น.</option>
                      <option value="09:30">09:30 น.</option>
                      <option value="10:00">10:00 น.</option>
                      <option value="10:30">10:30 น.</option>
                      <option value="11:00">11:00 น.</option>
                      <option value="11:30">11:30 น.</option>
                      <option value="12:00">12:00 น.</option>
                      <option value="12:30">12:30 น.</option>
                      <option value="13:00">13:00 น.</option>
                      <option value="13:30">13:30 น.</option>
                      <option value="14:00">14:00 น.</option>
                      <option value="14:30">14:30 น.</option>
                      <option value="15:00">15:00 น.</option>
                      <option value="15:30">15:30 น.</option>
                      <option value="16:00">16:00 น.</option>
                      <option value="16:30">16:30 น.</option>
                      <option value="17:00">17:00 น.</option>
                      <option value="17:30">17:30 น.</option>
                      <option value="18:00">18:00 น.</option>
                    </select>
                  </div>
                </div>

                {/* การแสดงปุ่มลบ */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteSlot(index)}
                    className="mt-2 rounded-full text-white hover:scale-105 transition-transform duration-200"
                  >
                    <img
                      src={assets.Delete}
                      alt="Delete Icon"
                      className="w-6 h-6"
                    />
                  </button>
                )}
              </div>
            ))}

            <div className="flex items-start mt-4">
              <button
                type="button"
                onClick={handleAddSlot}
                className="bg-[#A3806C] text-white py-1 px-6 rounded hover:scale-105 transition-transform duration-200 text-sm"
              >
                เพิ่มเวลาให้บริการ
              </button>
            </div>
          </div>

          {/* ความเชี่ยวชาญ */}
          <div>
            <p className="text-dark-brown text-lg mb-4 mt-10">ความเชี่ยวชาญ</p>
          </div>

          <div className="flex flex-wrap gap-y-4">
            <div className="flex w-full">
              <label className="flex items-center w-[300px]">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={speciality.includes("กฎหมายอาญา")}
                  onChange={() => handleSpecialityChange("กฎหมายอาญา")}
                />
                กฎหมายอาญา
              </label>
              <label className="flex items-center w-[300px]">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={speciality.includes("กฎหมายแรงงาน")}
                  onChange={() => handleSpecialityChange("กฎหมายแรงงาน")}
                />
                กฎหมายแรงงาน
              </label>
            </div>
            <div className="flex w-full">
              <label className="flex items-center w-[300px]">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={speciality.includes("กฎหมายยาเสพติด")}
                  onChange={() => handleSpecialityChange("กฎหมายยาเสพติด")}
                />
                กฎหมายยาเสพติด
              </label>
              <label className="flex items-center w-[300px]">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={speciality.includes("กฎหมายแพ่ง")}
                  onChange={() => handleSpecialityChange("กฎหมายแพ่ง")}
                />
                กฎหมายแพ่ง
              </label>
            </div>
            <div className="flex w-full">
              <label className="flex items-center w-[300px]">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={speciality.includes("กฎหมายทรัพย์สินทางปัญญา")}
                  onChange={() =>
                    handleSpecialityChange("กฎหมายทรัพย์สินทางปัญญา")
                  }
                />
                กฎหมายทรัพย์สินทางปัญญา
              </label>
              <label className="flex items-center w-[300px]">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={speciality.includes("กฎหมายภาษี")}
                  onChange={() => handleSpecialityChange("กฎหมายภาษี")}
                />
                กฎหมายภาษี
              </label>
            </div>

            <div className="flex w-full">
              <label className="flex items-center w-[300px]">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={speciality.includes("กฎหมายผู้บริโภค")}
                  onChange={() => handleSpecialityChange("กฎหมายผู้บริโภค")}
                />
                กฎหมายผู้บริโภค
              </label>
              <label className="flex items-center w-[300px]">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={speciality.includes("กฎหมายครอบครัวและมรดก")}
                  onChange={() =>
                    handleSpecialityChange("กฎหมายครอบครัวและมรดก")
                  }
                />
                กฎหมายครอบครัวและมรดก
              </label>
            </div>

            <div className="flex w-full">
              <label className="flex items-center w-[300px]">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={speciality.includes("กฎหมายล้มละลาย")}
                  onChange={() => handleSpecialityChange("กฎหมายล้มละลาย")}
                />
                กฎหมายล้มละลาย
              </label>
            </div>
          </div>

          <div>
            <p className="text-dark-brown text-lg mb-4 mt-10">เนติบัณฑิต</p>
          </div>

          <div className="flex w-1/3">
            <label className="flex items-center w-[300px]">
              <input
                type="checkbox"
                className="mr-2"
                checked={is_thaibar}
                onChange={(e) => setIs_thaibar(e.target.checked)}
              />
              เนติบัณฑิต
            </label>
          </div>

          {/* ประวัติการศึกษา */}
          <div>
            <p className="text-dark-brown text-lg mb-4 mt-10">
              ประวัติการศึกษา
            </p>
          </div>

          {education.map((edu, index) => (
            <div key={index} className="mb-8 relative">
              {/* เพิ่ม relative */}
              <div className="flex gap-10 mb-2">
                <div className="flex flex-col w-1/2">
                  <label className="mb-2">ปีที่เริ่มการศึกษา</label>
                  <input
                    type="text"
                    value={edu.enrollmentYear}
                    placeholder="ปีที่เริ่มการศึกษา"
                    onChange={(e) =>
                      handleEducationChange(
                        index,
                        "enrollmentYear",
                        e.target.value
                      )
                    }
                    className="w-full border border-[#DADADA] rounded p-2"
                  />
                </div>

                <div className="flex flex-col w-1/2">
                  <label className="mb-2">ปีที่จบการศึกษา</label>
                  <input
                    type="text"
                    value={edu.graduationYear}
                    placeholder="ปีที่จบการศึกษา"
                    onChange={(e) =>
                      handleEducationChange(
                        index,
                        "graduationYear",
                        e.target.value
                      )
                    }
                    className="w-full border border-[#DADADA] rounded p-2"
                  />
                </div>
              </div>
              <div className="flex gap-10">
                <div className="flex flex-col w-1/2">
                  <label className="mb-2">ระดับการศึกษาและสาขาวิชา</label>
                  <input
                    type="text"
                    value={edu.degree}
                    placeholder="ระดับการศึกษาและสาขาวิชา"
                    onChange={(e) =>
                      handleEducationChange(index, "degree", e.target.value)
                    }
                    className="w-full border border-[#DADADA] rounded p-2"
                  />
                </div>

                <div className="flex flex-col w-1/2">
                  <label className="mb-2">สถาบันการศึกษา</label>
                  <input
                    type="text"
                    value={edu.institution}
                    placeholder="สถาบันการศึกษา"
                    onChange={(e) =>
                      handleEducationChange(
                        index,
                        "institution",
                        e.target.value
                      )
                    }
                    className="w-full border border-[#DADADA] rounded p-2"
                  />
                </div>
              </div>
              {/* ปุ่มลบ */}
              {index > 0 && (
                <button
                  onClick={() => handleDeleteEducation(index)}
                  className="mt-2 rounded-full text-white hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={assets.Delete}
                    alt="Delete Icon"
                    className="w-6 h-6"
                  />
                </button>
              )}
            </div>
          ))}

          <div className="flex items-start mt-4">
            <button
              type="button"
              onClick={handleAddEducation}
              className="bg-[#A3806C] text-white py-1 px-6 rounded hover:scale-105 transition-transform duration-200 text-sm"
            >
              เพิ่มประวัติการศึกษา
            </button>
          </div>

          {/* ประวัติการทำงาน */}
          <div>
            <p className="text-dark-brown text-lg mb-4 mt-10">
              ประวัติการทำงาน
            </p>
          </div>

          {work_experience.map((work, index) => (
            <div key={index} className="mb-8 relative">
              {/* เพิ่ม relative */}
              <div className="flex gap-10 mb-4">
                <div className="flex flex-col w-1/2">
                  <label className="mb-2">ปีที่เริ่มการทำงาน</label>
                  <input
                    type="text"
                    value={work.startDate}
                    placeholder="ปีที่เริ่มการทำงาน"
                    onChange={(e) =>
                      handleWorkExperienceChange(
                        index,
                        "startDate",
                        e.target.value
                      )
                    }
                    className="w-full border border-[#DADADA] rounded p-2"
                  />
                </div>

                <div className="flex flex-col w-1/2">
                  <label className="mb-2">ปีที่สิ้นสุดการทำงาน</label>
                  <input
                    type="text"
                    value={work.endDate}
                    placeholder="ปีที่สิ้นสุดการทำงาน"
                    onChange={(e) =>
                      handleWorkExperienceChange(
                        index,
                        "endDate",
                        e.target.value
                      )
                    }
                    className="w-full border border-[#DADADA] rounded p-2"
                  />
                </div>
              </div>
              <div className="flex gap-10">
                <div className="flex flex-col w-1/2">
                  <label className="mb-2">ตำแหน่ง/อาชีพ</label>
                  <input
                    type="text"
                    value={work.position}
                    placeholder="ตำแหน่ง/อาชีพ"
                    onChange={(e) =>
                      handleWorkExperienceChange(
                        index,
                        "position",
                        e.target.value
                      )
                    }
                    className="w-full border border-[#DADADA] rounded p-2"
                  />
                </div>

                <div className="flex flex-col w-1/2">
                  <label className="mb-2">สถานประกอบการ</label>
                  <input
                    type="text"
                    value={work.company}
                    placeholder="สถานประกอบการ"
                    onChange={(e) =>
                      handleWorkExperienceChange(
                        index,
                        "company",
                        e.target.value
                      )
                    }
                    className="w-full border border-[#DADADA] rounded p-2"
                  />
                </div>
              </div>
              {/* ปุ่มลบ */}
              {index > 0 && (
                <button
                  onClick={() => handleDeleteWorkExperience(index)}
                  className="mt-2 flex items-center justify-center rounded-full text-white hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={assets.Delete}
                    alt="Delete Icon"
                    className="w-6 h-6"
                  />
                </button>
              )}
            </div>
          ))}

          <div className="flex items-start mt-4">
            <button
              type="button"
              onClick={handleAddWorkExperience}
              className="bg-[#A3806C] text-white py-1 px-6 rounded hover:scale-105 transition-transform duration-200 text-sm"
            >
              เพิ่มประวัติการทำงาน
            </button>
          </div>

          <div>
            <p className="text-dark-brown text-lg mb-4 mt-10">
              ค่าบริการและแนะนำตัว
            </p>
          </div>

          {/* ส่วนของค่าบริการ */}
          <div className="flex items-center gap-2 w-full">
            <label className="whitespace-nowrap w-[210px]">ค่าบริการ</label>
            <label className="whitespace-nowrap">ขั้นต่ำ</label>
            <input
              onChange={(e) => setFees_detail(e.target.value)}
              value={fees_detail}
              type="number"
              placeholder="ค่าบริการขั้นต่ำ"
              className="w-[200px] border border-[#DADADA] rounded p-2 mx-4"
            />
            <label className="whitespace-nowrap">บาท ต่อ 30 นาที</label>
          </div>

          {/* ส่วนของแนะนำตัว */}
          <div className="flex  w-full mt-6">
            <label className="whitespace-nowrap w-[200px]">
              แนะนำตัว/ข้อมูลเพิ่มเติม
            </label>
            <textarea
              onChange={(e) => setBio(e.target.value)}
              value={bio}
              placeholder="แนะนำตัว"
              className="w-[800px] border border-[#DADADA] rounded p-2 h-[120px] ml-4"
            />
          </div>

          {/* ปุ่มยืนยัน */}
          <div className="flex justify-center mt-10">
            <button
              type="submit"
              className="bg-[#A3806C] text-white py-2 px-8 rounded-full hover:scale-105 transition-transform duration-200"
            >
              ลงทะเบียน
            </button>
          </div>

          {/* Loading Overlay */}
          {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-gray-600">กำลังบันทึกข้อมูล...</p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddLawyer;
