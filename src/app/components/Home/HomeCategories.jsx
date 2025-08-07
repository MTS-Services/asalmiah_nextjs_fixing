'use client';

import { useQuery } from '@tanstack/react-query';
import { Col, Container, Row } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import Slider from 'react-slick';
import { GET_CATEGORY_LIST_HOME } from '../../../../services/APIServices';
import ImageComponent from '../../../../utils/ImageComponent';
import { checkLanguage } from '../../../../utils/helper';
import { CATEGORYICON, REDUNDERLINE } from '../SvgIcons';

const HomeCategories = ({ onCategoryClick }) => {
  // Fetch category list
  const { data: categoryList } = useQuery({
    queryKey: ['category-list-home'],
    queryFn: async () => {
      const resp = await GET_CATEGORY_LIST_HOME();
      console.log('GET_CATEGORY_LIST_HOME :', resp?.data?.data);
      return resp?.data?.data ?? [];
    },
  });

  const categories = {
    navigation: true,
    nav: true,
    arrows: true,
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
    initialSlide: 0,
    prevArrow: (
      <button type='button' className='slick-prev'>
        <FaChevronLeft />
      </button>
    ),
    nextArrow: (
      <button type='button' className='slick-next'>
        <FaChevronRight />
      </button>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
          arrows: true,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 3,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  return (
    <>
      {categoryList?.length > 0 && (
        <section className='catagories notranslate'>
          <div className='heading-section text-center mb-lg-5 mb-3'>
            <Container>
              <Row>
                <Col md={6} className='mx-auto'>
                  <CATEGORYICON />
                  <h3>Our Categories</h3>
                  <REDUNDERLINE />
                </Col>
              </Row>
            </Container>
          </div>

          <Container>
            <div className='slider-container catslider'>
              <Slider {...categories}>
                {categoryList?.map((data) => {
                  return (
                    <div
                      className='catcard'
                      onClick={() => {
                        onCategoryClick({
                          id: data?._id,
                          name: data?.category,
                          arabic: data?.arabicCategory,
                        });
                      }}
                      key={data?._id}
                    >
                      <ImageComponent
                        data={data?.categoryImg}
                        fill
                        className='mx-auto'
                        designImage={true}
                      />
                      <h4>
                        {checkLanguage(data?.category, data?.arabicCategory)}
                      </h4>
                    </div>
                  );
                })}
              </Slider>
            </div>
          </Container>
        </section>
      )}
    </>
  );
};

export default HomeCategories;
