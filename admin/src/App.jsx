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

const App = () => {
  
  const { aToken } = useContext(AdminContext)

  
  return aToken ? (
    <div className='bg-light-brown min-h-screen flex'>
      <ToastContainer/>
        <Sidebar />
        <div className='ml-64 flex-grow'>
        <Routes>
          <Route path='/' element={<></>} />
          <Route path='/all-appointments' element={<AllAppointments/>} />
          <Route path='/lawyer-list' element={<LawyersList/>} />
          <Route path='/add-lawyer' element={<AddLawyer/>} />
          <Route path='/finance-lawyer' element={<Finance/>} />
          <Route path='/comment-approval' element={<CommentApproval/>} />
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