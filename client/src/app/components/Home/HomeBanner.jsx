'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Col, Container, Row } from 'react-bootstrap';
import Slider from 'react-slick';
import ImageComponent from '../../../../utils/ImageComponent';
import { GET_BANNER_USER_API } from '../../../../services/APIServices';

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
    dots: false,
    infinite: bannerList?.length > 1 ? true : false,
    loop: true,
    autoplay: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <section className='p-0'>
      <div className='slider-container bannerslide'>
        <Slider {...settings} dots={bannerList?.length > 1}>
          {bannerList?.map((data) => (
            <div className='bannersec' key={data?._id}>
              <div
                className='position-relative w-100 h-100 bnnerimg'
                onClick={(e) => {
                  e.preventDefault();
                  if (data?.productId?.length === 0 && !data?.companyDetails) {
                    router.push(`/product-list`);
                  } else if (data?.productId?.length > 1) {
                    router.push(`/product-list?companyId=${data?.company}`);
                  } else if (data?.productId?.length === 1) {
                    router.push(`/product-detail/${data?.productId[0]?._id}`);
                  } else if (data?.company) {
                    router.push(`/product-list?companyId=${data?.company}`);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <ImageComponent
                  data={data?.bannerImg}
                  height={500} // Adjust as needed
                  width={1000} // Adjust based on your layout
                  alt={data?.title || 'Banner image'}
                  className='w-100 h-auto'
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default HomeBanner;
