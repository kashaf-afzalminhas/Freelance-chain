import React, { useState } from 'react';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log({ email, password, rememberMe });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4 sm:px-6">
      <div className="w-full max-w-md p-4 sm:p-8 space-y-6 sm:space-y-8 bg-white rounded-lg shadow-md">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
            </svg>
          </div>
        </div>
        
        {/* Welcome Text */}
        <div className="text-center">
          <h2 className="mt-4 sm:mt-6 text-xl sm:text-2xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">Please enter your details to sign in</p>
        </div>
        
        {/* Login Form */}
        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700">
                Email or Wallet Address
              </label>
              <input
                id="email"
                name="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email or wallet address"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="••••••••"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs sm:text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              
              <div className="text-xs sm:text-sm">
                <a 
                  href="#" 
                  className="font-medium hover:text-opacity-80"
                  style={{ color: '#0C3B2E' }}
                >
                  Forgot password?
                </a>
              </div>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700"
              style={{ backgroundColor: '#0C3B2E' }}
            >
              Sign in
            </button>
          </div>
          
          <div className="mt-3 sm:mt-4">
            <button
              type="button"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.3 2.82L8.7 0.1C8.3 -0.1 7.7 -0.1 7.3 0.1L2.7 2.82C2.3 3.02 2 3.52 2 4.02V8.92C2 12.52 5.2 16.92 10 18.52C14.8 16.92 18 12.52 18 8.92V4.02C18 3.52 17.7 3.02 17.3 2.82L13.3 2.82Z" />
              </svg>
              Login with MetaMask
            </button>
          </div>
        </form>
        
        {/* Sign Up Link */}
        <div className="text-center mt-3 sm:mt-4">
          <p className="text-xs sm:text-sm text-gray-600">
            Don't have an account?{' '}
            <a 
              href="#" 
              className="font-medium hover:text-opacity-80"
              style={{ color: '#0C3B2E' }}
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;