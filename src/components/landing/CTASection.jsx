import React from 'react'

const CTASection = ({openSignUp}) => {
  return (
    <div className='bg-blue-500'>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:justify-between lg:items-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <spam className='block'>Ready to grt started?</spam>
          <spam className='block text-blue-100'>Create your account today.</spam>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className=" inline-flex rounded-md shadow">
              <button 
              onClick={() => openSignUp()}
              className='text-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors duration-200'>Sign up for free</button>
            </div>
        </div>
      </div>
    </div>
  )
}

export default CTASection