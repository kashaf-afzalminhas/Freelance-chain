// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import axios from 'axios';

// const SignIn = () => {
//   const [walletAddress, setWalletAddress] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleWalletLogin = async (e) => {
//     e.preventDefault();
  
//     try {
//       const response = await axios.post('http://localhost:5000/auth/login', {
//         walletAddress,
//         password,
//       });
  
//       const { token, user } = response.data;
  
//       // Save token and user data to localStorage
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(user));
//       localStorage.setItem('userId', user._id); // Save userId explicitly
  
//       // Redirect to home page or role selection page
//       if (!user.role) {
//         navigate('/role-selection');
//       } else {
//         navigate('/');
//       }
//     } catch (error) {
//       console.error('Login error', error);
//       alert('Login failed. Please check your credentials.');
//     }
//   };

//   const handleMetaMaskLogin = async () => {
//     if (window.ethereum) {
//       try {
//         const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//         const walletAddress = accounts[0];
  
//         // Step 1: Request nonce from the backend
//         const nonceResponse = await axios.post('http://localhost:5000/auth/metamask/request', {
//           walletAddress,
//         });
//         const { nonce } = nonceResponse.data;

//         // If the user already exists, navigate to home
//         if (nonceResponse.data.message === 'User already exists') {
//           alert('User already exists! Redirecting to home.');
//           navigate('/');
//           return; // Stop further execution
//         }
  
//         // Step 2: Sign the nonce
//         const signature = await window.ethereum.request({
//           method: 'personal_sign',
//           params: [`Nonce: ${nonce}`, walletAddress],
//         });
  
//         // Step 3: Verify the signature
//         const verifyResponse = await axios.post('http://localhost:5000/auth/metamask/verify', {
//           walletAddress,
//           signature,
//         });
  
//         const { token, user } = verifyResponse.data;
  
//         // Save token and user data to localStorage
//         localStorage.setItem('token', token);
//         localStorage.setItem('user', JSON.stringify(user));
//         localStorage.setItem('userId', user._id); // Save userId explicitly
  
//         // Redirect to home page or role selection page
//         if (!user.role) {
//           navigate('/role-selection');
//         } else {
//           navigate('/');
//         }
//       } catch (error) {
//         console.error('MetaMask login error', error);
//         alert('MetaMask login failed');
//       }
//     } else {
//       alert('Please install MetaMask');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6">
//       <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-green-900">Welcome Back</h2>
//           <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
//         </div>

//         {/* Wallet Address and Password Login Form */}
//         <form className="mt-6 space-y-4" onSubmit={handleWalletLogin}>
//           <div>
//             <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700">
//               Wallet Address
//             </label>
//             <input
//               id="walletAddress"
//               name="walletAddress"
//               type="text"
//               value={walletAddress}
//               onChange={(e) => setWalletAddress(e.target.value)}
//               required
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//               placeholder="Enter your wallet address"
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//               Password
//             </label>
//             <input
//               id="password"
//               name="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//               placeholder="Enter your password"
//             />
//           </div>

//           <div>
//             <button
//               type="submit"
//               className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-900 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//             >
//               Sign In
//             </button>
//           </div>
//         </form>

//         {/* Divider */}
//         <div className="mt-6">
//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300" />
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-white text-gray-500">Or continue with</span>
//             </div>
//           </div>
//         </div>

//         {/* MetaMask Login Button */}
//         <div className="mt-6">
//           <button
//             onClick={handleMetaMaskLogin}
//             className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//           >
//             <img
//               src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
//               alt="MetaMask Logo"
//               className="w-5 h-5 mr-2"
//             />
//             Login with MetaMask
//           </button>
//         </div>

//         {/* Sign Up Link */}
//         <div className="mt-6 text-center">
//           <p className="text-sm text-gray-600">
//             Don't have an account?{' '}
//             <Link
//               to="/signup"
//               className="font-medium text-green-900 hover:text-green-800"
//             >
//               Sign Up
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignIn;


import React, { useState } from 'react';
 import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const SignIn = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleMetaMaskLogin = async () => {
        if (window.ethereum) {
            try {
                // Request account access
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const walletAddress = accounts[0];

                // Step 1: Request nonce from the backend
                const nonceResponse = await axios.post('http://localhost:5000/auth/metamask/request', {
                    walletAddress,
                });
                const { nonce } = nonceResponse.data;

                // Step 2: Sign the nonce
                const signature = await window.ethereum.request({
                    method: 'personal_sign',
                    params: [`Nonce: ${nonce}`, walletAddress],
                });

                // Step 3: Verify the signature
                const verifyResponse = await axios.post('http://localhost:5000/auth/metamask/verify', {
                    walletAddress,
                    signature,
                });

                const { token, user } = verifyResponse.data;

                // Save token and user data to localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('userId', user._id);

                // Redirect based on user role
                if (!user.role) {
                    navigate('/role-selection');
                } else {
                    navigate('/');
                }
            } catch (error) {
                console.error('MetaMask login error:', error.response?.data || error.message); // Debugging
                setError('MetaMask login failed. Please try again.');
            }
        } else {
            setError('Please install MetaMask to use this feature.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-green-900">Welcome Back</h2>
                    <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
                </div>

                {error && (
                    <div className="text-red-500 text-sm text-center mt-4">
                        {error}
                    </div>
                )}

                {/* MetaMask Login Button */}
                <div className="mt-6">
                    <button
                        onClick={handleMetaMaskLogin}
                        className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                            alt="MetaMask Logo"
                            className="w-5 h-5 mr-2"
                        />
                        Login with MetaMask
                    </button>
                </div>
                 {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-medium text-green-900 hover:text-green-800"
            >
              Sign Up
            </Link>
          </p>
        </div>
            </div>
        </div>
    );
};

export default SignIn;