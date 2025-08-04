'use client';

import { useRef, useState } from 'react';
import { Container, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import {
  GET_FILTER_CLASSIFICATION_API,
  USER_COMPANYLIST,
} from '../../../services/APIServices';
import { checkLanguage } from '../../../utils/helper';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import '../components/testFilter.scss';

const TestFilter = ({
  companyArr,
  setCompanyArr,
  classificationArr,
  setClassificationArr,
}) => {
  const [activeCompany, setActiveCompany] = useState(null); // Track selected company

  // Fetch company list
  const {
    data: companyList = [],
    isLoading: companyLoading,
    isError: companyError,
  } = useQuery({
    queryKey: ['company-list'],
    queryFn: async () => {
      const resp = await USER_COMPANYLIST();
      return resp?.data?.data ?? [];
    },
  });

  // Fetch classification list
  const {
    data: classificationList = [],
    isLoading: classificationLoading,
    isError: classificationError,
  } = useQuery({
    queryKey: ['classification-filter-list'],
    queryFn: async () => {
      const resp = await GET_FILTER_CLASSIFICATION_API();
      return resp?.data?.data ?? [];
    },
  });

  // Handle company click (select & show its classifications)
  const handleCompanyClick = (company) => {
    if (activeCompany?.id === company._id) {
      // Deselect if already selected
      setActiveCompany(null);
      setCompanyArr([]);
    } else {
      // Select new company
      setActiveCompany(company);
      setCompanyArr([company._id]); // Radio-style selection
    }
  };

  // Handle classification selection
  const handleClassificationClick = (classification) => {
    const id = classification._id;
    if (classificationArr.includes(id)) {
      setClassificationArr(classificationArr.filter((i) => i !== id));
    } else {
      setClassificationArr([...classificationArr, id]);
    }
  };

  // Filter classifications by selected company (if needed)
  // Or just show all — depends on your backend logic
  const filteredClassifications = classificationList;

  const scrollRef = useRef(null);

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
    <Container fluid className='px-0'>
      {/* === 1. COMPANIES ROW (Horizontal Scrollable Tabs) === */}
      <Row className='mb-3 align-items-center position-relative'>
        <Col>
          <h6 className='fw-bold mb-2 p-t-10 text-capitalize'>Companies</h6>

          {companyLoading ? (
            <div className='text-center my-3'>
              <Spinner animation='border' size='sm' variant='primary' /> Loading
              companies...
            </div>
          ) : companyError ? (
            <Alert variant='danger' className='py-2'>
              Failed to load companies.
            </Alert>
          ) : (
            <div className='position-relative'>
              {/* Scroll Buttons */}
              <Button
                variant='light'
                className='scroll-btn left'
                onClick={() => scroll('left')}
              >
                <FaChevronLeft />
              </Button>

              <div
                ref={scrollRef}
                className='company-scroll d-flex gap-2 pb-2 px-2'
                style={{
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  whiteSpace: 'nowrap',
                  WebkitOverflowScrolling: 'touch',
                  scrollBehavior: 'smooth',
                }}
              >
                {companyList.map((company) => (
                  <Button
                    key={company._id}
                    variant={
                      companyArr.includes(company._id)
                        ? 'danger'
                        : 'outline-danger'
                    }
                    onClick={() => handleCompanyClick(company)}
                    style={{
                      whiteSpace: 'nowrap',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      padding: '0px 12px',
                      fontWeight: 500,
                      flex: '0 0 auto',
                    }}
                  >
                    {checkLanguage(company.company, company.arabicCompany)}
                  </Button>
                ))}
              </div>

              <Button
                variant='light'
                className='scroll-btn right'
                onClick={() => scroll('right')}
              >
                <FaChevronRight />
              </Button>
            </div>
          )}
        </Col>
      </Row>

      {/* === 2. CLASSIFICATIONS ROW (Only if company selected) === */}
      {activeCompany && !classificationLoading && !classificationError && (
        <Row className='mb-4'>
          <Col>
            <h6 className='fw-bold mb-2 text-capitalize'>Categories</h6>
            <div
              className='d-flex flex-wrap gap-2 p-3 bg-light border-top'
              style={{
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              {filteredClassifications.length > 0 ? (
                filteredClassifications.map((cls) => (
                  <Button
                    key={cls._id}
                    variant={
                      classificationArr.includes(cls._id)
                        ? 'primary'
                        : 'outline-primary'
                    }
                    onClick={() => handleClassificationClick(cls)}
                    style={{
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      padding: '0px 12px',
                      fontWeight: classificationArr.includes(cls._id)
                        ? '600'
                        : '500',
                    }}
                  >
                    {checkLanguage(cls.name, cls.arbicName)}
                  </Button>
                ))
              ) : (
                <small className='text-muted'>No categories available</small>
              )}
            </div>
          </Col>
        </Row>
      )}

      {/* === Loading/Error for Classification === */}
      {classificationLoading && (
        <Row>
          <Col>
            <div className='text-center my-3'>
              <Spinner animation='border' size='sm' variant='primary' /> Loading
              categories...
            </div>
          </Col>
        </Row>
      )}

      {classificationError && (
        <Row>
          <Col>
            <Alert variant='warning' className='py-2'>
              Could not load categories.
            </Alert>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default TestFilter;
