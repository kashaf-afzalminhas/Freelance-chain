import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const SignUp = ({ setUser }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setWalletAddress(accounts[0] || '');
        setIsConnected(!!accounts[0]);
      });
    }
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:5000/auth/register', { email, password });
        localStorage.setItem('userId', response.data.userId);
        navigate('/role-selection');
    } catch (error) {
        console.error('Signup error', error);
        alert('Signup failed');
    }
};

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        navigate('/role-selection');
      } catch (error) {
        console.error("MetaMask connection error", error);
        alert("MetaMask connection failed");
      }
    } else {
      alert("Please install MetaMask");
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4 sm:px-6">
      <div className="w-full max-w-md p-4 sm:p-8 space-y-6 bg-white rounded-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-900 text-center">Create Account</h1>
        <form className="mt-8 space-y-4 sm:space-y-5" onSubmit={handleSignup}>
          <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full px-3 py-3 border rounded-md" />
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-3 border rounded-md" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-3 border rounded-md" />
          <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-3 py-3 border rounded-md" />
          {walletAddress && <p className="text-sm text-green-700">Connected Wallet: {walletAddress}</p>}
          <button type="submit" className="w-full py-3 px-4 bg-green-900 text-white rounded-md">Sign Up</button>
        </form>
        <button onClick={connectMetaMask} className="w-full flex justify-center items-center py-3 px-4 border rounded-md bg-white text-green-900">
          {isConnected ? 'Connected to MetaMask' : 'Login with MetaMask'}
        </button>
      </div>
    </div>
  );
};

export default SignUp;
