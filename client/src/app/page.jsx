/**
@copyright    : Mak Tech Solution < https://www.maktechsolution.com >
@author       : Nayem Islam < https://github.com/Nayem707 >
@Updated_Date : 7/8/2025
**/

'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import useDetails from '../../hooks/useDetails';

import {
  GET_CATEGORY_LIST_HOME,
  GET_USER_OFFERS,
} from '../../services/APIServices';

import Footer from '../../utils/Footer';
import Header from '../../utils/Header';
import { trans } from '../../utils/trans';
import { constant } from '../../utils/constants';
import UserLogInHeader from '../../utils/UserLogInHeader';

import OfferListComponent from './components/OfferListComponent';
import HomeDynamicLabels from './components/Home/HomeDynamicLabels';
import HomeDownloadApp from './components/Home/HomeDownloadApp';
import HomeBanner from './components/Home/HomeBanner';
import HomeServices from './components/Home/HomeServices';
import HomeProductList from './components/Home/HomeProductList';
import HomeTestimonials from './components/Home/HomeTestimonials';

import CategoryModal from './components/CategoryModal';
import TopFilter from './components/TestFilter';
import { Col, Container, Row } from 'react-bootstrap';
import Filter from './components/Filter';
import useCountryState from '../../hooks/useCountryState';

const Home = ({ params }) => {
  // =========================================
  // ✅ EXISTING STATE
  // =========================================
  const [categoryArr, setCategoryArr] = useState([]);
  const [classificationArr, setClassificationArr] = useState([]);
  const [companyArr, setCompanyArr] = useState([]);
  const [subCategoryArr, setSubCategoryArr] = useState([]);
  const selectedCountry = useCountryState();

  // =========================================
  // ✅ RANGE STATE
  // =========================================
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [minDiscount, setMinDiscount] = useState(0);
  const [maxDiscount, setMaxDiscount] = useState(100);

  // =========================================
  // ✅ EXISTING STATE
  // =========================================
  const [show, setShow] = useState(false);
  const testimonialRef = useRef(null);
  const [categoryId, setCategoryId] = useState({
    id: '',
    name: '',
    arabic: '',
  });

  const [subCategoryId, setSubCategoryId] = useState();
  const [show1, setShow1] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose1 = () => setShow1(false);

  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState('');

  const handleClose = () => setShow(false);
  const handleShow1 = () => setShow1(true);

  const offarat = trans('offarat');

  // =========================================
  // ✅ CALL USE-EFFECT
  // =========================================
  useEffect(() => {
    document.title = offarat;
  }, []);

  // =========================================
  // 📋 CATEGORY = FETCH & USE TS_QUERY
  // =========================================
  const { data: categoryList, refetch } = useQuery({
    queryKey: ['category-list-home'],
    queryFn: async () => {
      const resp = await GET_CATEGORY_LIST_HOME();
      console.log(resp?.data?.data);
      return resp?.data?.data ?? [];
    },
  });

  // =========================================
  // 📋 OFFER_LIS = FETCH & USE TS_QUERY
  // =========================================
  const { data: OfferLists, refetch: refetchOfferList } = useQuery({
    queryKey: ['offer-list-home'],
    queryFn: async () => {
      const resp = await GET_USER_OFFERS();
      return resp?.data?.data ?? [];
    },
  });

  // =========================================
  // 📁 TESTIMONIAL
  // =========================================
  const scrollToTestimonial = () => {
    if (testimonialRef.current) {
      testimonialRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  let detail = useDetails();

  // =========================================
  // 📁 RE_FETCH
  // =========================================
  const refetchFunc = () => {
    refetch();
    refetchOfferList();
  };

  return (
    <>
      {detail?.roleId == constant?.USER ? (
        <UserLogInHeader
          scrollToTestimonial={scrollToTestimonial}
          refetchAPI={refetchFunc}
        />
      ) : (
        <Header
          scrollToTestimonial={scrollToTestimonial}
          refetchAPI={refetchFunc}
        />
      )}

      <Container>
        <Row>
          <aside className='left-sidebar '>
            <TopFilter
              refetch={refetch}
              setCategoryArr={setCategoryArr}
              categoryArr={categoryArr}
              setClassificationArr={setClassificationArr}
              classificationArr={classificationArr}
              setSubCategoryArr={setSubCategoryArr}
              subCategoryArr={subCategoryArr}
            />
          </aside>
        </Row>
      </Container>

      <Container>
        <Row>
          <Col lg={3}>
            <Filter
              refetch={refetch}
              setCategoryArr={setCategoryArr}
              setClassificationArr={setClassificationArr}
              classificationArr={classificationArr}
              selectedCountry={selectedCountry}
              categoryArr={categoryArr}
              setCompanyArr={setCompanyArr}
              setSubCategoryArr={setSubCategoryArr}
              companyArr={companyArr}
              subCategoryArr={subCategoryArr}
              minPrice={minPrice}
              maxPrice={maxPrice}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
              setMinDiscount={setMinDiscount}
              setMaxDiscount={setMaxDiscount}
              minDiscount={minDiscount}
              maxDiscount={maxDiscount}
            />
          </Col>

          <Col lg={9}>
            {/* Product List Section */}
            <HomeProductList categoryList={categoryList} />
          </Col>
        </Row>
      </Container>
      {/* Banner Section */}
      <HomeBanner />

      {/* Categories Section */}
      {/* <HomeCategories
        onCategoryClick={(category) => {
          setCategoryId(category);
          handleShow(true);
        }}
      /> */}

      {/* Offers Section */}
      <OfferListComponent OfferLists={OfferLists} />

      {/* Dynamic Labels Section */}
      <HomeDynamicLabels />

      {/* Download App Section */}
      <HomeDownloadApp />

      {/* Services Section */}
      <HomeServices />

      {/* Testimonials Section */}
      <HomeTestimonials testimonialRef={testimonialRef} />

      {/* Footer */}
      <Footer testimonialLists={0} />

      {/* Category Modal */}
      <CategoryModal
        show={show}
        onHide={handleClose}
        categoryId={categoryId}
        onSubCategoryClick={(subCategory) => {
          setSubCategoryId(subCategory);
          handleClose();
          handleShow1(true);
        }}
        page={page}
        setPage={setPage}
        meta={meta}
        setMeta={setMeta}
      />
    </>
  );
};

export default Home;
