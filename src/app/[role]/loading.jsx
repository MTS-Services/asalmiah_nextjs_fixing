import Image from 'next/image';
import React from 'react';
import logo from '../../../public/assets/img/logo.png';
const Loading = () => {
  return (
    <div className='customloader'>
      <div className='ripple'></div>
      <div className='logocontent'>
        <Image height={57} width={154} src={logo} alt='hi' />
      </div>
    </div>
  );
};

export default Loading;
