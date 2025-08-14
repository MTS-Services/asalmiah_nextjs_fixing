/**
@copyright    : Mak Tech Solution < https://www.maktechsolution.com >
@author       : Nayem Islam < https://github.com/Nayem707 >
@Updated_Date : 7/8/2025
**/

'use client';

import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

import {
  GET_FILTER_CLASSIFICATION_API,
  USER_CATEGORYLIST,
} from '../../../services/APIServices';
import '../components/testFilter.scss';

import { checkLanguage } from '../../../utils/helper';

const TestFilter = ({
  categoryArr,
  setCategoryArr,
  classificationArr,
  setClassificationArr,
  refetch,
}) => {
  const scrollRef = useRef(null);
  // ===============================================
  // 📋 CATEGORY = FETCH & USE TS_QUERY
  // ===============================================
  const {
    data: categoryList = [],
    isLoading: categoryLoading,
    isError: categoryError,
  } = useQuery({
    queryKey: ['category-list'],
    queryFn: async () => {
      const resp = await USER_CATEGORYLIST();
      return resp?.data?.data ?? [];
    },
  });

  // ===============================================
  // 📋 CLASSIFICATION_LIST = FETCH & USE TS_QUERY
  // ===============================================
  const {
    data: classificationList = [],
    isLoading: classificationLoading,
    isError: classificationError,
  } = useQuery({
    queryKey: ['classification-filter-list', categoryArr[0]],
    queryFn: async () => {
      if (categoryArr.length === 0) return [];
      // Fetch classifications based on selected category
      const resp = await GET_FILTER_CLASSIFICATION_API(categoryArr[0]);
      return resp?.data?.data ?? [];
    },
    enabled: categoryArr.length > 0,
  });

  // =========================================
  // 📁 HANDLE_CATEGORY
  // =========================================
  const handleCategoryClick = (category) => {
    if (categoryArr.includes(category._id)) {
      setCategoryArr([]);
      setClassificationArr([]);
    } else {
      setCategoryArr([category._id]);
      // Clear classifications when changing category
      setClassificationArr([]);
      // Trigger refetch if needed
      if (refetch) refetch();
    }
  };

  // =========================================
  // 📁 HANDLE_CLASSIFICATION_LIST
  // =========================================
  const handleClassificationClick = (classification) => {
    const id = classification._id;
    const newClassifications = classificationArr.includes(id)
      ? classificationArr.filter((i) => i !== id)
      : [...classificationArr, id];

    setClassificationArr(newClassifications);
    if (refetch) refetch();
  };

  // =========================================
  // 🚀SCROLL_DIRECTION
  // =========================================
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 150;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Container>
      {/* CATEGORIES SECTION */}
      <Row className='mt-4'>
        <Col>
          {categoryLoading ? (
            <div className='text-center my-3'>
              <Spinner animation='border' size='sm' variant='primary' /> Loading
              categories...
            </div>
          ) : categoryError ? (
            <Alert variant='danger' className='py-2 text-center'>
              Failed to load categories.
            </Alert>
          ) : (
            <div className='position-relative d-flex align-items-center'>
              {/* Left Scroll Button */}
              <Button
                variant='light'
                className='scroll-btn left d-flex align-items-center justify-content-center p-0'
                onClick={() => scroll('left')}
              >
                <FaChevronLeft size={14} />
              </Button>

              {/* Scrollable Category Buttons (Centered Content) */}
              <div
                ref={scrollRef}
                className='company-scroll d-flex gap-2 pb-2 px-3 mx-auto flex-nowrap overflow-auto hide-scrollbar'
              >
                {categoryList.map((category) => (
                  <Button
                    key={category._id}
                    variant={
                      categoryArr.includes(category._id)
                        ? 'danger'
                        : 'outline-danger'
                    }
                    onClick={() => handleCategoryClick(category)}
                    className='rounded-pill btn-sm fw-medium'
                  >
                    {checkLanguage(category.category, category.arabicCategory)}
                  </Button>
                ))}
              </div>

              {/* Right Scroll Button */}
              <Button
                variant='light'
                className='scroll-btn right d-flex align-items-center justify-content-center p-0'
                onClick={() => scroll('right')}
              >
                <FaChevronRight size={14} />
              </Button>
            </div>
          )}
        </Col>
      </Row>

      {/* CLASSIFICATIONS SECTION (only shows when a category is selected) */}
      {categoryArr.length > 0 && (
        <Row className='mb-4'>
          <Col className='text-center'>
            <div className='d-flex flex-wrap justify-content-center gap-2'>
              {classificationLoading ? (
                <div className='text-center w-100'>
                  <Spinner animation='border' size='sm' />
                </div>
              ) : classificationError ? (
                <Alert
                  variant='warning'
                  className='py-2 w-100 mx-auto'
                  style={{ maxWidth: '300px' }}
                >
                  Could not load classifications.
                </Alert>
              ) : classificationList.length > 0 ? (
                classificationList.map((cls) => (
                  <Button
                    key={cls._id}
                    variant={
                      classificationArr.includes(cls._id)
                        ? 'primary'
                        : 'outline-primary'
                    }
                    onClick={() => handleClassificationClick(cls)}
                    className='btn btn-sm fw-medium'
                  >
                    {checkLanguage(cls.name, cls.arbicName)}
                  </Button>
                ))
              ) : (
                <small className='text-muted text-center w-100 mt-3'>
                  No classifications available
                </small>
              )}
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default TestFilter;
