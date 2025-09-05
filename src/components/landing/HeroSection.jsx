import React from 'react'
import DashboardImg from '../../assets/Dashboard.png'


const HeroSection = ({openSignIn,openSignUp}) => {
return (
    <section className="landing-page-content relative min-h-screen flex flex-col justify-center">
      {/* Background Layer */}
    <div className="absolute inset-0 bg-gradient-to-t from-blue-50 to-indigo-50 opacity-80 z-0 pointer-events-none"></div>
      {/* Foreground Content */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28 text-center">
        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Share Files Securely with</span>
            <span className="block text-blue-500">CloudShare</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Upload, manage, and share your files securely. Accessible anywhere, anytime.
        </p>

        <div className="mt-10 max-w-sm mx-auto sm:max-w-none flex justify-center gap-6">
            <button 
            onClick={() => openSignUp()}
            className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 md:py-4 md:text-lg md:px-10 transition-all duration-300 shadow-lg hover:shadow-xl">
            Get started
            </button>
            <button 
            onClick={() => openSignIn()}
            className="px-6 py-3 border border-transparent text-base font-medium rounded-md md:py-4 md:text-lg md:px-10 transition-all duration-300 shadow-lg hover:shadow-xl">
            Sign In
            </button>
        </div>
        </div>

        {/* Dashboard Image */}
        <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black opacity-10 rounded-lg"></div>
        <div className="aspect-w-16 rounded-lg shadow-xl overflow-hidden">
            <img src={DashboardImg} alt="CloudShare Dashboard" className="w-full h-full object-cover" />
        </div>
        </div>

        <div className="mt-8 text-center text-base text-gray-500">
            All your files are encrypted and stored securely with enterprise-grade security protocols.
        </div>
      </div>
    </section>
  );
};


export default HeroSection