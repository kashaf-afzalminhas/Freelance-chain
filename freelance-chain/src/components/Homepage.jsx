import React from 'react'
// import About from './About'
// import EndlessPossibilities from './EndlessPos'
// import UserFeedback from './UserFeedback'
import Hero from './Hero'
import Services from './Services'
import ConsultingSection from './Consulting'
function Homepage() {
  return (
    <div className="font-sans bg-white">
    
      <Hero/>
      <Services/>
      <ConsultingSection/>
    </div>
  )
}

export default Homepage