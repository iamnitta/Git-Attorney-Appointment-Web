import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopLawyers from '../components/TopLawyers'
import Footer from '../components/Footer'
import Review from '../components/Review'

const Home = () => {
  return (
    <div className='animate-fadeIn'>
      <Header />
      <SpecialityMenu />
      <TopLawyers />
      <Review />
    
    </div>
  )
}

export default Home