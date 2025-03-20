import React, { useContext, useEffect, useState } from "react";
import { LawyerContext } from "../../context/LawyerContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const LawyerProfile = () => {
  const {
    lawyerToken,
    profileData,
    setProfileData,
    getProfileData,
    backendUrl,
  } = useContext(LawyerContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = async (event) => {
    try {
      setIsLoading(true);

      const formData = new FormData();

      formData.append("fees_detail", profileData.fees_detail);
      formData.append("bio", profileData.bio);
      formData.append("firstName", profileData.firstName);
      formData.append("lastName", profileData.lastName);
      formData.append("phone", profileData.phone);
      formData.append("gender", profileData.gender);
      formData.append("dob", profileData.dob);
      formData.append("is_thaibar", profileData.is_thaibar);

      formData.append("speciality", JSON.stringify(profileData.speciality));
      formData.append(
        "work_experience",
        JSON.stringify(profileData.work_experience)
      );
      formData.append("education", JSON.stringify(profileData.education));
      formData.append(
        "available_slots",
        JSON.stringify(profileData.available_slots)
      );

      if (image) {
        formData.append("image", image);
      }

      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const { data } = await axios.post(
        backendUrl + "/api/lawyer/update-profile",
        formData,
        { headers: { lawyerToken, "Content-Type": "multipart/form-data" } }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ฟังก์ชันสำหรับเพิ่มประวัติการทำงาน
  const handleAddWorkExperience = () => {
    setProfileData((prev) => ({
      ...prev,
      work_experience: [
        ...(prev.work_experience || []),
        {
          startDate: "",
          endDate: "",
          position: "",
          company: "",
        },
      ],
    }));
  };

  // ฟังก์ชันสำหรับลบประวัติการทำงาน
  const handleDeleteWorkExperience = (index) => {
    const updatedWorkExperience = [...profileData.work_experience];
    updatedWorkExperience.splice(index, 1);
    setProfileData((prev) => ({
      ...prev,
      work_experience: updatedWorkExperience,
    }));
  };

  // ฟังก์ชันสำหรับเพิ่มประวัติการศึกษา
  const handleAddEducation = () => {
    setProfileData((prev) => ({
      ...prev,
      education: [
        ...(prev.education || []),
        {
          enrollmentYear: "",
          graduationYear: "",
          degree: "",
          institution: "",
        },
      ],
    }));
  };

  // ฟังก์ชันสำหรับลบประวัติการศึกษา
  const handleDeleteEducation = (index) => {
    const updatedEducation = [...profileData.education];
    updatedEducation.splice(index, 1);
    setProfileData((prev) => ({
      ...prev,
      education: updatedEducation,
    }));
  };

  // ฟังก์ชันสำหรับเพิ่มเวลาให้บริการ
  const handleAddSlot = () => {
    setProfileData((prev) => ({
      ...prev,
      available_slots: [
        ...(prev.available_slots || []),
        {
          day: "จันทร์",
          startTime: "09:00",
          endTime: "17:00",
        },
      ],
    }));
  };

  // ฟังก์ชันสำหรับลบเวลาให้บริการ
  const handleDeleteSlot = (index) => {
    const updatedSlots = [...profileData.available_slots];
    updatedSlots.splice(index, 1);
    setProfileData((prev) => ({
      ...prev,
      available_slots: updatedSlots,
    }));
  };

  useEffect(() => {
    if (lawyerToken) {
      getProfileData();
    }
  }, [lawyerToken]);

  return (
    <div className="p-8 w-full animate-fadeIn">
      <div className="flex items-start w-full">
        <h1 className="rounded text-dark-brown text-2xl font-medium mb-6">
          ข้อมูลทนายความ
        </h1>
      </div>
      <div className="bg-[#FFFFFF] w-full max-w-7xl min-h-[800px] mt-2 mx-auto px-20 py-10 mb-10">
        <div className="border border-[#E7E7E7] rounded p-8">
          <div className="flex items-start">
            {/* รูปโปรไฟล์ */}
            <div className="w-full">
              <div className="flex flex-col">
                <div className="flex flex-col items-center">
                  {isEdit ? (
                    <label htmlFor="image">
                      <div className="relative w-60 h-60 rounded cursor-pointer">
                        <img
                          className="w-full h-full rounded opacity-50 object-cover"
                          src={
                            image
                              ? URL.createObjectURL(image)
                              : profileData.image || ""
                          }
                          alt=""
                        />
                        {!image && (
                          <img
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 object-cover"
                            src={assets.Upload_Icon1}
                            alt=""
                          />
                        )}
                      </div>
                      <input
                        onChange={(e) => setImage(e.target.files[0])}
                        type="file"
                        id="image"
                        hidden
                        accept="image/*"
                      />
                    </label>
                  ) : (
                    <img
                      src={profileData.image || ""}
                      alt=""
                      className="w-60 h-60 rounded object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ข้อมูลส่วนตัว */}
          <div className="w-full space-y-4">
            <div>
              <p className="text-dark-brown text-xl mb-5 mt-10 font-medium">
                ข้อมูลส่วนตัว
              </p>
            </div>

            {/* ชื่อจริง, นามสกุุล */}
            <div className="flex gap-10">
              <div className="flex flex-col w-1/2">
                <label className="mb-2 text-dark-brown">ชื่อจริง</label>
                {isEdit ? (
                  <input
                    className="w-full p-2 border border-[#DADADA] rounded"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    value={profileData.firstName || ""}
                  />
                ) : (
                  <p className="text-lg">{profileData.firstName || ""}</p>
                )}
              </div>

              <div className="flex flex-col w-1/2">
                <label className="mb-2 text-dark-brown">นามสกุล</label>
                {isEdit ? (
                  <input
                    className="w-full p-2 border border-[#DADADA] rounded"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    value={profileData.lastName || ""}
                  />
                ) : (
                  <p className="text-lg">{profileData.lastName || ""}</p>
                )}
              </div>
            </div>

            {/* วันเกิด, เพศ */}
            <div className="flex gap-10">
              <div className="flex flex-col w-1/2">
                <label className="mb-2 text-dark-brown">วันเกิด</label>
                {isEdit ? (
                  <input
                    type="date"
                    className="w-full p-2 border border-[#DADADA] rounded"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        dob: e.target.value,
                      }))
                    }
                    value={profileData.dob || ""}
                  />
                ) : (
                  <p className="text-lg">
                    {profileData.dob
                      ? new Date(profileData.dob).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : ""}
                  </p>
                )}
              </div>

              <div className="flex flex-col w-1/2">
                <label className="mb-2 text-dark-brown">เพศ</label>
                {isEdit ? (
                  <select
                    className="w-full p-2 border border-[#DADADA] rounded"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                    value={profileData.gender || ""}
                  >
                    <option value="male">ชาย</option>
                    <option value="female">หญิง</option>
                  </select>
                ) : (
                  <p className="text-lg">
                    {profileData.gender === "male" ? "ชาย" : "หญิง"}
                  </p>
                )}
              </div>
            </div>

            {/* เบอร์โทร, อีเมล */}
            <div className="flex flex-col w-full">
              <label className="mb-2 text-dark-brown">เบอร์โทร</label>
              {isEdit ? (
                <input
                  className="w-full p-2 border border-[#DADADA] rounded"
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  value={profileData.phone || ""}
                />
              ) : (
                <p className="text-lg">{profileData.phone || ""}</p>
              )}
            </div>

            <div className="flex flex-col w-full">
              <label className="mb-2 text-dark-brown">อีเมล</label>
              <p className="text-lg">{profileData.email || ""}</p>
            </div>
          </div>
        </div>

        <div className="border border-[#E7E7E7] rounded p-8 mt-8">
          {/* ข้อมูลการทำงาน */}
          <div>
            <p className="text-dark-brown text-xl mb-5 mt-4 font-medium">
              ข้อมูลการทำงาน
            </p>
          </div>

          {/* เลขที่ใบอนุญาตว่าความ, บัตรประชาชน */}
          <div className="mt-6 flex flex-row gap-10">
            <div className="flex flex-col w-full">
              <label className="mb-2 text-dark-brown">
                เลขที่ใบอนุญาตว่าความ
              </label>
              <p className="text-lg">{profileData.license_number || ""}</p>
            </div>

            <div className="flex flex-col w-full">
              <label className="mb-2 text-dark-brown">บัตรประชาชน</label>
              <p className="text-lg">{profileData.lawyerNationalId || ""}</p>
            </div>
          </div>

          {/* เวลาให้บริการ */}
          <div>
            <p className="text-dark-brown text-lg mb-2 mt-10 font-medium">
              เวลาให้บริการ
            </p>

            {/* วัน เวลา */}
            <div className="space-y-4">
              {profileData.available_slots?.map((slot, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <div className="flex flex-row w-full gap-10">
                    <div className="flex flex-col w-1/3">
                      <label className="mb-2 text-dark-brown">วัน</label>
                      {isEdit ? (
                        <select
                          className="border border-[#DADADA] rounded p-2 bg-white"
                          value={slot.day || ""}
                          onChange={(e) => {
                            const updatedSlots = [
                              ...profileData.available_slots,
                            ];
                            updatedSlots[index] = {
                              ...updatedSlots[index],
                              day: e.target.value,
                            };
                            setProfileData((prev) => ({
                              ...prev,
                              available_slots: updatedSlots,
                            }));
                          }}
                        >
                          <option value="จันทร์">จันทร์</option>
                          <option value="อังคาร">อังคาร</option>
                          <option value="พุธ">พุธ</option>
                          <option value="พฤหัสบดี">พฤหัสบดี</option>
                          <option value="ศุกร์">ศุกร์</option>
                          <option value="เสาร์">เสาร์</option>
                          <option value="อาทิตย์">อาทิตย์</option>
                        </select>
                      ) : (
                        <p className="text-lg">{slot.day || ""}</p>
                      )}
                    </div>
                    <div className="flex flex-col w-1/3">
                      <label className="mb-2 text-dark-brown">
                        เวลาเริ่มให้คำปรึกษา
                      </label>
                      {isEdit ? (
                        <select
                          type="time"
                          className="border border-[#DADADA] rounded p-2 bg-white"
                          value={slot.startTime || ""}
                          onChange={(e) => {
                            const updatedSlots = [
                              ...profileData.available_slots,
                            ];
                            updatedSlots[index] = {
                              ...updatedSlots[index],
                              startTime: e.target.value,
                            };
                            setProfileData((prev) => ({
                              ...prev,
                              available_slots: updatedSlots,
                            }));
                          }}
                        >
                          <option value="08:00">08:00</option>
                          <option value="09:00">09:00</option>
                          <option value="10:00">10:00</option>
                          <option value="11:00">11:00</option>
                          <option value="12:00">12:00</option>
                          <option value="13:00">13:00</option>
                          <option value="14:00">14:00</option>
                          <option value="15:00">15:00</option>
                          <option value="16:00">16:00</option>
                          <option value="17:00">17:00</option>
                          <option value="18:00">18:00</option>
                        </select>
                      ) : (
                        <p className="text-lg">{slot.startTime || ""}</p>
                      )}
                    </div>
                    <div className="flex flex-col w-1/3">
                      <label className="mb-2 text-dark-brown">
                        เวลาสิ้นสุดการให้คำปรึกษา
                      </label>
                      {isEdit ? (
                        <select
                          type="time"
                          className="border border-[#DADADA] rounded p-2 bg-white"
                          value={slot.endTime || ""}
                          onChange={(e) => {
                            const updatedSlots = [
                              ...profileData.available_slots,
                            ];
                            updatedSlots[index] = {
                              ...updatedSlots[index],
                              endTime: e.target.value,
                            };
                            setProfileData((prev) => ({
                              ...prev,
                              available_slots: updatedSlots,
                            }));
                          }}
                        >
                          <option value="08:00">08:00</option>
                          <option value="09:00">09:00</option>
                          <option value="10:00">10:00</option>
                          <option value="11:00">11:00</option>
                          <option value="12:00">12:00</option>
                          <option value="13:00">13:00</option>
                          <option value="14:00">14:00</option>
                          <option value="15:00">15:00</option>
                          <option value="16:00">16:00</option>
                          <option value="17:00">17:00</option>
                          <option value="18:00">18:00</option>
                        </select>
                      ) : (
                        <p className="text-lg">{slot.endTime || ""}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    {isEdit ? (
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
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {isEdit ? (
              <div className="flex items-start mt-4">
                <button
                  type="button"
                  onClick={handleAddSlot}
                  className="bg-[#A3806C] text-white py-1 px-6 rounded hover:scale-105 transition-transform duration-200 text-sm"
                >
                  เพิ่มเวลาให้บริการ
                </button>
              </div>
            ) : (
              <div></div>
            )}
          </div>

          {/* ความเชี่ยวชาญ */}
          <div>
            <p className="text-dark-brown text-lg mb-4 mt-10 font-medium">
              ความเชี่ยวชาญ
            </p>
            {isEdit ? (
              <div className="flex flex-wrap gap-y-4">
                {[
                  "กฎหมายอาญา",
                  "กฎหมายแรงงาน",
                  "กฎหมายยาเสพติด",
                  "กฎหมายแพ่ง",
                  "กฎหมายทรัพย์สินทางปัญญา",
                  "กฎหมายภาษี",
                  "กฎหมายผู้บริโภค",
                  "กฎหมายครอบครัวและมรดก",
                  "กฎหมายล้มละลาย",
                ].map((itemspecialty, index) => (
                  <label
                    key={index}
                    className="flex items-center w-[300px] mb-2"
                  >
                    <input
                      type="checkbox"
                      className="mr-2"
                      //ถ้าทนายมีความเชี่ยวชาญใน database ซ้ำกับที่นำมาวนลูปให้ติ้กถูกหน้าอันที่ซ้ำ
                      checked={profileData.speciality?.includes(itemspecialty)}
                      onChange={(e) => {
                        //ถ้าเช็คบ็อคถูกเลือก ก็ให้สร้าง array ใหม่และเอาอันที่ถูกเลือกเพิ่มเข้าไป
                        if (e.target.checked) {
                          setProfileData((prev) => ({
                            ...prev,
                            speciality: [
                              ...(prev.speciality || []),
                              itemspecialty,
                            ],
                          }));
                        } else {
                          //ถ้าเช็คบ็อคถูกยกเลิกการเลือก ก็สร้าง array ใหม่
                          setProfileData((prev) => ({
                            ...prev,
                            speciality: prev.speciality?.filter(
                              (item) => item !== itemspecialty
                            ),
                          }));
                        }
                      }}
                    />
                    {itemspecialty}
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profileData.speciality?.map((item, index) => (
                  <span
                    key={index}
                    className="bg-primary text-white px-3 py-1 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* เนติบัณฑิต */}
          <div>
            <p className="text-dark-brown text-lg mb-4 mt-10 font-medium">
              เนติบัณฑิต
            </p>
            {isEdit ? (
              <div className="flex w-1/3">
                <label className="flex items-center w-[300px]">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={profileData.is_thaibar}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        is_thaibar: e.target.checked,
                      }))
                    }
                  />
                  เนติบัณฑิต
                </label>
              </div>
            ) : (
              <div className="flex w-1/3">
                <label className="flex items-center w-[300px]">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={profileData.is_thaibar}
                    disabled
                  />
                  เนติบัณฑิต
                </label>
              </div>
            )}
          </div>

          {/* ประวัติการศึกษา */}
          <div>
            <p className="text-dark-brown text-lg mb-4 mt-10 font-medium">
              ประวัติการศึกษา
            </p>
            {profileData.education?.map((edu, index) => (
              <div key={index} className="mb-8 relative">
                {/* เพิ่ม relative */}
                <div className="flex gap-10 mb-2">
                  <div className="flex flex-col w-1/2">
                    <label className="mb-2 text-dark-brown">
                      ปีที่เริ่มการศึกษา
                    </label>
                    {isEdit ? (
                      <input
                        type="text"
                        className="w-full border border-[#DADADA] rounded p-2"
                        value={edu.enrollmentYear || ""}
                        onChange={(e) => {
                          const updateEducation = [...profileData.education];
                          updateEducation[index] = {
                            ...updateEducation[index],
                            enrollmentYear: e.target.value,
                          };
                          setProfileData((prev) => ({
                            ...prev,
                            education: updateEducation,
                          }));
                        }}
                      />
                    ) : (
                      <p className="text-lg">{edu.enrollmentYear || ""}</p>
                    )}
                  </div>

                  <div className="flex flex-col w-1/2">
                    <label className="mb-2 text-dark-brown">
                      ปีที่จบการศึกษา
                    </label>
                    {isEdit ? (
                      <input
                        type="text"
                        className="w-full border border-[#DADADA] rounded p-2"
                        value={edu.graduationYear || ""}
                        onChange={(e) => {
                          const updateEducation = [...profileData.education];
                          updateEducation[index] = {
                            ...updateEducation[index],
                            graduationYear: e.target.value,
                          };
                          setProfileData((prev) => ({
                            ...prev,
                            education: updateEducation,
                          }));
                        }}
                      />
                    ) : (
                      <p className="text-lg">{edu.graduationYear || ""}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-10">
                  <div className="flex flex-col w-1/2">
                    <label className="mb-2 text-dark-brown">
                      ระดับการศึกษาและสาขาวิชา
                    </label>
                    {isEdit ? (
                      <input
                        type="text"
                        className="w-full border border-[#DADADA] rounded p-2"
                        value={edu.degree || ""}
                        onChange={(e) => {
                          const updateEducation = [...profileData.education];
                          updateEducation[index] = {
                            ...updateEducation[index],
                            degree: e.target.value,
                          };
                          setProfileData((prev) => ({
                            ...prev,
                            education: updateEducation,
                          }));
                        }}
                      />
                    ) : (
                      <p className="text-lg">{edu.degree || ""}</p>
                    )}
                  </div>

                  <div className="flex flex-col w-1/2">
                    <label className="mb-2 text-dark-brown">
                      สถาบันการศึกษา
                    </label>
                    {isEdit ? (
                      <input
                        type="text"
                        className="w-full border border-[#DADADA] rounded p-2"
                        value={edu.institution || ""}
                        onChange={(e) => {
                          const updateEducation = [...profileData.education];
                          updateEducation[index] = {
                            ...updateEducation[index],
                            institution: e.target.value,
                          };
                          setProfileData((prev) => ({
                            ...prev,
                            education: updateEducation,
                          }));
                        }}
                      />
                    ) : (
                      <p className="text-lg">{edu.institution || ""}</p>
                    )}
                  </div>
                </div>

                {/* ปุ่มลบ */}
                {isEdit ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteEducation(index)}
                    className="mt-2 rounded-full text-white hover:scale-105 transition-transform duration-200"
                  >
                    <img
                      src={assets.Delete}
                      alt="Delete Icon"
                      className="w-6 h-6"
                    />
                  </button>
                ) : (
                  <div></div>
                )}
              </div>
            ))}
            {isEdit ? (
              <div className="flex items-start mt-4">
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="bg-[#A3806C] text-white py-1 px-6 rounded hover:scale-105 transition-transform duration-200 text-sm"
                >
                  เพิ่มประวัติการศึกษา
                </button>
              </div>
            ) : (
              <div></div>
            )}
          </div>

          {/* ประวัติการทำงาน */}
          <div>
            <p className="text-dark-brown text-lg mb-4 mt-10 font-medium">
              ประวัติการทำงาน
            </p>
            {profileData.work_experience?.map((work, index) => (
              <div key={index} className="mb-8 relative">
                {/* เพิ่ม relative */}
                <div className="flex gap-10 mb-2">
                  <div className="flex flex-col w-1/2">
                    <label className="mb-2 text-dark-brown">
                      ปีที่เริ่มทำงาน
                    </label>
                    {isEdit ? (
                      <input
                        type="text"
                        className="w-full border border-[#DADADA] rounded p-2"
                        value={work.startDate || ""}
                        onChange={(e) => {
                          const updatedWorkExperience = [
                            ...profileData.work_experience,
                          ];
                          updatedWorkExperience[index] = {
                            ...updatedWorkExperience[index],
                            startDate: e.target.value,
                          };
                          setProfileData((prev) => ({
                            ...prev,
                            work_experience: updatedWorkExperience,
                          }));
                        }}
                      />
                    ) : (
                      <p className="text-lg">{work.startDate || ""}</p>
                    )}
                  </div>

                  <div className="flex flex-col w-1/2">
                    <label className="mb-2 text-dark-brown">
                      ปีที่สิ้นสุดการทำงาน
                    </label>
                    {isEdit ? (
                      <input
                        type="text"
                        className="w-full border border-[#DADADA] rounded p-2"
                        value={work.endDate || ""}
                        onChange={(e) => {
                          const updatedWorkExperience = [
                            ...profileData.work_experience,
                          ];
                          updatedWorkExperience[index] = {
                            ...updatedWorkExperience[index],
                            endDate: e.target.value,
                          };
                          setProfileData((prev) => ({
                            ...prev,
                            work_experience: updatedWorkExperience,
                          }));
                        }}
                      />
                    ) : (
                      <p className="text-lg">{work.endDate || ""}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-10">
                  <div className="flex flex-col w-1/2">
                    <label className="mb-2 text-dark-brown">
                      ตำแหน่ง/อาชีพ
                    </label>
                    {isEdit ? (
                      <input
                        type="text"
                        className="w-full border border-[#DADADA] rounded p-2"
                        value={work.position || ""}
                        onChange={(e) => {
                          const updatedWorkExperience = [
                            ...profileData.work_experience,
                          ];
                          updatedWorkExperience[index] = {
                            ...updatedWorkExperience[index],
                            position: e.target.value,
                          };
                          setProfileData((prev) => ({
                            ...prev,
                            work_experience: updatedWorkExperience,
                          }));
                        }}
                      />
                    ) : (
                      <p className="text-lg">{work.position || ""}</p>
                    )}
                  </div>

                  <div className="flex flex-col w-1/2">
                    <label className="mb-2 text-dark-brown">
                      สถานประกอบการ
                    </label>
                    {isEdit ? (
                      <input
                        type="text"
                        className="w-full border border-[#DADADA] rounded p-2"
                        value={work.company || ""}
                        onChange={(e) => {
                          const updatedWorkExperience = [
                            ...profileData.work_experience,
                          ];
                          updatedWorkExperience[index] = {
                            ...updatedWorkExperience[index],
                            company: e.target.value,
                          };
                          setProfileData((prev) => ({
                            ...prev,
                            work_experience: updatedWorkExperience,
                          }));
                        }}
                      />
                    ) : (
                      <p className="text-lg">{work.company || ""}</p>
                    )}
                  </div>
                </div>

                {/* ปุ่มลบ */}
                {isEdit ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteWorkExperience(index)}
                    className="mt-2 rounded-full text-white hover:scale-105 transition-transform duration-200"
                  >
                    <img
                      src={assets.Delete}
                      alt="Delete Icon"
                      className="w-6 h-6"
                    />
                  </button>
                ) : (
                  <div></div>
                )}
              </div>
            ))}
            {isEdit ? (
              <div className="flex items-start mt-4">
                <button
                  type="button"
                  onClick={handleAddWorkExperience}
                  className="bg-[#A3806C] text-white py-1 px-6 rounded hover:scale-105 transition-transform duration-200 text-sm"
                >
                  เพิ่มประวัติการทำงาน
                </button>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>

        {/* ค่าบริการและแนะนำตัว */}
        <div className="border border-[#E7E7E7] rounded p-8 mt-8">
          <div>
            <p className="text-dark-brown text-lg mb-4 font-medium">
              ค่าบริการและแนะนำตัว
            </p>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="mb-2 text-dark-brown">ค่าบริการ</label>
                <div className="flex flex-row items-center gap-2">
                  <p className="text-lg">ขั้นต่ำ</p>
                  <p className="text-lg">
                    {isEdit ? (
                      <input
                        type="string"
                        className="border border-[#DADADA] rounded p-2 bg-white mr-2"
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            fees_detail: e.target.value,
                          }))
                        }
                        value={profileData.fees_detail || ""}
                      />
                    ) : (
                      profileData.fees_detail
                    )}{" "}
                    บาท ต่อ 30 นาที
                  </p>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="mb-2 text-dark-brown">
                  แนะนำตัว/ข้อมูลเพิ่มเติม
                </label>
                {isEdit ? (
                  <textarea
                    className="w-full min-h-[100px] p-2 border border-[#DADADA] rounded"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        bio: e.target.value,
                      }))
                    }
                    value={profileData.bio || ""}
                  />
                ) : (
                  <p className="text-lg">{profileData.bio || ""}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {isEdit ? (
          <button
            onClick={updateProfile}
            className="mt-8 bg-primary hover:bg-primary/90 text-white px-8 py-2 rounded-full font-medium transition-colors duration-200 flex items-center gap-2"
          >
            บันทึกข้อมูล
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="mt-8 bg-primary hover:bg-primary/90 text-white px-8 py-2 rounded-full font-medium transition-colors duration-200 flex items-center gap-2"
          >
            แก้ไขข้อมูล
          </button>
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
    </div>
  );
};

export default LawyerProfile;
