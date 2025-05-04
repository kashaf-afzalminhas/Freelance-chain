// import React from 'react';
// import { Briefcase } from 'lucide-react';
// import JobCard from '../Cards/JobCard';
// import Filters from '../Cards/Filter';

// const SAMPLE_JOBS = [
//   {
//     title: "Senior React Developer for E-commerce Platform",
//     company: "TechCorp Solutions",
//     budget: "50-70/hr",
//     location: "Remote",
//     description: "We're seeking an experienced React developer to help build and maintain our e-commerce platform. The ideal candidate will have strong experience with React, Redux, and modern JavaScript practices.",
//     skills: ["React", "Redux", "TypeScript", "Node.js"],
//     postedTime: "2 hours ago",
//     experience: "Expert"
//   },
//   {
//     title: "Full Stack JavaScript Developer",
//     company: "InnovateTech",
//     budget: "4000-6000",
//     location: "Remote",
//     description: "Looking for a full stack developer proficient in MERN stack to join our team for a 3-month project. Must have experience with React and Node.js.",
//     skills: ["React", "Node.js", "MongoDB", "Express"],
//     postedTime: "5 hours ago",
//     experience: "Intermediate"
//   },
//   {
//     title: "Frontend Developer - UI/UX Focus",
//     company: "DesignFirst Inc",
//     budget: "40-55/hr",
//     location: "Remote",
//     description: "Seeking a frontend developer with a strong eye for design to help create beautiful and functional user interfaces for our clients.",
//     skills: ["React", "Tailwind CSS", "Figma", "JavaScript"],
//     postedTime: "1 day ago",
//     experience: "Intermediate"
//   }
// ];

// function JobListPage() {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       {/* <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
        
//             </div>
//             <nav className="flex space-x-4">
//               <a href="#" className="text-gray-500 hover:text-gray-900">Find Work</a>
//               <a href="#" className="text-gray-500 hover:text-gray-900">My Jobs</a>
//               <a href="#" className="text-gray-500 hover:text-gray-900">Messages</a>
//               <a href="#" className="text-gray-500 hover:text-gray-900">Profile</a>
//             </nav>
//           </div>
//         </div>
//       </header> */}

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex gap-8">
//           {/* Filters Sidebar */}
//           <div className="w-80 flex-shrink-0">
//             <Filters />
//           </div>

//           {/* Job Listings */}
//           <div className="flex-1">
//             <div className="mb-6">
//               <h2 className="text-2xl font-bold text-gray-900">Available Jobs</h2>
//               <p className="text-gray-600">Find your next opportunity from our curated list of jobs</p>
//             </div>

//             <div className="space-y-4">
//               {SAMPLE_JOBS.map((job, index) => (
//                 <JobCard key={index} {...job} />
//               ))}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default JobListPage;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import JobCard from '../Cards/JobCard';
import Filters from '../Cards/Filter';

function JobListPage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/jobs');
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-80 flex-shrink-0">
            <Filters />
          </div>

          {/* Job Listings */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Available Jobs</h2>
              <p className="text-gray-600">Find your next opportunity from our curated list of jobs</p>
            </div>

            <div className="space-y-4">
              {jobs.map((job, index) => (
                <Link to={`/jobs/${job.id}/bid`} key={index}>
                  <JobCard
                    {...job}
                    createdAt={format(new Date(job.createdAt), 'EEEE, MMMM do, yyyy h:mm a')}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default JobListPage;