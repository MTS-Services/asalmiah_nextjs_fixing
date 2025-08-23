'use client';

import { Col, Container, Row } from 'react-bootstrap';
import { ShimmerPostItem } from 'react-shimmer-effects';

import ProductCard from '../products/ProductCard';
import NoDataFound from '../no-data-found/page';

const HomeProductList = ({ allProductList, isPending }) => {
  const selectedCountry = 'Kuwait';

  return (
    <section className='home-product-list py-5'>
      <Container>
        {/* Product List Content */}
        <Row>
          {/* Products Grid (Fixed: Always Grid View) */}

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
      </Container>
    </section>
  );
};

export default HomeProductList;
