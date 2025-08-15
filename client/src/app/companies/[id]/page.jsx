'use client';

// import Breadcrums from "@/app/components/Breadcrums";
import { Pagination } from '@/app/components/Pagination';
import NoDataFound from '@/app/components/no-data-found/page';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Nav, TabContent } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { AiFillHeart } from 'react-icons/ai';
import { CiHeart } from 'react-icons/ci';
import { FaWalking } from 'react-icons/fa';
import { RiCouponLine } from 'react-icons/ri';
import { TbTruckDelivery } from 'react-icons/tb';
import { ShimmerPostItem, ShimmerThumbnail } from 'react-shimmer-effects';
import Swal from 'sweetalert2';
import useCountryState from '../../../../hooks/useCountryState';
import useDetails from '../../../../hooks/useDetails';
import {
  ADD_WISHLIST,
  GET_BEST_SELLER_DETAIL,
  GET_CLASSIFICATION_PRODUCTLIST,
  GET_CLASSIFICATION_PRODUCTLIST_AUTH,
  GET_USERS_CLASSIFICATION_API,
  USER_GET_BEST_SELLER_DETAIL,
} from '../../../../services/APIServices';
import '../../../../styles/globals.scss';
import Footer from '../../../../utils/Footer';
import Header from '../../../../utils/Header';
import ImageComponent from '../../../../utils/ImageComponent';
import { toastAlert } from '../../../../utils/SweetAlert';
import UserLogInHeader from '../../../../utils/UserLogInHeader';
import { constant, Paginations } from '../../../../utils/constants';
import {
  checkLanguage,
  FORMAT_NUMBER,
  formatCurrency,
} from '../../../../utils/helper';
import { trans } from '../../../../utils/trans';
import '../page.scss';
export default function page() {
  let detail = useDetails();
  const selectedCountry = useCountryState();
  let router = useRouter();
  let { id } = useParams();
  const [meta, setMeta] = useState('');
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);

  const {
    data: companyDetailData,
    refetch,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: ['company-detail-data', { id }],
    queryFn: async () => {
      const res =
        detail?.roleId == constant?.USER
          ? await USER_GET_BEST_SELLER_DETAIL(id)
          : await GET_BEST_SELLER_DETAIL(id);
      return res?.data?.data ?? '';
    },
  });
  const [type, setType] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const { data: classificationList } = useQuery({
    queryKey: ['classification-detail-data', { id }],
    queryFn: async () => {
      const res = await GET_USERS_CLASSIFICATION_API(id);
      setActiveTab(res?.data?.data?.at(0)?._id);
      return res?.data?.data ?? '';
    },
  });

  const {
    data: classificationProductList,
    refetch: classificationRefetch,
    isPending: isPendingCompanies,
  } = useQuery({
    queryKey: ['classification-product-data', activeTab, page],
    queryFn: async () => {
      const res = activeTab
        ? detail?.roleId == constant?.USER
          ? await GET_CLASSIFICATION_PRODUCTLIST_AUTH(activeTab, id, page)
          : await GET_CLASSIFICATION_PRODUCTLIST(activeTab, id, page)
        : '';
      setMeta(res?.data?._meta);
      return res?.data?.data ?? '';
    },
  });

  const wishlistMutation = useMutation({
    mutationFn: (body) => ADD_WISHLIST(body),
    onSuccess: (resp) => {
      toastAlert('success', resp?.data?.message);
      classificationRefetch();
    },
  });
  let language = localStorage.getItem('language');
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
      {companyDetailData?.length !== 0 ? (
        <>
          {/* <Breadcrums
            firstLink={Home}
            secondLink={"Company Detail"}
            language={language}
          /> */}
          <section className='seller-view p-0'>
            <Container>
              <div className='my-profile-inner-box'>
                <div className='profile-cover-image'>
                  <Link href='#'>
                    {isPending ? (
                      <ShimmerThumbnail height={250} rounded />
                    ) : (
                      <ImageComponent
                        data={companyDetailData?.coverImg}
                        shimmerHeight={250}
                        dynamicLabellingState={true}
                      />
                    )}
                  </Link>
                </div>
                <div className='profile-info-box'>
                  <div className='inner-info-box d-flex justify-content-between align-items-center'>
                    <div className='profile-image d-flex align-items-center'>
                      <div className='info-image'>
                        {isPending ? (
                          <ShimmerThumbnail height={200} rounded />
                        ) : (
                          <ImageComponent
                            data={companyDetailData?.logo}
                            dynamicLabellingState={true}
                            shimmerHeight={200}
                          />
                        )}
                      </div>

                      <div className='info-text ms-3'>
                        <h3>
                          <Link href='#'>{companyDetailData?.company}</Link>
                        </h3>
                      </div>
                    </div>
                    <div className='comapny-right-icon'>
                      {companyDetailData?.couponService == true ? (
                        <RiCouponLine title='Coupon Service' />
                      ) : (
                        ''
                      )}

                      {companyDetailData?.pickupService == true ? (
                        <FaWalking title='Pickup Service' />
                      ) : (
                        ''
                      )}

                      {companyDetailData?.deliveryEligible == true ? (
                        <TbTruckDelivery title='Self Delivery' />
                      ) : (
                        ''
                      )}

                      {companyDetailData?.deliveryService == true ? (
                        <TbTruckDelivery title='Delivery Service' />
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className='dashboard_content mt-5'>
                <div className='inner_card'>
                  <Row>
                    <Col lg={6}>
                      <small className='text-muted'>Category</small>
                      <p>{companyDetailData?.categoryDetails?.category} </p>
                      <hr />
                    </Col>
                    <Col lg={6}>
                      <small className='text-muted'>
                        Delivery Cost ({formatCurrency('', selectedCountry)})
                      </small>
                      <p>{companyDetailData?.costDelivery ?? '-'} </p>
                      <hr />
                    </Col>

                    <Col lg={12}>
                      <small className='text-muted'>Description</small>
                      <p>{companyDetailData?.description}</p>
                      <hr />
                    </Col>
                  </Row>
                </div>
              </div>

              <Nav variant='tabs grid-tabs mt-4 mb-3'>
                {classificationList?.map((tab, index) => (
                  <Nav.Item key={index}>
                    <Nav.Link
                      eventKey={tab?._id}
                      onClick={() => {
                        setActiveTab(tab?._id);
                        setPage(1);
                      }}
                      active={activeTab === tab?._id}
                    >
                      {tab?.classification?.name}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>

              <TabContent activeKey={activeTab}>
                <Row>
                  {isPendingCompanies ? (
                    Array.from({ length: 4 }, (_, index) => (
                      <Col lg={3} className='mb-4 pb-5' key={index}>
                        <ShimmerPostItem
                          variant='secondary'
                          imageHeight={357}
                        />
                      </Col>
                    ))
                  ) : classificationProductList?.length !== 0 ? (
                    classificationProductList?.map((data, index) => {
                      return (
                        <Col lg={3} key={data?._id} className='mb-4'>
                          {' '}
                          <div className='product-box-3  product-new'>
                            <div className='img-wrapper position-relative'>
                              <div className='product-image'>
                                <Link
                                  className='pro-first bg-size'
                                  href={`/product-detail/${data?._id}`}
                                >
                                  {data?.productImg[0]?.type ? (
                                    data?.productImg[0]?.type?.includes(
                                      'image'
                                    ) ? (
                                      <ImageComponent
                                        className={'bg-img w-100'}
                                        data={data?.productImg[0]?.url}
                                        width={300}
                                        height={400}
                                        alt={'image'}
                                      />
                                    ) : (
                                      <video
                                        width='100%'
                                        height='100%'
                                        src={data?.productImg[0]?.url}
                                      />
                                    )
                                  ) : (
                                    <ImageComponent
                                      className={'bg-img w-100'}
                                      data={data?.productImg[0]?.url}
                                      width={300}
                                      height={400}
                                      alt={'image'}
                                    />
                                  )}
                                </Link>
                              </div>
                              <div className='onhover-show'>
                                <ul>
                                  <li>
                                    {data?.isWishlist == true ? (
                                      <Link
                                        href='#'
                                        onClick={(e) => {
                                          e.preventDefault();

                                          if (
                                            detail === null ||
                                            detail === undefined
                                          ) {
                                            Swal.fire({
                                              title:
                                                'You need to login to add the product in wishlist',
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
                                              productId: data?._id,

                                              type: '1',
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
                                          if (
                                            detail === null ||
                                            detail === undefined
                                          ) {
                                            Swal.fire({
                                              title:
                                                'You need to login to add the product in wishlist',
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
                                              productId: data?._id,
                                              type: '1',
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
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className='product-detail text-center mt-4'>
                              <Link href='#'>
                                <h6>
                                  {checkLanguage(
                                    data?.productName,
                                    data?.productArabicName
                                  )}
                                </h6>
                              </Link>
                              <Link href='#'>
                                <h6>
                                  {data?.quantity == 0 ? (
                                    <p className='text-danger'>Out of stock</p>
                                  ) : (
                                    ''
                                  )}
                                </h6>
                              </Link>
                              <p className='notranslate'>
                                {formatCurrency(
                                  data?.size?.at(0)?.price
                                    ? data?.size?.at(0)?.price
                                    : data?.price,
                                  selectedCountry
                                )}
                                {data?.size?.at(0)?.discount ? (
                                  <del>
                                    {formatCurrency(
                                      data?.size?.at(0)?.mrp,
                                      selectedCountry
                                    )}
                                  </del>
                                ) : data?.discount ? (
                                  <del>
                                    {' '}
                                    {formatCurrency(
                                      data?.size?.at(0)?.mrp
                                        ? data?.size?.at(0)?.mrp
                                        : data?.mrpPrice,
                                      selectedCountry
                                    )}
                                  </del>
                                ) : (
                                  ''
                                )}
                                {data?.discount !== null ? (
                                  <span>
                                    {FORMAT_NUMBER(data?.discount, true)}% off
                                  </span>
                                ) : (
                                  ''
                                )}
                                {data?.size?.at(0)?.discount !== null &&
                                data?.size?.length !== 0 ? (
                                  <span>
                                    {FORMAT_NUMBER(
                                      data?.size?.at(0)?.discount,
                                      true
                                    )}
                                    % off
                                  </span>
                                ) : (
                                  ''
                                )}
                              </p>
                              <div className='listing-button text-center'>
                                <Link
                                  href={`/product-detail/${data?._id}`}
                                  className='btn btn-theme text-capitalize'
                                  title='View Product'
                                >
                                  View Product
                                </Link>
                              </div>
                            </div>
                          </div>
                        </Col>
                      );
                    })
                  ) : (
                    <Col lg={12}>
                      <NoDataFound />
                    </Col>
                  )}
                  {!isPendingCompanies
                    ? Math.ceil(meta?.totalCount / 10) > 1 && (
                        <Pagination
                          pageCount={'YES'}
                          totalCount={meta?.totalCount}
                          handelPageChange={(e) => setPage(e.selected + 1)}
                          page={page}
                        />
                      )
                    : ''}
                </Row>
              </TabContent>
            </Container>
          </section>
        </>
      ) : (
        <Container className='d-flex justify-content-center align-items-center company-list-card'>
          <Row>
            <Col className='text-center'>
              <h4>Company details not found</h4>
              <button
                className='btn btn-theme m-2'
                onClick={() => router.push('/')}
              >
                Go Back to Home
              </button>
            </Col>
          </Row>
        </Container>
      )}
      <Footer />
    </>
  );
}
