import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if wallet address was passed from signin
    if (location.state?.walletAddress) {
      setWalletAddress(location.state.walletAddress);
      setIsConnected(true);
    }
  }, [location]);

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        setLoading(true);
        setError('');

        // Request accounts from MetaMask
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const wallet = accounts[0];
        setWalletAddress(wallet);
        setIsConnected(true);

        // Check if the wallet address is already registered
        const checkResponse = await axios.post('http://localhost:5000/auth/check-wallet', {
          walletAddress: wallet.toLowerCase(),
        });

        if (checkResponse.data.exists) {
          setError('Wallet address is already registered. Please sign in instead.');
          return;
        }

        // Proceed with registration
        const response = await axios.post('http://localhost:5000/auth/register', {
          walletAddress: wallet.toLowerCase(),
        });

        if (response.data.token) {
          // Save token and user data
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('userId', response.data.user._id);
          
          // Redirect to role selection
          navigate('/role-selection');
        }
      } catch (error) {
        console.error('Signup error', error);
        if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else {
          setError('Signup failed. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please install MetaMask to use this feature.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-green-900">Create your Account</h2>
          <p className="text-sm text-gray-600 mt-1">
            {isConnected ? 'Complete your registration' : 'Connect your wallet to get started'}
          </p>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center mb-4">
            {error}
          </div>
        )}

        {!isConnected ? (
          <button
            onClick={connectMetaMask}
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-gray-200 rounded-md bg-white text-gray-800 hover:bg-gray-50 shadow-sm"
          >
            <span className="mr-2">🦊</span>
            {loading ? 'Connecting...' : 'Connect MetaMask'}
          </button>
        ) : (
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Connected wallet: {walletAddress}
            </p>
            <button
              onClick={connectMetaMask}
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-200 rounded-md bg-white text-gray-800 hover:bg-gray-50 shadow-sm"
            >
              {loading ? 'Registering...' : 'Complete Registration'}
            </button>
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/signin')}
              className="font-medium text-green-800 hover:text-green-700"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;