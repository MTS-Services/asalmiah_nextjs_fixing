/**
@copyright  : Mak Tech Solution < www.maktechsolution.com >
@author     : Nayem Islam < inaeem707@gmail.com >

All Rights Reserved.
Proprietary and confidential: All information contained herein is, and remains
the property of Mak Tech Solution and its partners.
Unauthorized copying of this file, via any medium, is strictly prohibited.
*/
'use client';
import React from 'react';

const Input = ({ type, name, value, onChange, className, placeholder }) => {
  return (
    <div>
      <input
        className={className}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
