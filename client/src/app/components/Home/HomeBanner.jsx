'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Col, Container, Row } from 'react-bootstrap';
import Slider from 'react-slick';
import { GET_BANNER_USER_API } from '../../../../services/APIServices';
import ImageComponent from '../../../../utils/ImageComponent';

const HomeBanner = () => {
  const router = useRouter();

  const { data: bannerList } = useQuery({
    queryKey: ['banner-list-home'],
    queryFn: async () => {
      const resp = await GET_BANNER_USER_API();
      return resp?.data?.data ?? [];
    },
  });

  const settings = {
    dots: true,
    infinite: bannerList?.length > 1 ? true : false,
    loop: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <section className='hero p-0 mb-4'>
      <div className='slider-container bannerslide'>
        <Slider {...settings} dots={bannerList?.length > 1 ? true : false}>
          {bannerList?.length !== 0
            ? bannerList?.map((data) => {
                return (
                  <div className='bannersec' key={data?._id}>
                    <div
                      className={'position-absolute right-0 bnnerimg'}
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          data?.productId?.length == 0 &&
                          !data?.companyDetails
                        ) {
                          router.push(`/product-list`);
                        }
                        if (data?.productId?.length > 1) {
                          router.push(
                            `/product-list?companyId=${data?.company}`
                          );
                        } else {
                          if (data?.productId?.length !== 0) {
                            router.push(
                              `/product-detail/${data?.productId?.at(0)?._id}`
                            );
                          } else if (data?.company) {
                            router.push(
                              `/product-list?companyId=${data?.company}`
                            );
                          }
                        }
                      }}
                    >
                      <ImageComponent
                        data={data?.bannerImg}
                        height={100}
                        width={100}
                        alt={'image'}
                      />
                    </div>
                    <Container>
                      <Row className='m-0'>
                        <Col
                          md={6}
                          className='p-0 mx-lg-0 mx-auto text-lg-start text-center d-lg-block d-none'
                        >
                          <h1 className='text-capitalize'>{data?.title}</h1>
                          <p>{data?.description}</p>
                          <Link
                            href='#'
                            onClick={(e) => {
                              e.preventDefault();
                              if (
                                data?.productId?.length == 0 &&
                                !data?.companyDetails
                              ) {
                                router.push(`/product-list`);
                              }
                              if (data?.productId?.length > 1) {
                                router.push(
                                  `/product-list?companyId=${data?.company}`
                                );
                              } else {
                                if (data?.productId?.length !== 0) {
                                  router.push(
                                    `/product-detail/${
                                      data?.productId?.at(0)?._id
                                    }`
                                  );
                                } else if (data?.company) {
                                  router.push(
                                    `/product-list?companyId=${data?.company}`
                                  );
                                }
                              }
                            }}
                            className='btn btn-theme'
                          >
                            Shop Now
                          </Link>
                        </Col>
                      </Row>
                    </Container>
                  </div>
                );
              })
            : ''}
        </Slider>
      </div>
    </section>
  );
};

export default HomeBanner;
