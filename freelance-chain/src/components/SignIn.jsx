import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const SignIn = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleMetaMaskLogin = async () => {
        if (!window.ethereum) {
            setError('Please install MetaMask to use this feature.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Check if MetaMask is locked
            let accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length === 0) {
                // Request account access
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                accounts = await window.ethereum.request({ method: 'eth_accounts' });
            }

            const walletAddress = accounts[0];

            if (!walletAddress) {
                throw new Error('No wallet address found');
            }

            console.log('Wallet Address:', walletAddress); // Debug log

            // Step 1: Request nonce from the backend
            console.log('Requesting nonce for wallet:', walletAddress);
            const nonceResponse = await axios.post('http://localhost:5000/auth/metamask/request', {
                walletAddress: walletAddress.toLowerCase(),
            });

            console.log('Nonce Response:', nonceResponse.data);

            // Check if user exists by looking for nonce in response
            if (nonceResponse.data.nonce) {
                // User exists, proceed with login
                const { nonce } = nonceResponse.data;
                console.log('Received nonce:', nonce);

                // Step 2: Sign the nonce
                const message = `Nonce: ${nonce}`;
                console.log('Signing message:', message);

                const signature = await window.ethereum.request({
                    method: 'personal_sign',
                    params: [message, walletAddress],
                });

                console.log('Generated signature:', signature);

                // Step 3: Verify the signature
                console.log('Sending verification request with:', {
                    walletAddress: walletAddress.toLowerCase(),
                    signature
                });

                const verifyResponse = await axios.post('http://localhost:5000/auth/metamask/verify', {
                    walletAddress: walletAddress.toLowerCase(),
                    signature: signature,
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Verify Response:', verifyResponse.data);

                const { token, user } = verifyResponse.data;

                // Save token and user data to localStorage
                localStorage.setItem('authToken', token);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('userId', user._id);

                // Redirect based on user role
                if (!user.role) {
                    navigate('/role-selection');
                } else {
                    navigate('/');
                }
            } else {
                // New user, redirect to signup
                navigate('/signup', { state: { walletAddress } });
            }
        } catch (error) {
            console.error('MetaMask login error:', error);
            console.error('Error response:', error.response?.data); // Debug log
            setError(error.response?.data?.message || 'MetaMask login failed. Please try again.');
        } finally {
            setLoading(false);
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
                    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <div className="mt-6">
                    <button
                        onClick={handleMetaMaskLogin}
                        disabled={loading}
                        className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                        {loading ? (
                            'Connecting...'
                        ) : (
                            <>
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                                    alt="MetaMask Logo"
                                    className="w-5 h-5 mr-2"
                                />
                                Login with MetaMask
                            </>
                        )}
                    </button>
                </div>

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
// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import axios from 'axios';

// const SignIn = () => {
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     const handleMetaMaskLogin = async () => {
//         if (!window.ethereum) {
//             setError('Please install MetaMask to use this feature.');
//             return;
//         }

//         setLoading(true);
//         setError('');

//         try {
//             let accounts = await window.ethereum.request({ method: 'eth_accounts' });
//             if (accounts.length === 0) {
//                 await window.ethereum.request({ method: 'eth_requestAccounts' });
//                 accounts = await window.ethereum.request({ method: 'eth_accounts' });
//             }

//             const walletAddress = accounts[0];
//             if (!walletAddress) throw new Error('No wallet address found');

//             const nonceResponse = await axios.post('http://localhost:5000/auth/metamask/request', {
//                 walletAddress: walletAddress.toLowerCase(),
//             });

//             const { nonce } = nonceResponse.data;
//             const message = `Nonce: ${nonce}`;
//             const signature = await window.ethereum.request({
//                 method: 'personal_sign',
//                 params: [message, walletAddress],
//             });

//             const verifyResponse = await axios.post('http://localhost:5000/auth/metamask/verify', {
//                 walletAddress: walletAddress.toLowerCase(),
//                 signature,
//             });

//             const { token, user } = verifyResponse.data;
//             localStorage.setItem('token', token);
//             localStorage.setItem('user', JSON.stringify(user));

//             if (!user.role) {
//                 navigate('/role-selection');
//             } else {
//                 navigate('/');
//             }
//         } catch (error) {
//             setError(error.response?.data?.message || 'MetaMask login failed. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6">
//             <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
//                 <div className="text-center">
//                     <h2 className="text-2xl font-bold text-green-900">Welcome Back</h2>
//                     <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
//                 </div>

//                 {error && (
//                     <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
//                         {error}
//                     </div>
//                 )}

//                 <div className="mt-6">
//                     <button
//                         onClick={handleMetaMaskLogin}
//                         disabled={loading}
//                         className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
//                     >
//                         {loading ? 'Connecting...' : 'Login with MetaMask'}
//                     </button>
//                 </div>

//                 <div className="mt-6 text-center">
//                     <p className="text-sm text-gray-600">
//                         Don't have an account?{' '}
//                         <Link
//                             to="/signup"
//                             className="font-medium text-green-900 hover:text-green-800"
//                         >
//                             Sign Up
//                         </Link>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SignIn;