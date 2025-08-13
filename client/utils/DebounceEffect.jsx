/**
 * @copyright : Toxsl Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Toxsl Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Button, Form } from 'react-bootstrap';
import { IoSearchOutline } from 'react-icons/io5';

const DebounceEffect = ({ onSearch, user }) => {
  const [search, setSearch] = useState('');

  // Debounce function
  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((value) => {
      onSearch(value); // Call the search function passed as a prop
    }, 800),
    []
  );

  // Update debounced search when the search term changes
  useEffect(() => {
    // if (search) {
    debouncedSearch(search);
    // }
  }, [search, debouncedSearch]);
  if (user) {
    return (
      <>
        <div className='search-box'>
          <Form.Control
            type='text'
            className='h-100'
            value={search}
            placeholder='Search'
            onChange={(e) => setSearch(e.target.value)}
            // onKeyDown={(e) => e.key === "Enter" && onSearch(search)}
            // onKeyUp={(e) => e.target.value === "" && onSearch("")}
          />
          <IoSearchOutline />
        </div>
      </>
    );
  } else {
    return (
      <>
        <Form.Control
          type='text'
          className='h-100'
          value={search}
          placeholder='Search'
          onChange={(e) => setSearch(e.target.value)}
          // onKeyDown={(e) => e.key === "Enter" && onSearch(search)}
          // onKeyUp={(e) => e.target.value === "" && onSearch("")}
        />
      </>
    );
  }
};

export default DebounceEffect;
