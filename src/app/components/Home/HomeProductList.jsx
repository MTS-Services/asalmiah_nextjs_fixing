'use client';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';
import { Col, Container, Offcanvas, Row } from 'react-bootstrap';

import { ShimmerPostItem } from 'react-shimmer-effects';
import {
  GET_PRODUCTLIST,
  ADD_WISHLIST,
} from '../../../../services/APIServices';
import { Paginations } from '../../../../utils/constants';

import { Pagination } from '../Pagination';
import ProductCard from '../products/ProductCard';

const HomeProductList = ({ categoryList }) => {
  const selectedCountry = 'Kuwait';

  // Product List States
  const [productPage, setProductPage] = useState(Paginations.DEFAULT_PAGE);
  const [productMeta, setProductMeta] = useState('');

  const [productClassificationArr, setProductClassificationArr] = useState([]);
  const [productCompanyArr, setProductCompanyArr] = useState([]);

  // Product List Query
  const {
    data: homeProductList,
    refetch: homeProductRefetch,
    isPending: homeProductPending,
    isFetching: homeProductFetching,
  } = useQuery({
    queryKey: [
      'home-product-list',
      productCompanyArr[0],
      productClassificationArr[0],
      productPage,
    ],
    queryFn: async () => {
      const resp = await GET_PRODUCTLIST(
        null,
        productCompanyArr[0],
        productClassificationArr[0],
        productPage
      );
      setProductMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });

  return (
    <section className='home-product-list py-5'>
      <Container>
        {/* Product List Content */}
        <Row>
          {/* Products Grid (Fixed: Always Grid View) */}
          <Col>
            {homeProductPending || homeProductFetching ? (
              <Row>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Col key={item} md={4} className='mb-4'>
                    <ShimmerPostItem card title cta />
                  </Col>
                ))}
              </Row>
            ) : homeProductList?.length > 0 ? (
              <>
                <Row>
                  {homeProductList.map((data) => (
                    <Col lg={4} className='mb-4' key={data?._id}>
                      <ProductCard
                        selectedCountry={selectedCountry}
                        data={data}
                      />
                    </Col>
                  ))}
                </Row>

                {/* Pagination */}
                {productMeta?.totalCount > 12 && (
                  <div className='pagination-wrapper mt-4'>
                    <Pagination
                      totalCount={productMeta.totalCount}
                      handelPageChange={(e) => setProductPage(e.selected + 1)}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className='text-center py-5'>
                <h4>No products found</h4>
                <p className='text-muted'>
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HomeProductList;
