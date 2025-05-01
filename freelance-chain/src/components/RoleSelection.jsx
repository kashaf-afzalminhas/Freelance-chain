import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [extraData, setExtraData] = useState({});
  const navigate = useNavigate();

  const handleRoleSelection = async (selectedRole) => {
    setRole(selectedRole);

    // Initialize extraData based on the selected role
    if (selectedRole === 'client') {
      setExtraData({ company: '' });
    } else if (selectedRole === 'freelancer') {
      setExtraData({ skills: [], experience: '' });
    }
  };

  const handleSubmit = async () => {
    const userId = localStorage.getItem('userId');


    if (!userId) {
      alert('User ID not found. Please log in again.');
      navigate('/signin'); // Redirect to the login page
    }
    try {
      const response = await axios.post('http://localhost:5000/auth/select-role', {
        userId,
        role,
        name,
        extraData,
      });

      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Role selection error', error);
      alert('Role selection failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4 sm:px-6 py-8">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-900">Choose Your Role</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">Select how you'd like to use our platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Client Card */}
          <div
            className={`border border-gray-200 rounded-lg p-6 sm:p-8 flex flex-col items-center hover:shadow-md transition-shadow duration-300 ${
              role === 'client' ? 'bg-green-50' : 'bg-white'
            }`}
            onClick={() => handleRoleSelection('client')}
          >
            <div className="w-16 h-16 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-12 h-12 text-green-900"
              >
                <path fillRule="evenodd" d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                <path d="M3 18.4v-2.796a4.3 4.3 0 00.713.31A26.226 26.226 0 0012 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 01-6.477-.427C4.047 21.128 3 19.852 3 18.4z" />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-green-900 mb-2">I'm a Client</h2>

            <p className="text-center text-gray-600 text-sm mb-6">
              Looking to hire talented professionals for my projects
            </p>

            <button
              className="mt-auto bg-green-900 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-300 hover:bg-green-800 w-full sm:w-auto"
            >
              Continue as Client
            </button>
          </div>

          {/* Freelancer Card */}
          <div
            className={`border border-gray-200 rounded-lg p-6 sm:p-8 flex flex-col items-center hover:shadow-md transition-shadow duration-300 ${
              role === 'freelancer' ? 'bg-green-50' : 'bg-white'
            }`}
            onClick={() => handleRoleSelection('freelancer')}
          >
            <div className="w-16 h-16 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-12 h-12 text-green-900"
              >
                <path fillRule="evenodd" d="M2.25 6a3 3 0 013-3h13.5a3 3 0 013 3v12a3 3 0 01-3 3H5.25a3 3 0 01-3-3V6zm3.97.97a.75.75 0 011.06 0l2.25 2.25a.75.75 0 010 1.06l-2.25 2.25a.75.75 0 01-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 010-1.06zm4.28 4.28a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-green-900 mb-2">I'm a Freelancer</h2>

            <p className="text-center text-gray-600 text-sm mb-6">
              Ready to work on exciting projects and grow my career
            </p>

            <button
              className="mt-auto bg-green-900 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-300 hover:bg-green-800 w-full sm:w-auto"
            >
              Continue as Freelancer
            </button>
          </div>
        </div>

        {role && (
          <div className="mt-8">
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md mb-4"
            />
            {role === 'client' && (
              <input
                type="text"
                placeholder="Enter your company name"
                value={extraData.company}
                onChange={(e) => setExtraData({ ...extraData, company: e.target.value })}
                className="w-full px-3 py-2 border rounded-md mb-4"
              />
            )}
            {role === 'freelancer' && (
              <>
                <input
                  type="text"
                  placeholder="Enter your skills (comma-separated)"
                  value={extraData.skills.join(',')}
                  onChange={(e) => setExtraData({ ...extraData, skills: e.target.value.split(',') })}
                  className="w-full px-3 py-2 border rounded-md mb-4"
                />
                <input
                  type="text"
                  placeholder="Enter your experience"
                  value={extraData.experience}
                  onChange={(e) => setExtraData({ ...extraData, experience: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md mb-4"
                />
              </>
            )}
            <button
              onClick={handleSubmit}
              className="w-full bg-green-900 text-white py-2 px-4 rounded-md hover:bg-green-800"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSelection;