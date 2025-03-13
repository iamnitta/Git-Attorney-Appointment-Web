import React, { useState, useEffect, useContext } from "react";
import { assets } from "../../assets/assets";
import { LawyerContext } from "../../context/LawyerContext";
import { AdminContext } from "../../context/AdminContext";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

const Finance = () => {
  const {
    getAllLawyers,
    lawyers,
    getAllAppointments,
    appointments,
    getAllReviews,
    reviews,
  } = useContext(AdminContext);

  console.log(reviews);

  // ฟังก์ชันคำนวณรายรับแยกตามเดือน
  const calculateMonthlyIncome = () => {
    if (!appointments) return Array(12).fill(0);

    // สร้างอาร์เรย์เก็บรายรับแต่ละเดือน (0-11 คือ ม.ค.-ธ.ค.)
    const monthlyIncome = Array(12).fill(0);

    // กรองเฉพาะการนัดหมายที่เสร็จสิ้นแล้ว
    const completedAppointments = appointments.filter(
      (app) => app.isCompleted === true
    );

    // คำนวณรายรับแต่ละเดือน
    completedAppointments.forEach((app) => {
      // ตรวจสอบว่ามี appointmentDate และเป็นรูปแบบที่ถูกต้อง
      if (app.slotDate) {
        // แปลงรูปแบบวันที่จาก "19_05_2025" เป็น [วัน, เดือน, ปี]
        const dateParts = app.slotDate.split("_");

        if (dateParts.length === 3) {
          // แปลงเป็นตัวเลข และลบ 1 จากเดือนเพราะ JavaScript นับเดือนตั้งแต่ 0-11
          const day = parseInt(dateParts[0]);
          const month = parseInt(dateParts[1]) - 1; // ลบ 1 เพราะเดือนใน JS เริ่มจาก 0
          const year = parseInt(dateParts[2]);

          // ตรวจสอบว่าค่าที่แปลงเป็นตัวเลขถูกต้อง
          if (
            !isNaN(day) &&
            !isNaN(month) &&
            !isNaN(year) &&
            month >= 0 &&
            month < 12
          ) {
            monthlyIncome[month] += (app.fees || 0) * 1.1; // รวมค่าธรรมเนียม 10%
          }
        }
      }
    });

    return monthlyIncome;
  };

  const MonthlyIncomeChart = () => {
    // ชื่อเดือนภาษาไทย
    const thaiMonths = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];

    // เตรียมข้อมูลสำหรับกราฟ
    const data = {
      labels: thaiMonths,
      datasets: [
        {
          label: "รายได้ทั้งหมด (บาท)",
          data: calculateMonthlyIncome(),
          fill: false,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          tension: 0.1,
        },
      ],
    };

    // ตั้งค่าตัวเลือก
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "รายได้ทั้งหมด",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `รายได้ทั้งหมด: ${context.raw.toFixed(2)} บาท`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "รายได้ (บาท)",
          },
        },
        x: {
          title: {
            display: true,
            text: "เดือน",
          },
        },
      },
    };

    return <Line data={data} options={options} />;
  };

  // เพิ่มฟังก์ชันสำหรับกราฟแสดงจำนวนรีวิวตามคะแนนดาว
  const RatingDistributionChart = () => {
    if (!reviews) return null;

    // กรองเฉพาะรีวิวที่ได้รับการยืนยันแล้ว
    const confirmedReviews = reviews.filter(
      (review) => review.isConfirm === true
    );

    // นับจำนวนรีวิวตามคะแนนดาว (1-5)
    const ratingCounts = [0, 0, 0, 0, 0]; // สำหรับ 1-5 ดาว

    confirmedReviews.forEach((review) => {
      const rating = Math.floor(review.rating);
      if (rating >= 1 && rating <= 5) {
        ratingCounts[rating - 1]++;
      }
    });

    // เตรียมข้อมูลสำหรับกราฟ
    const data = {
      labels: ["1 คะแนน", "2 คะแนน", "3 คะแนน", "4 คะแนน", "5 คะแนน"],
      datasets: [
        {
          label: "จำนวนความคิดเห็น",
          data: ratingCounts,
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(255, 159, 64, 0.6)",
            "rgba(255, 205, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(54, 162, 235, 0.6)",
          ],
          borderColor: [
            "rgb(255, 99, 132)",
            "rgb(255, 159, 64)",
            "rgb(255, 205, 86)",
            "rgb(75, 192, 192)",
            "rgb(54, 162, 235)",
          ],
          borderWidth: 1,
        },
      ],
    };

    // ตั้งค่าตัวเลือก
    const options = {
      indexAxis: "y",
      responsive: true,
      plugins: {
        legend: {
          display: false,
          position: "top",
        },
        title: {
          display: true,
          text: "การกระจายของคะแนนรีวิว",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `จำนวน: ${context.raw} รีวิว`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "คะแนน",
          },
          ticks: {
            precision: 0,
          },
        },
        x: {
          title: {
            display: true,
            text: "จำนวนความคิดเห็น",
          },
          ticks: {
            precision: 0,
            stepSize: 1,
          },
          beginAtZero: true,
        },
      },
    };

    return <Bar data={data} options={options} />;
  };

  // เพิ่มฟังก์ชันสำหรับกราฟแท่งแนวตั้งแสดงสถานะของ appointments
  const AppointmentStatusChart = () => {
    if (!appointments) return null;

    // นับจำนวน appointments ตามสถานะ
    const pendingCount = appointments.filter(
      (app) => app.isCompleted === false && app.cancelled === false
    ).length;

    const completedCount = appointments.filter(
      (app) => app.isCompleted === true
    ).length;

    const cancelledCount = appointments.filter(
      (app) => app.cancelled === true
    ).length;

    // เตรียมข้อมูลสำหรับกราฟ
    const data = {
      labels: ["รอปรึกษา", "ปรึกษาเสร็จสิ้น", "ยกเลิก"],
      datasets: [
        {
          label: "จำนวนการนัดหมาย",
          data: [pendingCount, completedCount, cancelledCount],
          backgroundColor: [
            "rgba(255, 206, 86, 0.6)", // สีเหลือง - รอปรึกษา
            "rgba(75, 192, 192, 0.6)", // สีเขียว - เสร็จสิ้น
            "rgba(255, 99, 132, 0.6)", // สีแดง - ยกเลิก
          ],
          borderColor: [
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(255, 99, 132, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    // ตั้งค่าตัวเลือก
    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
          position: "top",
        },
        title: {
          display: true,
          text: "จำนวนการนัดหมายทั้งหมด",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `จำนวน: ${context.raw} ครั้ง`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "จำนวนการนัดหมาย",
          },
          ticks: {
            precision: 0,
            stepSize: 1,
          },
        },
        x: {
          title: {
            display: true,
            text: "สถานะของการนัดหมาย",
          },
        },
      },
    };

    return <Bar data={data} options={options} />;
  };

  //จำนวนการนัดหมายของทนายแต่ละคน
  const countLawyersAppointments = (lawyerId) => {
    return appointments
      ? appointments.filter(
          (appointment) =>
            appointment.lawId === lawyerId &&
            appointment.isCompleted === false &&
            appointment.cancelled === false
        ).length
      : 0;
  };

  //จำนวนการนัดหมายที่สำเร็จของทนายแต่ละคน
  const countAppointmentsCompleted = (lawyerId) => {
    return appointments
      ? appointments.filter(
          (appointment) =>
            appointment.lawId === lawyerId && appointment.isCompleted === true
        ).length
      : 0;
  };

  //จำนวนการยกเลิกนัดหมายของทนายแต่ละคน
  const countAppointmentsCancelled = (lawyerId) => {
    return appointments
      ? appointments.filter(
          (appointment) =>
            appointment.lawId === lawyerId && appointment.cancelled === true
        ).length
      : 0;
  };

  //จำนวนลูกค้าที่ไม่ซ้ำกันของทนายแต่ละคน
  const countCustomer = (lawyerId) => {
    if (!appointments) return 0;

    // สร้างเซ็ตของ userId ที่ไม่ซ้ำกันสำหรับทนายความนี้
    const uniqueUserIds = new Set(
      appointments
        .filter(
          (appointment) =>
            appointment.lawId === lawyerId && appointment.cancelled === false
        )
        .map((appointment) => appointment.userId)
    );

    return uniqueUserIds.size;
  };

  //คำนวณรายรับของทนายแต่ละคน
  const calculateLawyerIncome = (lawyerId) => {
    if (!appointments) return 0;
    return appointments
      .filter((app) => app.lawId === lawyerId && app.isCompleted === true)
      .reduce((sum, app) => sum + (app.fees || 0), 0);
  };

  // คำนวณคะแนนรีวิวเฉลี่ยของทนายแต่ละคน
  const calculateAverageRating = (lawyerId) => {
    if (!reviews) return 0;
    const lawyerReviews = reviews.filter(
      (review) => review.lawId === lawyerId && review.isConfirm === true
    );
    if (lawyerReviews.length === 0) return 0;
    const totalRating = lawyerReviews.reduce(
      (sum, review) => sum + (review.rating || 0),
      0
    );
    return (totalRating / lawyerReviews.length).toFixed(1);
  };

  // ฟังก์ชันสำหรับนับจำนวนการนัดหมายทั้งหมด
  const getTotalAppointments = () => {
    return appointments ? appointments.filter(appointment => appointment.isCompleted).length : 0;
  };

  // ฟังก์ชันสำหรับนับจำนวนลูกค้าทั้งหมดในระบบ (ไม่นับซ้ำ)
  const getTotalCustomers = () => {
    if (!appointments) return 0;

    // สร้างเซ็ตของ userId ที่ไม่ซ้ำกันทั้งหมด โดยไม่ต้องกรองตาม lawyerId
    const uniqueUserIds = new Set(
      appointments
        .filter((appointment) => appointment.cancelled === false)
        .map((appointment) => appointment.userId)
    );

    return uniqueUserIds.size;
  };

  const getTotalIncome = () => {
    return appointments
      .filter((item) => item.isCompleted === true)
      .reduce((sum, item) => sum + (item.fees || 0), 0);
  };

  useEffect(() => {
    getAllLawyers();
    getAllAppointments();
    getAllReviews();
  }, []);

  return (
    <div className="p-8 w-full animate-fadeIn">
      <div className="flex items-start w-full">
        <h1 className="rounded text-dark-brown text-2xl font-medium mb-6">
          สรุปผลข้อมูล
        </h1>
      </div>

      {/* Top */}
      <div className="w-full flex flex-row gap-4 mb-4">
        {/* Card */}
        <div className="w-full h-full">
          <div className="flex flex-row gap-2 justify-between">
            {/* รายได้ทั้งหมด */}
            <div className="bg-white w-full h-full rounded-lg p-4 shadow-sm">
              <div className="flex flex-row justify-between mb-8">
                <div className="flex flex-col">
                  <p className="text-dark-brown text-lg text-left mt-1 font-medium">
                    รายได้ทั้งหมด
                  </p>
                </div>

                <img
                  src={assets.Office_Icon2}
                  alt=""
                  className="w-10 h-10 object-cover"
                />
              </div>
              <div className="mt-4">
                <p className="text-dark-brown text-2xl text-left font-medium">
                  {Number((getTotalIncome() * 1.1).toFixed(2)).toLocaleString()}
                </p>
              </div>
            </div>

            {/* รายได้ของทนายความ */}
            <div className="bg-white w-full h-full rounded-lg p-4 shadow-sm">
              <div className="flex flex-row justify-between mb-8">
                <div className="flex flex-col">
                  <p className="text-dark-brown text-lg text-left mt-1 font-medium">
                    รายได้ทนายความ
                  </p>
                </div>

                <img
                  src={assets.Lawyer_Icon}
                  alt=""
                  className="w-10 h-10 object-cover"
                />
              </div>
              <div className="mt-4">
                <p className="text-dark-brown text-2xl text-left font-medium">
                  {Number(getTotalIncome() .toFixed(2)).toLocaleString()}
                </p>
              </div>
            </div>


            {/* ค่าธรรมเนียมของบริษัท */}
            <div className="bg-white w-full h-full rounded-lg p-4 shadow-sm">
              <div className="flex flex-row justify-between mb-8">
                <div className="flex flex-col">
                  <p className="text-dark-brown text-lg text-left mt-1 font-medium">
                    รายได้ค่าบริการ
                  </p>
                </div>

                <img
                  src={assets.Salary_Icon}
                  alt=""
                  className="w-10 h-10 object-cover"
                />
              </div>
              <div className="mt-4">
                <p className="text-dark-brown text-2xl text-left font-medium">
                  {Number(
                    (getTotalIncome() * 1.1 - getTotalIncome()).toFixed(2)
                  ).toLocaleString()}
                </p>
              </div>
            </div>

            {/* <div className="flex flex-row gap-2 justify-between mt-4"> */}
            {/* ลูกค้าทั้งหมด */}
            <div className="bg-white w-full h-full rounded-lg p-4 shadow-sm">
              <div className="flex flex-row justify-between mb-8">
                <div className="flex flex-col">
                  <p className="text-dark-brown text-lg text-left mt-1 font-medium">
                    ลูกค้าทั้งหมด
                  </p>
                </div>

                <img
                  src={assets.Customer_Icon}
                  alt=""
                  className="w-10 h-10 object-cover"
                />
              </div>
              <div className="mt-4">
                <p className="text-dark-brown text-2xl text-left font-medium">
                  {getTotalCustomers().toLocaleString()}
                </p>
              </div>
            </div>

            {/* การนัดหมายทั้งหมด */}
            <div className="bg-white w-full h-full rounded-lg p-4 shadow-sm">
              <div className="flex flex-row justify-between mb-8">
                <div className="flex flex-col">
                  <p className="text-dark-brown text-lg text-left mt-1 font-medium">
                    นัดหมายเสร็จสิ้น
                  </p>
                </div>

                <img
                  src={assets.Appointment_Icon}
                  alt=""
                  className="w-10 h-10 object-cover"
                />
              </div>
              <div className="mt-4">
                <p className="text-dark-brown text-2xl text-left font-medium">
                  {getTotalAppointments()}
                </p>
              </div>
            </div>
            {/* </div> */}
          </div>
        </div>

        {/* Graph */}
        {/* <div className="w-1/2">
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <AppointmentStatusChart />
          </div>
        </div> */}
      </div>

      {/* Middle */}
      <div className="flex flex-row gap-4">
        {/* Income */}
        <div className="w-full">
          <div className="bg-white p-4 rounded-lg w-full shadow">
            <MonthlyIncomeChart />
          </div>
        </div>

        {/* Rating */}
        <div className="w-full">
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <RatingDistributionChart />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center w-full flex-row"></div>
        <div className="bg-[#FFFFFF] rounded overflow-hidden mt-2">
          <table className="w-full border-collapse">
            <thead className="bg-[#F7F7F7] border-b border-[#DADADA] text-dark-brown">
              <tr>
                <th className="p-3 font-medium text-left"></th>
                <th className="p-3 font-medium text-left"></th>
                {/* รูปทนายความ */}
                <th className="p-3 font-medium text-left">ทนายความ</th>
                {/* <th className="p-4 font-medium text-center">ยอดทั้งหมด</th> */}
                <th className="p-3 font-medium text-center">
                  รายได้ทนายความ
                </th>
                {/* <th className="p-4 font-medium text-center">ลูกค้า</th> */}
                <th className="p-3 font-medium text-center">รอปรึกษา</th>
                <th className="p-3 font-medium text-center">ปรึกษาเสร็จสิ้น</th>
                <th className="p-3 font-medium text-center">ยกเลิก</th>
                <th className="p-3 font-medium text-center">คะแนน</th>
              </tr>
            </thead>
            <tbody>
              {lawyers &&
                lawyers.map((lawyer, index) => (
                  <tr
                    key={lawyer.id || index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="p-3 text-left border-b border-[#DADADA]">
                      {index + 1}
                    </td>
                    <td className="p-3 text-left border-b border-[#DADADA]">
                      <img
                        src={lawyer.image || assets.DefaultProfile}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="p-3 text-left border-b border-[#DADADA]">
                      {lawyer.firstName} {lawyer.lastName}
                    </td>
                    {/* <td className="p-4 text-center border-b border-[#DADADA]">
                      {calculateLawyerIncome(lawyer._id) * 1.1}
                    </td> */}
                    <td className="p-3 text-center border-b border-[#DADADA]">
                      {calculateLawyerIncome(lawyer._id).toLocaleString()}
                    </td>
                    {/* <td className="p-4 text-center border-b border-[#DADADA]">
                      {countCustomer(lawyer._id)}
                    </td> */}
                    <td className="p-3 text-center border-b border-[#DADADA]">
                      {countLawyersAppointments(lawyer._id)}
                    </td>
                    <td className="p-3 text-center border-b border-[#DADADA]">
                      {countAppointmentsCompleted(lawyer._id)}
                    </td>
                    <td className="p-3 text-center border-b border-[#DADADA]">
                      {countAppointmentsCancelled(lawyer._id)}
                    </td>
                    <td className="p-3 text-center border-b border-[#DADADA]">
                    <span className="text-yellow-500 mr-1 text-sm">★</span> {calculateAverageRating(lawyer._id)}/5
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Finance;
