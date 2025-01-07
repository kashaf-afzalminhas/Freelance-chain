import React from 'react'
import Header from '../../src/components/Header'
import About from './About'
import Navbar from '../../src/components/Navbar'
import EndlessPossibilities from './EndlessPos'
import UserFeedback from './UserFeedback'
function Homepage() {
  return (
    <div className="font-sans bg-white">
    
      <About />
      <EndlessPossibilities/>
      <UserFeedback/>
    </div>
  )
}

export default Homepage