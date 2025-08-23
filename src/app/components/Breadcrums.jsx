import Link from 'next/link';
import React from 'react';

const Breadcrums = ({ firstLink, secondLink, language }) => {
  const isArabic = language == 'ar'; // Fix the comparison here to be strict (===)
  const breadcrumbItems = isArabic
    ? [secondLink, firstLink] // Reverse the order for Arabic
    : [firstLink, secondLink];

  const breadcrumbStyle = {
    direction: isArabic ? 'rtl' : 'ltr',
  };

  const containerStyle = {
    textAlign: isArabic ? 'right' : 'center',
  };

  return (
    <section className='Breadcrumb'>
      <div className='container' style={containerStyle}>
        <nav aria-label='breadcrumb'>
          <ol
            className='breadcrumb justify-content-center'
            style={breadcrumbStyle}
          >
            <li className='breadcrumb-item'>
              <Link href='/'>{breadcrumbItems[0] ?? ''}</Link>
            </li>
            <li className='breadcrumb-item active' aria-current='page'>
              {breadcrumbItems[1] ?? ''}
            </li>
          </ol>
        </nav>
        <h3>{breadcrumbItems[1]}</h3>
      </div>
    </section>
  );
};

export default Breadcrums;
