'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Col, Container, Form, Offcanvas, Row } from 'react-bootstrap';
import { ShimmerPostItem } from 'react-shimmer-effects';

import { FaList } from 'react-icons/fa';
import { FaFilter } from 'react-icons/fa6';
import { IoGrid } from 'react-icons/io5';
import '../(customer)/cart/page.scss';

import useCountryState from '../../../hooks/useCountryState';
import useDetails from '../../../hooks/useDetails';

import { GET_PRODUCTLIST } from '../../../services/APIServices';

import Footer from '../../../utils/Footer';
import Header from '../../../utils/Header';

import UserLogInHeader from '../../../utils/UserLogInHeader';
import { constant, Paginations } from '../../../utils/constants';

import { Pagination } from '../components/Pagination';
import NoDataFound from '../components/no-data-found/page';
import TestFilter from '../components/TestFilter';
import Filter from '../components/Filter';
import ProductCard from '../components/products/ProductCard';
import { BiFilter } from 'react-icons/bi';
import Link from 'next/link';

const ProductList = () => {
  let detail = useDetails();
  let queryClient = useQueryClient();

  // =========================================
  // ✅ DEFINE FILTERS
  // =========================================
  const pathName = usePathname();
  const selectedCountry = useCountryState();

  // =========================================
  // ✅ DEFINE FILTERS
  // =========================================
  const [meta, setMeta] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);

  // =========================================
  // ✅ DEFINE FILTERS
  // =========================================
  const [classificationArr, setClassificationArr] = useState([]);
  const [subCategoryArr, setSubCategoryArr] = useState([]);
  const [categoryArr, setCategoryArr] = useState([]);
  const [companyArr, setCompanyArr] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [minDiscount, setMinDiscount] = useState(0);
  const [maxDiscount, setMaxDiscount] = useState(100);

  // =========================================
  // ✅ DEFINE FILTERS
  // =========================================
  const [sort, setSort] = useState();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // =========================================
  // ✅ CALL USE-EFFECT
  // =========================================
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  // ==========================================
  // 📋 ALL_PRODUCTS_LIST USE TS_QUERY
  // ==========================================
  const {
    data: allProductList,
    refetch,
    isPending,
  } = useQuery({
    queryKey: ['product-all-list', companyArr[0], classificationArr[0], page],
    queryFn: async () => {
      const resp = await GET_PRODUCTLIST(
        null,
        companyArr[0],
        classificationArr[0],
        page
      );

      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });

  // let router = useRouter();

  // =========================================
  // 📁 RE_FETCH
  // =========================================
  const refetchFunc = () => {
    refetch();
    queryClient.invalidateQueries({ queryKey: ['company-list'] });
  };

  return (
    <>
      {detail?.roleId == constant?.USER ? (
        <UserLogInHeader refetchAPI={refetchFunc} />
      ) : (
        <Header refetchAPI={refetchFunc} />
      )}

      <Container>
        <Row>
          {/**************** TOP_FILTER *********************/}
          <header className='left-sidebar mb-5'>
            <TestFilter
              refetch={refetch}
              setCategoryArr={setCategoryArr}
              categoryArr={categoryArr}
              setClassificationArr={setClassificationArr}
              classificationArr={classificationArr}
              setSubCategoryArr={setSubCategoryArr}
              subCategoryArr={subCategoryArr}
            />
          </header>
        </Row>
      </Container>

      <Container className='list-main mb-30'>
        <Row>
          {/**************** LEFT_SIDE_FILTER *********************/}
          <Col lg={3}>
            <aside className='d-none d-lg-block left-sidebar'>
              <span className='filter-text'>
                <FaFilter size='20' />
                <b className='mt-2 m-2'>Filter</b>
              </span>

              <Filter
                refetch={refetch}
                setCategoryArr={setCategoryArr}
                setClassificationArr={setClassificationArr}
                classificationArr={classificationArr}
                selectedCountry={selectedCountry}
                categoryArr={categoryArr}
                setCompanyArr={setCompanyArr}
                companyArr={companyArr}
                setSubCategoryArr={setSubCategoryArr}
                subCategoryArr={subCategoryArr}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                setMinDiscount={setMinDiscount}
                setMaxDiscount={setMaxDiscount}
                minDiscount={minDiscount}
                maxDiscount={maxDiscount}
              />
            </aside>
          </Col>

          <Col lg={9}>
            <div>
              {/**************** TOP_SORTING *********************/}
              <div className='top-filter-menu mb-5'>
                <Row>
                  <Col lg={6}>
                    <div className='d-flex align-items-center gap-2 gap-lg-3'>
                      <Form.Select
                        aria-label='Default select example'
                        onChange={(e) => setSort(e.target.value)}
                      >
                        <option value=''> Sort By</option>
                        <option value='1'>High to low</option>
                        <option value='2'>Low to high</option>
                      </Form.Select>
                    </div>
                  </Col>
                  <Col lg={6} className='mt-lg-0 mt-4'>
                    <div className='d-flex align-items-center justify-content-lg-end justify-content-start gap-3 prodiuct-view'>
                      <div
                        className='btn btn-theme filter_btn d-block d-lg-none'
                        onClick={handleShow}
                      >
                        <BiFilter size={16} />
                        <small className='ms-2'>Filter</small>
                      </div>
                      <div className='list-view'>
                        <Link className='active-btn' href='/product-list'>
                          <IoGrid />
                        </Link>
                      </div>
                      <div className='grid-view'>
                        <Link href='/product-grid'>
                          <FaList />
                        </Link>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              {/**************** PRODUCT_CARDS *********************/}
              <div>
                <Row>
                  {isPending ? (
                    Array.from({ length: 6 }, (_, index) => (
                      <Col lg={4} className='mb-4' key={`shimmer-${index}`}>
                        <div className='product-box-3 product-new'>
                          <div className='img-wrapper position-relative'>
                            <div className='product-image'>
                              <ShimmerPostItem
                                title
                                variant='secondary'
                                imageHeight={200}
                              />
                            </div>
                          </div>
                        </div>{' '}
                      </Col>
                    ))
                  ) : allProductList?.length !== 0 ? (
                    allProductList?.map((data) => {
                      return (
                        <Col lg={4} className='mb-4' key={data?._id}>
                          <ProductCard
                            key={data?._id}
                            selectedCountry={selectedCountry}
                            data={data}
                          />
                        </Col>
                      );
                    })
                  ) : (
                    <NoDataFound />
                  )}
                </Row>

                {/**************** PAGINATION *********************/}
                {!isPending && Math.ceil(meta?.totalCount / 12) > 1 && (
                  <Pagination
                    pageCount={'YES'}
                    totalCount={meta?.totalCount}
                    handelPageChange={(e) => setPage(e.selected + 1)}
                    page={page}
                  />
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />

      {/*********************** Filter Off Canvas *******************************/}
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filter Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <aside className='left-sidebar'>
            <span className='filter-text'>
              <FaFilter size='20' />
              <b className='mt-2 m-2'>Filter</b>
            </span>
            <Filter
              refetch={refetch}
              setCategoryArr={setCategoryArr}
              categoryArr={categoryArr}
              setClassificationArr={setClassificationArr}
              classificationArr={classificationArr}
              setCompanyArr={setCompanyArr}
              companyArr={companyArr}
              setSubCategoryArr={setSubCategoryArr}
              subCategoryArr={subCategoryArr}
              setSearch={setSearch}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              setMinDiscount={setMinDiscount}
              setMaxDiscount={setMaxDiscount}
              minDiscount={minDiscount}
              maxDiscount={maxDiscount}
            />
          </aside>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default ProductList;
