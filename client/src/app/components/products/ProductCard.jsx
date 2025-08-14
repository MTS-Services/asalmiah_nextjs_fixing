import Link from 'next/link';
import React from 'react';
import { DynamicStar } from 'react-dynamic-star';
import { AiFillHeart } from 'react-icons/ai';
import { CiHeart } from 'react-icons/ci';
import ImageComponent from '../../../../utils/ImageComponent';
import { useMutation } from '@tanstack/react-query';
import { checkLanguage, formatCurrency } from '../../../../utils/helper';
import { ADD_WISHLIST } from '../../../../services/APIServices';
import { toastAlert } from '../../../../utils/SweetAlert';
import Swal from 'sweetalert2';
// import { Router } from 'next/router';
// import { useRouter } from 'next/router';
import { useRouter, usePathname } from 'next/navigation';

const ProductCard = ({ data, selectedCountry, detail, refetch }) => {
  const router = useRouter();
  const pathName = usePathname();
  console.log('card-item: ', data);

  const wishlistMutation = useMutation({
    mutationFn: (body) => ADD_WISHLIST(body),
    onSuccess: (resp) => {
      toastAlert('success', resp?.data?.message);
      refetch();
    },
  });

  return (
    <div className='product-box-3 product-new'>
      <div className='img-wrapper position-relative'>
        <div className='product-image'>
          <Link
            className='pro-first bg-size'
            href={`/product-detail/${data?._id}`}
          >
            {/* Product Image or Video */}
            {data?.productImg?.length > 0 && data?.productImg[0]?.url ? (
              data?.productImg[0]?.type?.includes('image') ? (
                <ImageComponent
                  className='bg-img w-100'
                  data={data.productImg[0].url}
                  alt={data?.productName || 'Product Image'}
                />
              ) : (
                <video
                  width='100%'
                  height='100%'
                  src={data.productImg[0].url}
                  autoPlay
                  loop
                  muted
                />
              )
            ) : (
              <ImageComponent
                className='bg-img w-100'
                data='/placeholder.png'
                alt='No product image'
              />
            )}

            {/* Company Logo + Name Overlay - Bottom Left */}
            {data?.companyDetails?.logo && (
              <div
                className='position-absolute d-flex align-items-center'
                style={{
                  bottom: '10px',
                  left: '10px',
                  gap: '6px',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  color: 'white',
                  borderRadius: '30px',
                  padding: '6px 6px',
                  zIndex: 1,
                  fontSize: '12px',
                  fontWeight: '500',
                }}
              >
                {/* Circular Logo */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '1px solid #fff',
                  }}
                >
                  <ImageComponent
                    data={data.companyDetails.logo}
                    alt={checkLanguage(
                      data.companyDetails.company,
                      data.companyDetails.arabicCompany
                    )}
                    width={28}
                    height={28}
                    className='w-100 h-100'
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                {/* Company Name */}
                <span className='d-none d-sm-inline'>
                  {checkLanguage(
                    data.companyDetails.company,
                    data.companyDetails.arabicCompany
                  )}
                </span>
              </div>
            )}
          </Link>
        </div>
        <div className='onhover-show'>
          <div className=' d-flex align-items-center justify-content-between'>
            <div className='product-detail'>
              <span>
                <p>
                  {' '}
                  {data?.discount !== null ? (
                    <span>{data?.discount?.toFixed(1)}% off</span>
                  ) : (
                    ''
                  )}
                  {data?.size?.at(0)?.discount !== null &&
                  data?.size?.length !== 0 ? (
                    <span>{data?.size?.at(0)?.discount?.toFixed(1)}% off</span>
                  ) : (
                    ''
                  )}
                </p>
              </span>
            </div>

            <ul>
              <li>
                {data?.isWishlist == true ? (
                  <Link
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();

                      if (detail === null || detail === undefined) {
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
                              `/login?pathname=${encodeURIComponent(pathName)}`
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
                      if (detail === null || detail === undefined) {
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
                              `/login?pathname=${encodeURIComponent(pathName)}`
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
      </div>
      <div className='product-detail text-center mt-4'>
        <ul className='rating'>
          <li>
            <div className=''>
              <DynamicStar
                rating={data?.averageRating?.averageRating}
                height={15}
                width={15}
                outlined
              />
            </div>
          </li>
        </ul>
        <Link href='#' className='text-capitalize'>
          <h6>{checkLanguage(data?.productName, data?.productArabicName)}</h6>
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
            data?.size?.at(0)?.price ? data?.size?.at(0)?.price : data?.price,
            selectedCountry
          )}

          {data?.size?.at(0)?.discount ? (
            <del className='notranslate'>
              {formatCurrency(data?.size?.at(0)?.mrp, selectedCountry)}
            </del>
          ) : data?.discount ? (
            <del className='notranslate'>
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
  );
};

export default ProductCard;
