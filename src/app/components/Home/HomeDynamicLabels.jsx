'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Col, Container, Row } from 'react-bootstrap';
import { AiFillHeart } from 'react-icons/ai';
import { CiHeart } from 'react-icons/ci';
import Swal from 'sweetalert2';
import useDetails from '../../../../hooks/useDetails';
import {
  ADD_WISHLIST,
  GET_DYNAMICLABEL,
  GET_USERS_DYNAMICLABEL,
} from '../../../../services/APIServices';

import { toastAlert } from '../../../../utils/SweetAlert';
import { constant } from '../../../../utils/constants';
import { checkLanguage } from '../../../../utils/helper';
import ImageComponent from '../../../../utils/ImageComponent';
import { REDUNDERLINE } from '../SvgIcons';

const HomeDynamicLabels = () => {
  const detail = useDetails();
  const router = useRouter();
  const pathName = usePathname();

  const { data: dynamicLabelling, refetch: dynamicDataRefetch } = useQuery({
    queryKey: ['dynamic-label-list'],
    queryFn: async () => {
      const resp =
        detail?.roleId == constant?.USER
          ? await GET_USERS_DYNAMICLABEL()
          : await GET_DYNAMICLABEL();
      return resp?.data?.data ?? [];
    },
  });

  const wishlistMutation = useMutation({
    mutationFn: (body) => ADD_WISHLIST(body),
    onSuccess: (resp) => {
      toastAlert('success', resp?.data?.message);
      dynamicDataRefetch();
    },
  });

  return (
    <>
      {dynamicLabelling?.length !== 0
        ? dynamicLabelling?.map((data) => {
            return (
              <section className='fetures' key={data._id}>
                <div className='heading-section text-center mb-lg-5 mb-3'>
                  <Container>
                    <Row>
                      <Col md={8} className='mx-auto'>
                        <h3>{checkLanguage(data?.title, data?.arabicTitle)}</h3>
                        <REDUNDERLINE />
                      </Col>
                    </Row>
                  </Container>
                </div>
                <Container>
                  <Row>
                    {data?.company?.length !== 0
                      ? data?.company?.slice(0, 4)?.map((companyData) => {
                          return (
                            <Col
                              lg={3}
                              md={6}
                              className='mb-3'
                              key={companyData._id}
                            >
                              <div className='featurecard electroniccard'>
                                <div
                                  className='imgfeature'
                                  onClick={() => {
                                    router.push(
                                      `/companies/${companyData?._id}`
                                    );
                                  }}
                                >
                                  <ImageComponent
                                    data={companyData?.logo}
                                    height={100}
                                    width={100}
                                    dynamicLabellingState={true}
                                  />
                                </div>
                                <div className='feature-content'>
                                  <div>
                                    <h4>
                                      {checkLanguage(
                                        companyData?.company,
                                        companyData?.arabicCompany
                                      )}
                                    </h4>
                                  </div>

                                  <div className='d-flex justify-content-between'>
                                    <p className=' light-font mb-0'>
                                      {companyData?.isWishlist == true ? (
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
                                                companyId: companyData?._id,
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
                                            if (
                                              detail === null ||
                                              detail === undefined
                                            ) {
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
                                                companyId: companyData?._id,
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
                                      &nbsp; &nbsp;
                                    </p>
                                    {companyData?.totalAverageRating != 0 ? (
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
                                        &nbsp;
                                        {companyData?.totalAverageRating?.toFixed(
                                          1
                                        )}
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
                      : ''}
                  </Row>

                  {data?.company?.length > 4 ? (
                    <div className='text-center mt-5'>
                      <Link
                        href={`/companies?title=${data?.title}`}
                        className='btn btn-theme'
                      >
                        Explore more
                      </Link>
                    </div>
                  ) : (
                    ''
                  )}
                </Container>
              </section>
            );
          })
        : ''}
    </>
  );
};

export default HomeDynamicLabels;
