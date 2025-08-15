'use client';

// import Breadcrums from '@/app/components/Breadcrums';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AiFillHeart } from 'react-icons/ai';
import { CiHeart } from 'react-icons/ci';
import Swal from 'sweetalert2';
import useDetails from '../../../hooks/useDetails';
import {
  ADD_WISHLIST,
  ALL_COMPANIES_LIST,
  GET_ALL_DYNAMICLABEL,
  GET_COMPANIES_LIST,
  GET_COUPON_COMPANY_HOME,
  GET_ELECTRONICS_COMPANY_HOME,
  GET_ELECTRONICS_USERS_COMPANY_HOME,
  GET_PRODUCTLIST_OFFERED,
  GET_PRODUCTLIST_OFFERED_AUTH,
  GET_TODAY_OFFERS_COMPANY_HOME,
  GET_USERS_ALL_DYNAMICLABEL,
  GET_USERS_COUPON_COMPANY_HOME,
  GET_USERS_TODAY_OFFERS_COMPANY_HOME,
} from '../../../services/APIServices';
import Footer from '../../../utils/Footer';
import Header from '../../../utils/Header';
import ImageComponent from '../../../utils/ImageComponent';
import { toastAlert } from '../../../utils/SweetAlert';
import UserLogInHeader from '../../../utils/UserLogInHeader';
import { constant, Paginations } from '../../../utils/constants';
import { trans } from '../../../utils/trans';
import { Pagination } from '../components/Pagination';
import { Col, Container, Row } from 'react-bootstrap';
import { ShimmerPostItem } from 'react-shimmer-effects';

export default function page() {
  let detail = useDetails();
  let pathName = usePathname();
  const [meta, setMeta] = useState('');
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const searchParams = useSearchParams();
  const discountParams = searchParams?.get('discount');
  const titleParams = searchParams?.get('title');
  const couponParams = searchParams?.get('coupon');
  const searchCompany = searchParams?.get('search');
  const electronics = searchParams?.get('electronics');
  const popular = searchParams?.get('popular');

  const {
    data: companiesDataList,
    refetch,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: ['companies-data', page, searchCompany],
    queryFn: async () => {
      let resp;
      if (discountParams) {
        resp =
          detail?.roleId == constant?.USER
            ? await GET_PRODUCTLIST_OFFERED_AUTH()
            : await GET_PRODUCTLIST_OFFERED();
      } else if (couponParams) {
        resp =
          detail?.roleId == constant?.USER
            ? await GET_USERS_COUPON_COMPANY_HOME()
            : await GET_COUPON_COMPANY_HOME();
      } else if (electronics) {
        resp =
          detail?.roleId == constant?.USER
            ? await GET_ELECTRONICS_USERS_COMPANY_HOME('Electric')
            : await GET_ELECTRONICS_COMPANY_HOME('Electric');
      } else if (popular) {
        resp =
          detail?.roleId == constant?.USER
            ? await GET_USERS_TODAY_OFFERS_COMPANY_HOME()
            : await GET_TODAY_OFFERS_COMPANY_HOME();
      } else if (titleParams) {
        resp =
          detail?.roleId == constant?.USER
            ? await GET_USERS_ALL_DYNAMICLABEL(titleParams)
            : await GET_ALL_DYNAMICLABEL(titleParams);
      } else {
        resp = detail
          ? await GET_COMPANIES_LIST(searchCompany, page)
          : await ALL_COMPANIES_LIST(searchCompany, page);
      }

      setMeta(resp?.data?._meta);
      if (titleParams) {
        return resp?.data?.data?.company;
      } else {
        return resp?.data?.data ?? [];
      }
    },
  });

  console.log('line-101: page-companies: companiesDataList', companiesDataList);

  const wishlistMutation = useMutation({
    mutationFn: (body) => ADD_WISHLIST(body),
    onSuccess: (resp) => {
      toastAlert('success', resp?.data?.message);
      // if (resp?.data?.data?.isWishlist == true) {
      //   router.push("/wishlist");
      // }

      refetch();
    },
  });

  let router = useRouter();
  let language = localStorage.getItem('language');
  const languageCode = language && language.startsWith('Arabic') ? 'ar' : 'en';
  const Home = trans('home');
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);
  return (
    <>
      {detail?.roleId == constant?.USER ? (
        <UserLogInHeader refetchAPI={refetch} />
      ) : (
        <Header refetchAPI={refetch} />
      )}{' '}
      {/* <Breadcrums
        firstLink={Home}
        secondLink={'Companies'}
        language={language}
      /> */}
      <section className='bst-seller-sec mt-2 company-list-card '>
        <Container>
          <Row>
            {isPending ? (
              Array.from({ length: 4 }, (_, index) => (
                <Col lg={3} md={6} className='mb-3' key={index}>
                  <ShimmerPostItem
                    title
                    variant='secondary'
                    imageHeight={200}
                  />{' '}
                </Col>
              ))
            ) : companiesDataList?.length !== 0 ? (
              companiesDataList?.map((data) => {
                return (
                  <Col lg={3} md={6} className='mb-3' key={data?._id}>
                    <div className='featurecard p-0'>
                      <div
                        className='imgfeature companymaincard'
                        onClick={() => router.push(`/companies/${data?._id}`)}
                      >
                        <ImageComponent
                          className='w-100'
                          data={data?.logo}
                          alt='company-img'
                          height={100}
                          width={100}
                          dynamicLabellingState={true}
                        />
                      </div>
                      <div className='feature-content pb-0  p-3 '>
                        <div className='d-flex justify-content-between'>
                          {/* <h4>{data?.company}</h4> */}
                          <h4>
                            {languageCode == 'ar'
                              ? data?.arabicCompany
                              : data?.company}
                          </h4>
                        </div>
                        <div className='d-flex justify-content-between'>
                          <p className=' light-font mb-0'>
                            {data?.isWishlist == true ? (
                              <Link
                                href='#'
                                onClick={(e) => {
                                  e.preventDefault();

                                  if (detail === null || detail === undefined) {
                                    Swal.fire({
                                      title:
                                        'You need to login to add the company in wishlist',
                                      icon: 'warning',
                                      showCancelButton: true,
                                      confirmButtonColor: '#3085d6',
                                      cancelButtonColor: '#d33',
                                      confirmButtonText: 'Yes',
                                      cancelButtonText: 'Cancel',
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                        router.push(
                                          `/login?pathname=${encodeURIComponent(
                                            pathName
                                          )}`
                                        );
                                      }
                                    });
                                  } else {
                                    let body = {
                                      companyId: data?._id,
                                      type: '2',
                                      isWishlist: false,
                                      web: true,
                                    };
                                    wishlistMutation?.mutate(body);
                                  }
                                }}
                              >
                                <AiFillHeart />
                              </Link>
                            ) : (
                              <Link
                                href='#'
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (detail === null || detail === undefined) {
                                    Swal.fire({
                                      title:
                                        'You need to login to add the company in wishlist',
                                      icon: 'warning',
                                      showCancelButton: true,
                                      confirmButtonColor: '#3085d6',
                                      cancelButtonColor: '#d33',
                                      confirmButtonText: 'Yes',
                                      cancelButtonText: 'Cancel',
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                        router.push(
                                          `/login?pathname=${encodeURIComponent(
                                            pathName
                                          )}`
                                        );
                                      }
                                    });
                                  } else {
                                    let body = {
                                      companyId: data?._id,
                                      type: '2',
                                      isWishlist: true,
                                      web: true,
                                    };
                                    wishlistMutation?.mutate(body);
                                  }
                                }}
                              >
                                <CiHeart />
                              </Link>
                            )}
                            &nbsp;
                          </p>
                          {data?.totalAverageRating != 0 ? (
                            <p className='mb-0'>
                              <svg
                                width='25'
                                height='25'
                                viewBox='0 0 25 25'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <circle
                                  cx='12.5'
                                  cy='12.5'
                                  r='12.5'
                                  fill='#DA2A2C'
                                />
                                <path
                                  d='M12.1619 5.40527L13.8306 10.541H19.2306L14.8619 13.715L16.5306 18.8507L12.1619 15.6766L7.79325 18.8507L9.46194 13.715L5.09326 10.541H10.4932L12.1619 5.40527Z'
                                  fill='white'
                                />
                              </svg>
                              &nbsp;{data?.totalAverageRating?.toFixed(1)}{' '}
                            </p>
                          ) : (
                            ''
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              })
            ) : (
              <div className='no-data-found-style'>
                <h3 className='text-center'>No Data Found</h3>
              </div>
            )}
          </Row>
          <div className='mb-4'>
            {!isPending && Math.ceil(meta?.totalCount / 12) > 1 && (
              <Pagination
                pageCount={'YES'}
                totalCount={meta?.totalCount}
                handelPageChange={(e) => setPage(e.selected + 1)}
                page={page}
              />
            )}
          </div>
        </Container>
      </section>
      <Footer />
    </>
  );
}
