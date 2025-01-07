import appointment_img from './appointment_img.png'
import header_img from './header_img.png'
import group_profiles from './group_profiles.png'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.svg'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import doc1 from './doc1.png'
import doc2 from './doc2.png'
import doc3 from './doc3.png'
import doc4 from './doc4.png'
import doc5 from './doc5.png'
import doc6 from './doc6.png'
import doc7 from './doc7.png'
import doc8 from './doc8.png'
import doc9 from './doc9.png'
import doc10 from './doc10.png'
import doc11 from './doc11.png'
import doc12 from './doc12.png'
import doc13 from './doc13.png'
import doc14 from './doc14.png'
import doc15 from './doc15.png'
import Dermatologist from './Dermatologist.svg'
import Gastroenterologist from './Gastroenterologist.svg'
import General_physician from './General_physician.svg'
import Gynecologist from './Gynecologist.svg'
import Neurologist from './Neurologist.svg'
import Pediatricians from './Pediatricians.svg'
import HomePage from './HomePage.png'
import law from './law.png'
import Criminal from './Criminal.png'
import Administrative from './Administrative.png'
import Civil from './Civil.png'
import Family from './Family.png'
import Consumer from './Consumer.png'
import Drug from './Drug.png'
import IP from './IP.png'
import Labor from './Labor.png'
import Logo from './Logo.png'
import Office from './Office.png'
import Location from './Location.png'
import Phone from './Phone.png'
import Line from './Line.png'
import Logo_2 from './Logo_2.png'
import About_1 from './About_1.png'
import About_2 from './About_2.jpg'
import Booking_Users from './Booking_Users.png'
import Profile_Users from './Profile_Users.png'
import Logout_Users from './Logout_Users.png'
import Profile from './Profile.png'
import Dropdown_button from './Dropdown_button.png'
import Menu_button from './Menu_button.png'
import Cross_button from './Cross_button.png'
import Calendar from './Calendar.png'
import Time from './Time.png'
import Is_Thaibar from './Is_Thaibar.png'
import Case from './Case.png'
import Consult from './Consult.png'
import Win from './Win.png'

export const assets = {
    appointment_img,
    header_img,
    group_profiles,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo,
    HomePage,
    law,
    Criminal,
    Administrative,
    Civil,
    Family,
    Consumer,
    Drug,
    IP,
    Labor,
    Logo,
    Office,
    Location,
    Phone,
    Line,
    Logo_2,
    About_1,
    About_2,
    Profile_Users,
    Booking_Users,
    Logout_Users,
    Profile,
    Dropdown_button,
    Menu_button,
    Cross_button,
    Calendar,
    Time,
    Is_Thaibar,
    Case,
    Consult,
    Win
}

export const specialityData = [
    {
        speciality: 'กฎหมายอาญา',
        image: Criminal
    },
    {
        speciality: 'กฎหมายแรงงาน',
        image: Labor
    },
    {
        speciality: 'กฎหมายยาเสพติด',
        image: Drug
    },
    {
        speciality: 'กฎหมายการแพ่ง',
        image: Civil
    },
    {
        speciality: 'กฎหมายทรัพย์สินทางปัญญา',
        image: IP
    },
    {
        speciality: 'กฎหมายปกครอง',
        image: Administrative
    },
    {
        speciality: 'กฎหมายผู้บริโภค',
        image: Consumer
    },
    {
        speciality: 'กฎหมายครอบครัวและมรดก',
        image: Family
    }
]

export const lawyers = [
    {
        _id: 'doc1',
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
        _id: 'doc2',
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
        _id: 'doc3',
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
        _id: 'doc4',
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
        _id: 'doc5',
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
        _id: 'doc6',
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
        _id: 'doc7',
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
    },
    {
        _id: 'doc8',
        name: 'Dr. Timothy White',
        image: Profile,
        speciality: 'กฎหมายปกครอง',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 60,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        is_thaibar: true,
        license_number: '789012',
        education: [],
        work_experience: []
    },
    {
        _id: 'doc9',
        name: 'Dr. Ava Mitchell',
        image: Profile,
        speciality: 'กฎหมายผู้บริโภค',
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
        _id: 'doc10',
        name: 'Dr. Jeffrey King',
        image: Profile,
        speciality: 'กฎหมายครอบครัวและมรดก',
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
        _id: 'doc11',
        name: 'Dr. Zoe Kelly',
        image: Profile,
        speciality: 'Neurologist',
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
        _id: 'doc12',
        name: 'Dr. Patrick Harris',
        image: Profile,
        speciality: 'Neurologist',
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
        _id: 'doc13',
        name: 'Dr. Chloe Evans',
        image: Profile,
        speciality: 'General physician',
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
    },
    {
        _id: 'doc14',
        name: 'Dr. Ryan Martinez',
        image: Profile,
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
        fees: 60,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        },
        is_thaibar: true,
        license_number: '789012',
        education: [],
        work_experience: []
    },
    {
        _id: 'doc15',
        name: 'Dr. Amelia Hill',
        image: Profile,
        speciality: 'Dermatologist',
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
]

export const reviews = [
    {
        _id: 'review1',
        reviewer: 'พิมพ์ใจ รัตนจันทร์',
        image: Profile_Users,
        rating: 5, 
        comment: 'ทนายให้บริการดีมาก ๆ ค่ะ',
        date: '2024-12-23',
    },
    {
        _id: 'review2',
        reviewer: 'อภิชาติ ทองสุข',
        image: Profile_Users, 
        rating: 4,
        comment: 'ให้คำปรึกษาได้ดีเลยครับ',
        date: '2024-12-22',
    },
    {
        _id: 'review3',
        reviewer: 'วราภรณ์ พิทักษ์ไทย',
        image: Profile_Users,
        rating: 5,
        comment: 'ใช้บริการมา 2 ครั้งแล้วค่ะ ดีมาก ๆ เลยค่ะ',
        date: '2024-12-20',
    },
    {
        _id: 'review4',
        reviewer: 'สุรชัย สุขสวัสดิ์',
        image: Profile_Users,
        rating: 5,
        comment: 'ประทับใจในความเป็นมืออาชีพของทีมทนายครับ',
        date: '2024-12-20',
    },
];