import React from 'react'
import Header from './Header'
import About from './About'
import Navbar from './Navbar'
import EndlessPossibilities from './EndlessPos'
import UserFeedback from './UserFeedback'
function Homepage() {
  return (
    <div className="font-sans bg-white">
        <Navbar/>
      <Header />
      <About />
      <EndlessPossibilities/>
      <UserFeedback/>
    </div>
  )
}

export default Homepage