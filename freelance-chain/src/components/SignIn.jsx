import React, { useState } from "react";
import { Link } from "react-router-dom";
const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign in logic
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fcfaf6]">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-[#0C3B2E] text-center mb-4">Welcome Back!</h2>
        <p className="text-gray-600 text-center mb-6">Enter personal details to your employee account.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-gray-300 rounded-md w-full p-2"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-gray-300 rounded-md w-full p-2"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#FFBA00] text-white font-semibold py-2 rounded-md hover:bg-[#e6a600]"
          >
            SIGN IN
          </button>
          <div className="text-center">
            <a href="#" className="text-[#6D9773] hover:underline">Forgot your password?</a>
          </div>
        </form>
        <p>
  Don't have an account? 
  <Link to="/Signup" className="text-[#6D9773] hover:underline">Sign Up</Link>
</p>
        <div className="text-center mt-4">
          <span className="text-gray-600">or Continue with </span>
        </div>
        <div className="flex justify-around mt-4">
          <button className="bg-[#0C3B2E] text-white rounded-full p-2">
            G+
          </button>
          <button className="bg-[#0C3B2E] text-white rounded-full p-2">
            LinkedIn
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;