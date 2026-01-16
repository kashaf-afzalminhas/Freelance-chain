// import React from 'react';

// const SkillsList = ({ skills = [], ratings = [], loading = false }) => {
//   const hasRatings = ratings.length > 0;

//   if (loading) {
//     return (
//       <div className="animate-pulse space-y-2">
//         <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//         <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//       </div>
//     );
//   }

//   if (!skills.length && !ratings.length) {
//     return (
//       <div className="text-gray-500 italic text-sm">
//         No skills listed yet.
//       </div>
//     );
//   }

//   if (hasRatings) {
//     return (
//       <div className="space-y-3">
//         {ratings.map((item, index) => (
//           <div key={index} className="space-y-1">
//             <div className="flex justify-between">
//               <span className="text-sm font-medium text-gray-700">{item.skill}</span>
//               <span className="text-xs text-gray-500">{item.rating}/5</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div
//                 className="bg-purple-600 h-2 rounded-full"
//                 style={{ width: `${(item.rating / 5) * 100}%` }}
//               ></div>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-wrap gap-2">
//       {skills.map((skill, index) => (
//         <span
//           key={index}
//           className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-purple-100 text-purple-800"
//         >
//           {skill}
//         </span>
//       ))}
//     </div>
//   );
// };

// export default SkillsList;
import React from 'react';

const SkillsList = ({ skills = [], ratings = [], loading = false }) => {
  const hasRatings = ratings.length > 0;

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-[#0C3B2E]/10 rounded w-3/4"></div>
            <div className="h-2 bg-[#0C3B2E]/10 rounded-full w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!skills.length && !ratings.length) {
    return (
      <div className="text-[#6D9773]/70 italic text-sm">
        No skills listed yet.
      </div>
    );
  }

  if (hasRatings) {
    return (
      <div className="space-y-4">
        {ratings.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-[#0C3B2E]">{item.skill}</span>
              <span className="text-xs font-semibold text-[#BB8A52]">{item.rating}/5</span>
            </div>
            <div className="w-full bg-[#0C3B2E]/10 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-[#6D9773] to-[#BB8A52] h-2.5 rounded-full"
                style={{ width: `${(item.rating / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, index) => (
        <span
          key={index}
          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#6D9773]/10 text-[#0C3B2E] hover:bg-[#6D9773]/20 transition-colors duration-200"
        >
          {skill}
        </span>
      ))}
    </div>
  );
};

export default SkillsList;