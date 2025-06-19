// components/Preloader.js
import React from 'react';
import Image from 'next/image';

const Preloader = () => {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="text-center">
        <img src="/images/logo.png" alt="Loading..." style={{width:"25%"}}/>
        <p className="mt-2">Loading, please wait...</p>
      </div>
    </div>
  );
};

export default Preloader;
