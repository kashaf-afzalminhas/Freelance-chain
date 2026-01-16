import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

// Array of admin wallet addresses
const ADMIN_WALLET_ADDRESSES = [
  '0x3Ff804112919805fFB8968ad81dBb23b32e8F3f1',
  '0x1a16d8976a56F7EFcF2C8f861C055badA335fBdc'
];

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
            // Clear any existing session data
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            localStorage.removeItem('userId');
            localStorage.removeItem('isAdmin');
            localStorage.removeItem('adminUser');
            localStorage.removeItem('verifiedAdmin');
            localStorage.removeItem('verifiedWallet');
            localStorage.removeItem('walletConnected');
            localStorage.removeItem('walletAddress');

            // Check if MetaMask is locked
            let accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length === 0) {
                // Request account access
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                accounts = await window.ethereum.request({ method: 'eth_accounts' });
            }

            const walletAddress = accounts[0].toLowerCase();

            if (!walletAddress) {
                throw new Error('No wallet address found');
            }

            // Check if this is an admin wallet
            const isAdminWallet = ADMIN_WALLET_ADDRESSES.some(
                adminAddress => adminAddress.toLowerCase() === walletAddress
            );

            console.log('Wallet Address:', walletAddress);
            console.log('Is Admin Wallet:', isAdminWallet);

            // Step 1: Request nonce from the backend
            const nonceResponse = await api.post('/auth/metamask/request', {
                walletAddress: walletAddress,
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
                    walletAddress: walletAddress,
                    signature
                });

                const verifyResponse = await api.post('/auth/metamask/verify', {
                    walletAddress: walletAddress,
                    signature: signature,
                });

                console.log('Verify Response:', verifyResponse.data);

                const { token, user } = verifyResponse.data;

                // Save token and user data to localStorage
                localStorage.setItem('authToken', token);
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('userId', user._id);
                localStorage.setItem('walletConnected', 'true');
                localStorage.setItem('walletAddress', walletAddress);

                if (isAdminWallet) {
                    localStorage.setItem('isAdmin', 'true');
                    localStorage.setItem('verifiedAdmin', 'true');
                    localStorage.setItem('verifiedWallet', 'true');
                    navigate('/admin/dashboard');
                } else if (!user.role) {
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
            console.error('Error response:', error.response?.data);
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