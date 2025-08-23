'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { Col, Container, Row } from 'react-bootstrap';
import Slider from 'react-slick';
import { GET_USER_TESTIMONIAL } from '../../../../services/APIServices';
import testimonial1 from '../../../../public/assets/img/testimonials.png';

const HomeTestimonials = ({ testimonialRef }) => {
  const { data: testimonialLists } = useQuery({
    queryKey: ['testimonial-list-home'],
    queryFn: async () => {
      const resp = await GET_USER_TESTIMONIAL();
      return resp?.data?.data ?? [];
    },
  });

  const testimonial = {
    dots: true,
    infinite: testimonialLists?.length > 1 ? true : false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      {testimonialLists?.length !== 0 ? (
        <section className='testimonial' ref={testimonialRef}>
          <div className='heading-section text-center mb-lg-5 mb-3'>
            <Container>
              <Row>
                <Col md={6} className='mx-auto'>
                  <Image alt='image' src={testimonial1} className='w-100' />
                  <h3>What Our Customers Says!</h3>

                  <svg
                    width='94'
                    height='4'
                    viewBox='0 0 94 4'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <rect width='94' height='4' fill='#DA2A2C' />
                  </svg>
                </Col>
              </Row>
            </Container>
          </div>
          <Container>
            <div className='slider-container'>
              <Slider
                {...testimonial}
                dots={testimonialLists?.length > 1 ? true : false}
              >
                {testimonialLists?.map((data) => {
                  return (
                    <div className='test text-center' key={data?._id}>
                      <div className='mb-5'>
                        <svg
                          width='40'
                          height='28'
                          viewBox='0 0 40 28'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M0 0H16V15.5451L9.58392 28H1.60804L7.99196 15.5451H0V0Z'
                            fill='#DA2A2C'
                          />
                          <path
                            d='M24 0H40V15.5451L33.5839 28H25.608L31.992 15.5451H24V0Z'
                            fill='#DA2A2C'
                          />
                        </svg>
                      </div>
                      <p>{data?.description}</p>
                      <div className='userimg-text mt-5'>
                        <Image
                          src={data?.profileImg}
                          className='mx-auto'
                          alt='profile-img'
                          height={100}
                          width={100}
                        />
                      </div>
                      <br />
                      <h5>{data?.name}</h5>
                    </div>
                  );
                })}
              </Slider>
            </div>
          </Container>
        </section>
      ) : (
        ''
      )}
    </>
  );
};

export default HomeTestimonials;
