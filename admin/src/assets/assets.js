import Myprofile from './Myprofile.png'
import Booking_Admin from './Booking_Admin.png'
import Lawyers_Admin from './Lawyers_Admin.png'
import Finance_Admin from './Finance_Admin.png'
import Logout_Admin from './Logout_Admin.png'
import AddLawyer2_Admin from './AddLawyer2_Admin.png'
import Delete from './Delete.png'
import See_More from './See More.png'
import Logo_2 from './Logo_2.png'
import Search from './Search.png'
import Profile from './Profile.png'
import Income from './Income.png'
import Customer from './Customer.png'
import Appointment from './Appointment.png'
import Approve from './Approve.png'
import App from '../App'
import Close_2 from './Close_2.png'
import Case_Lawyer from './Case_Lawyer.png'
import Profile_Lawyer from './Profile_Lawyer.png'
import Caution_Icon from './Caution_Icon.png'

export const assets = {
    Myprofile,
    Booking_Admin,
    Lawyers_Admin,
    Finance_Admin,
    Logout_Admin,
    AddLawyer2_Admin,
    Delete,
    See_More,
    Logo_2,
    Search,
    Profile,
    Income,
    Customer,
    Appointment,
    Approve,
    Close_2,
    Case_Lawyer,
    Profile_Lawyer,
    Caution_Icon
}

export const lawyers = [
    {
        _id: 'lawyer1',
        name: 'กานต์ ทวีทรัพย์ ',
        image: Profile,
        speciality: 'กฎหมายอาญา',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'สวัสดีครับ ผมทนาย กานต์ ทวีทรัพย์ ยินดีให้คำปรึกษาอย่างตรงไปตรงมาครับ',
        fees: 50,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        is_thaibar: true,
        license_number: '789012',
        education: [
            {
              degree: 'นิติศาสตร์บัณฑิต',
              institution: 'มหาวิทยาลัยเกษตรศาสตร์',
              enrollmentYear: 2012,
              graduationYear: 2016
            },
            {
              degree: 'นิติศาสตร์มหาบัณฑิต',
              institution: 'มหาวิทยาลัยรามคำแหง',
              enrollmentYear: 2016,
              graduationYear: 2018
            }
        ],
        work_experience: [
            {
              position: 'ทนายความ',
              company: 'บริษัท กรุงไทยกฎหมาย',
              startDate: '2018',
              endDate: '2022'
            },
            {
              position: 'ทนายความ',
              company: 'สำนักงานกฎหมาย A',
              startDate: '2022',
              endDate: '2024'
            }
          ]

    },
    {
        _id: 'lawyer2',
        name: 'Dr. Emily Larson',
        image: Profile,
        speciality: 'กฎหมายอาญา',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 60,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        is_thaibar: false,
        license_number: '12345/66',
        education: [],
        work_experience: []
    },
    {
        _id: 'lawyer3',
        name: 'Dr. Sarah Patel',
        image: Profile,
        speciality: 'กฎหมายแรงงาน',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 30,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        is_thaibar: true,
        license_number: '789012',
        education: [],
        work_experience: []
    },
    {
        _id: 'lawyer4',
        name: 'Dr. Christopher Lee',
        image: Profile,
        speciality: 'กฎหมายแรงงาน',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 40,
        address: {
            line1: '47th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        is_thaibar: true,
        license_number: '789012',
        education: [],
        work_experience: []
    },
    {
        _id: 'lawyer5',
        name: 'Dr. Jennifer Garcia',
        image: Profile,
        speciality: 'กฎหมายยาเสพติด',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        is_thaibar: true,
        license_number: '789012',
        education: [],
        work_experience: []
    },
    {
        _id: 'lawyer6',
        name: 'Dr. Andrew Williams',
        image: Profile,
        speciality: 'กฎหมายการแพ่ง',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        is_thaibar: true,
        license_number: '789012',
        education: [],
        work_experience: []
    },
    {
        _id: 'lawyer7',
        name: 'Dr. Christopher Davis',
        image: Profile,
        speciality: 'กฎหมายทรัพย์สินทางปัญญา',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 50,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        is_thaibar: true,
        license_number: '789012',
        education: [],
        work_experience: []
    }
]

export const appointments = [
    {
        _id: 'appointment1',
        slotDate: '2025-01-12',
        slotTime: '10:00 AM - 11:00 AM',
        status: 'completed',
        user_id: 'user1',
        lawyer_id: 'lawyer1',
        fees: 200,
        user_topic: 'ปรึกษากฎหมายเรื่องมรดก',
        user_document: '',
        createdAt: '2025-01-10T08:30:00Z'
        
    },
    {
        _id: 'appointment2',
        slotDate: '2025-01-12',
        slotTime: '11:00 AM - 12:00 PM',
        status: 'completed',
        user_id: 'user2',
        lawyer_id: 'lawyer2',
        fees: 100,
        user_topic: 'ปรึกษากฎหมายเรื่องมรดก',
        user_document: '',
        createdAt: '2025-01-10T08:30:00Z'
    },
    {
        _id: 'appointment3',
        slotDate: '2025-01-12',
        slotTime: '12:00 PM - 01:00 PM',
        status: 'completed',
        user_id: 'user2',
        lawyer_id: 'lawyer2',
        fees: 500,
        user_topic: 'ปรึกษากฎหมายเรื่องมรดก',
        user_document: '',
        createdAt: '2025-01-10T08:30:00Z'
    },
    {
        _id: 'appointment4',
        slotDate: '2025-01-12',
        slotTime: '01:00 PM - 02:00 PM',
        status: 'completed',
        user_id: 'user4',
        lawyer_id: 'lawyer2',
        fees: 200,
        user_topic: 'ปรึกษากฎหมายเรื่องมรดก',
        user_document: '',
        createdAt: '2025-01-10T08:30:00Z'
    },
    {
        _id: 'appointment5',
        slotDate: '2025-01-12',
        slotTime: '02:00 PM - 03:00 PM',
        status: 'completed',
        user_id: 'user5',
        lawyer_id: 'lawyer5',
        fees: 250,
        user_topic: 'ปรึกษากฎหมายเรื่องมรดก',
        user_document: '',
        createdAt: '2025-01-10T08:30:00Z'
    },
]

export const users = [
    {
        _id: 'user1',
        name: 'เนม',
        image: Profile,
        email: 'user1@gmail.com'
    },
    {
        _id: 'user2',
        name: 'เม่ย',
        image: Profile,
        email: 'user2@gmail.com'
    },
    {
        _id: 'user3',
        name: 'หมูกรอบ',
        image: Profile,
        email: 'user3@gmail.com'
    },
    {
        _id: 'user4',
        name: 'บิวกิ้น',
        image: Profile,
        email: 'user4@gmail.com'
    },
    {
        _id: 'user5',
        name: 'ลิซ่า',
        image: Profile,
        email: 'user5@gmail.com'
    }
]