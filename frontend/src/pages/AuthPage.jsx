import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { ChefHat } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="w-full max-w-sm p-6 space-y-4 bg-black border border-green-400 rounded-2xl shadow-xl shadow-green-400/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse animation-delay-2000"></div>

        <div className="relative z-10 text-center">
          <div className="flex justify-center items-center mb-4">
            <img
                src="/snapdish-logo.png"
                alt="SnapDish Logo"
                className="h-8 md:h-10 w-auto"
            />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isLogin ? 'Welcome Back!' : 'Get Started to Cook'}
          </h2>
        </div>

        {/* Form Container */}
        <div className="relative z-10">
          {isLogin ? (
            <div className="space-y-4">
              <input type="email" placeholder="Email" className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all text-sm" />
              <input type="password" placeholder="Password" className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all text-sm" />
              <button className="w-full py-2 rounded-full font-semibold transition-all duration-300 bg-transparent hover:bg-gray-900 border text-white hover:from-green-500 hover:to-blue-500 hover:scale-105 text-sm">
                Sign In
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <input type="text" placeholder="Username" className="w-full px-3 py-2 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all text-sm" />
              <input type="email" placeholder="Email" className="w-full px-3 py-2 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all text-sm" />
              <input type="password" placeholder="Password" className="w-full px-3 py-2 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all text-sm" />
              <button className="w-full py-2 rounded-full font-semibold transition-all duration-300 bg-transparent border hover:bg-gray-900 text-white hover:from-green-500 hover:to-blue-500 hover:scale-105 text-sm">
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Separator and Google Button */}
        <div className="relative z-10 flex items-center justify-center my-4">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="flex-shrink mx-2 text-gray-500 text-xs">Or</span>
            <div className="flex-grow border-t border-gray-700"></div>
        </div>

        <button className="w-full py-2 px-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-300 border border-gray-700 text-white bg-gray-800 hover:bg-gray-700 hover:border-gray-600 hover:scale-[1.02] text-sm">
            <FcGoogle size={20} />
            <span>Continue with Google</span>
        </button>

        {/* Toggle Button */}
        <div className="relative z-10 text-center text-xs mt-2">
          <p className="text-gray-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 text-green-400 hover:text-green-500 font-bold transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;