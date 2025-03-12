import React, { useContext } from 'react'
import Login from './pages/login'
import { ToastContainer, toast } from 'react-toastify';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import AllAppointments from './pages/Admin/AllAppointments';
import AddLawyer from './pages/Admin/AddLawyer';
import LawyersList from './pages/Admin/LawyersList';
import Finance from './pages/Admin/Finance';
import CommentApproval from './pages/Admin/CommentApproval';
import { LawyerContext } from './context/LawyerContext';
import LawyerAppointment from './pages/Lawyer/LawyerAppointment';
import LawyerProfile from './pages/Lawyer/LawyerProfile';
import LawyerCase from './pages/Lawyer/LawyerCase';
import AboutLawyer from './pages/Admin/AboutLawyer';

const App = () => {
  
  const { aToken } = useContext(AdminContext)
  const { lawyerToken } = useContext(LawyerContext)

  
  return aToken || lawyerToken ? (
    <div className='bg-light-brown min-h-screen flex'>
      <ToastContainer/>
        <Sidebar />
        <div className='ml-64 flex-grow'>
        <Routes>

          { /* Admin route*/}
          <Route path='/' element={<></>} />
          <Route path='/all-appointments' element={<AllAppointments/>} />
          <Route path='/lawyer-list' element={<LawyersList/>} />
          <Route path='/add-lawyer' element={<AddLawyer/>} />
          <Route path='/finance-lawyer' element={<Finance/>} />
          <Route path='/comment-approval' element={<CommentApproval/>} />
          <Route path='/about-lawyer/:lawId' element={<AboutLawyer/>} />

          { /* Lawyer route*/}
          <Route path='/lawyer-appointment' element={<LawyerAppointment/>} />
          <Route path='/lawyer-profile' element={<LawyerProfile/>} />
          <Route path='/lawyer-case' element={<LawyerCase/>} />
        </Routes>
        </div>
      </div>
  ) : (
    <>
    <Login />
    <ToastContainer/>
    </>
  )
}

export default App