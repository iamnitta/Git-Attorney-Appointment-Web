import React, { useContext } from 'react'
import Login from './pages/login'
import { ToastContainer, toast } from 'react-toastify';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import AllApointments from './pages/Admin/AllApointments';
import AddLawyer from './pages/Admin/AddLawyer';
import LawyersList from './pages/Admin/LawyersList';
import Finance from './pages/Admin/Finance';

const App = () => {
  
  const { aToken } = useContext(AdminContext)

  
  return aToken ? (
    <div className='bg-light-brown'>
      <ToastContainer/>
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          <Route path='/' element={<></>} />
          <Route path='/all-appointments' element={<AllApointments/>} />
          <Route path='/lawyer-list' element={<LawyersList/>} />
          <Route path='/add-lawyer' element={<AddLawyer/>} />
          <Route path='/finance-lawyer' element={<Finance/>} />
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