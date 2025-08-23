import React from 'react';
import Image from 'next/image';
import downloadimg from '../../../../public/assets/img/hero-banner.png';

const HomeHero = () => {
  return (
    <section className='container-fluid p-0'>
      <div className='position-relative'>
        <Image
          src={downloadimg}
          alt='Hero'
          className='img-fluid w-100'
          width={1920}
          height={600}
          priority
        />
      </div>
    </section>
  );
};

export default HomeHero;
