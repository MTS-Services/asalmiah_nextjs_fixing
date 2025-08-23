'use client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Col, Container, Row, Table } from 'react-bootstrap';
import { FaMinus } from 'react-icons/fa6';
import { TiPlus } from 'react-icons/ti';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import useCartSlice from '../../../../hooks/useCartSlice';
import useDetails from '../../../../hooks/useDetails';
import {
  addToCart,
  clearCart,
  removeFromCart,
} from '../../../../redux/features/cartSlice';

import {
  DECREMENT_CART_QUANTITY,
  DECREMENT_CART_QUANTITY_WITHOUT_LOGIN,
  DELETE_ALLCART_ITEMS,
  DELETE_ALLCART_ITEMS_WITHOUT_LOGIN,
  DELETE_CART_ITEM,
  DELETE_CART_ITEM_WITHOUT_LOGIN,
  INCREMENT_CART_QUANTITY,
  INCREMENT_CART_QUANTITY_WITHOUT_LOGIN,
  PROMOCODE_USER_CART,
  PROMOCODE_USER_CART_WITHOUT_LOGIN,
  USER_CART,
  USER_CART_WITHOUT_LOGIN,
} from '../../../../services/APIServices';
import { constant, Paginations } from '../../../../utils/constants';
import Footer from '../../../../utils/Footer';
import Header from '../../../../utils/Header';
import {
  checkLanguage,
  formatCurrency,
  getDeviceToken,
} from '../../../../utils/helper';
import { toastAlert } from '../../../../utils/SweetAlert';
import UserLogInHeader from '../../../../utils/UserLogInHeader';
import Breadcrums from '../../components/Breadcrums';
import CartPriceDetails from '../../components/CartPriceDetails.jsx';
import NoDataFound from '../../components/no-data-found/page';
import { Pagination } from '../../components/Pagination';
import './page.scss';
import { trans } from '../../../../utils/trans';
import useCountryState from '../../../../hooks/useCountryState';
import { ShimmerTable } from 'react-shimmer-effects';
const Cart = () => {
  let detail = useDetails();
  let cart = useCartSlice();
  let queryClient = useQueryClient();
  let router = useRouter();
  let dispatch = useDispatch();
  const selectedCountry = useCountryState();
  const [meta, setMeta] = useState('');
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);

  const updateCartHandler = async (type, item, quantity) => {
    const body = {
      quantity: quantity,
      web: true,
    };

    try {
      const response =
        type == 'increment'
          ? detail == null || detail == undefined
            ? await INCREMENT_CART_QUANTITY_WITHOUT_LOGIN(item?._id, body)
            : await INCREMENT_CART_QUANTITY(item?._id, body)
          : detail == null || detail == undefined
          ? await DECREMENT_CART_QUANTITY_WITHOUT_LOGIN(item?._id, body)
          : await DECREMENT_CART_QUANTITY(item?._id, body);
      queryClient.invalidateQueries({ queryKey: ['cart-list-user'] });
      if (response?.status === 200) {
        if (quantity == 0) {
          try {
            const response =
              detail == null || detail == undefined
                ? await DELETE_CART_ITEM_WITHOUT_LOGIN(
                    item?._id,
                    getDeviceToken()
                  )
                : await DELETE_CART_ITEM(item?._id);
            if (response?.status === 200) {
              Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: response?.data?.message,
                showConfirmButton: false,
                timer: 3000,
              });
              dispatch(removeFromCart(item));
              localStorage.removeItem('promocode');
              queryClient.invalidateQueries({ queryKey: ['cart-list-user'] });
            }
          } catch (error) {
            console.error(error);
          }
        } else {
          cart?.filter((data) => {
            if (data?._id === item?._id) {
              Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Product updated successfully!',
                showConfirmButton: false,
                timer: 3000,
              });
              queryClient.invalidateQueries({ queryKey: ['cart-list-user'] });
              return dispatch(addToCart({ ...item, quantity }));
            }
          });
        }
      }
    } catch (error) {
      toastAlert('error', error?.response?.data?.message);
    }
  };
  const removeItemFromCart = async (item) => {
    try {
      const response =
        detail == null || detail == undefined
          ? await DELETE_CART_ITEM_WITHOUT_LOGIN(item?._id, getDeviceToken())
          : await DELETE_CART_ITEM(item?._id);
      if (response?.status === 200) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: response?.data?.message,
          showConfirmButton: false,
          timer: 3000,
        });
        dispatch(removeFromCart(item));
        localStorage.removeItem('promocode');

        queryClient.invalidateQueries({ queryKey: ['cart-list-user'] });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeAllItemFromCart = async () => {
    try {
      const response =
        detail == null || detail == undefined
          ? await DELETE_ALLCART_ITEMS_WITHOUT_LOGIN(getDeviceToken())
          : await DELETE_ALLCART_ITEMS();
      if (response?.status === 200) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: response?.data?.message,
          showConfirmButton: false,
          timer: 3000,
        });
        dispatch(clearCart(null));
        localStorage.removeItem('persist:cart');
        localStorage.removeItem('promocode');

        Cookies.remove('cartItems');
        localStorage.removeItem('promocode');

        router.push(`/product-list`);
        queryClient.invalidateQueries({ queryKey: ['cart-list-user'] });
      }
    } catch (error) {
      console.error(error);
    }
  };
  let promoCode = localStorage.getItem('promocode');
  let orderType = localStorage.getItem('keyId');
  const {
    data: cartListing,
    refetch,
    isPending,
  } = useQuery({
    queryKey: ['cart-list-user', promoCode, orderType, page],
    queryFn: async () => {
      const resp =
        !cartCoupon && promoCode
          ? detail == null || detail == undefined
            ? await PROMOCODE_USER_CART_WITHOUT_LOGIN(
                promoCode,
                orderType ?? '',
                page,
                getDeviceToken()
              )
            : await PROMOCODE_USER_CART(promoCode, orderType ?? '', page)
          : detail == null || detail == undefined
          ? await USER_CART_WITHOUT_LOGIN(
              orderType ?? '',
              page,
              getDeviceToken()
            )
          : await USER_CART(orderType ?? '', page);
      setMeta(resp?.data?._meta);
      if (resp?.data?.data?.cartList?.at(0)?.userDetails?.walletDetails) {
        localStorage.setItem(
          'walletAmount',
          resp?.data?.data?.cartList?.at(0)?.userDetails?.walletDetails?.amount
        );
      }
      localStorage.removeItem('walletUse');
      return resp?.data?.data ?? [];
    },
  });

  useEffect(() => {
    if (cartListing?.cartCount == 0) {
      dispatch(clearCart(null));
      localStorage.removeItem('persist:cart');
      Cookies.remove('cartItems');
    }
  }, []);

  const [cartCoupon, setCartCoupon] = useState(false);

  let language = localStorage.getItem('language');
  const Home = trans('home');

  return (
    <>
      {detail?.roleId == constant?.USER ? (
        <UserLogInHeader refetchAPI={refetch} />
      ) : (
        <Header refetchAPI={refetch} />
      )}
      {/* <Breadcrums firstLink={Home} secondLink={'Cart'} language={language} /> */}

      <section className='cart-main'>
        <Container>
          {cartListing?.cartCount !== 0 ? (
            <Row>
              <Col lg={9}>
                <div className='cart-table'>
                  <div className='table-title d-flex align-items-center justify-content-between mb-4'>
                    {cartListing?.cartCount > 0 ? (
                      <>
                        <h5 className='fw-bold'>
                          Cart<span>({cartListing?.cartCount})</span>
                        </h5>

                        <Link
                          href='#'
                          className='text-orange'
                          onClick={(e) => {
                            e.preventDefault();
                            localStorage.removeItem('promoCode');
                            removeAllItemFromCart();

                            setCartCoupon(true);
                          }}
                        >
                          Clear All
                        </Link>
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                  <div className='table-responsive theme-scrollbar'>
                    {isPending ? (
                      <ShimmerTable row={2} col={5} />
                    ) : (
                      <Table className='border-0'>
                        <thead>
                          <tr>
                            <th>Product </th>
                            <th>Price </th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartListing?.cartList?.map((data) => {
                            return (
                              <tr key={data?._id}>
                                <td>
                                  <div className='cart-box d-flex align-items-center gap-3 flex-wrap'>
                                    <Link
                                      href={`/product-detail/${data?.productDetails?._id}`}
                                    >
                                      {data?.productDetails?.productImg
                                        ?.length !== 0
                                        ? data?.productDetails?.productImg
                                            ?.slice(0, 1)
                                            ?.map((data) => {
                                              return data?.type ? (
                                                data?.type?.includes(
                                                  'image'
                                                ) ? (
                                                  <Image
                                                    src={data?.url}
                                                    alt='image-product'
                                                    width={100}
                                                    height={100}
                                                  />
                                                ) : (
                                                  <video
                                                    src={data?.url}
                                                    width={100}
                                                    height={100}
                                                  />
                                                )
                                              ) : (
                                                <Image
                                                  src={data?.url}
                                                  alt='image-product'
                                                  width={100}
                                                  height={100}
                                                />
                                              );
                                            })
                                        : ''}
                                    </Link>
                                    <div>
                                      <Link
                                        href={`/product-detail/${data?.productDetails?._id}`}
                                      >
                                        <h5 className='text-black fw-bold'>
                                          {checkLanguage(
                                            data?.productDetails?.productName,
                                            data?.productDetails
                                              ?.productArabicName
                                          )}
                                        </h5>
                                      </Link>

                                      <Link
                                        href={`/companies/${data?.productDetails?.companyDetails?._id}`}
                                        target='_blank'
                                      >
                                        <h5 className='text-red'>
                                          {checkLanguage(
                                            data?.productDetails?.companyDetails
                                              ?.company,
                                            data?.productDetails?.companyDetails
                                              ?.arabicCompany
                                          )}
                                        </h5>
                                      </Link>

                                      {data?.productDetails?.quantity == 0 ? (
                                        <p className='mb-0 text-danger'>
                                          Out of stock
                                        </p>
                                      ) : (
                                        ''
                                      )}
                                      {data?.size ? (
                                        <p className='mb-0'>
                                          Size : <span>{data?.size}</span>
                                        </p>
                                      ) : (
                                        ''
                                      )}
                                      {data?.color ? (
                                        <span
                                          style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            backgroundColor: data?.color,
                                            display: 'inline-block',
                                          }}
                                        ></span>
                                      ) : (
                                        ''
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className='notranslate'>
                                  {formatCurrency(
                                    data?.productPrice,
                                    selectedCountry
                                  )}
                                </td>
                                <td>
                                  <div className='quantity d-flex align-items-center gap-3'>
                                    <button
                                      className='minus'
                                      type='button'
                                      onClick={(e) => {
                                        e.preventDefault();
                                        updateCartHandler(
                                          'decrement',
                                          data,
                                          data?.quantity - 1
                                        );
                                      }}
                                      disabled={data?.quantity == 1}
                                    >
                                      <FaMinus />
                                    </button>
                                    <input
                                      type='number'
                                      min='1'
                                      max='20'
                                      maxLength={5}
                                      value={data?.quantity}
                                      onChange={(e) => {
                                        updateCartHandler(
                                          data?.quantity > +e.target.value
                                            ? 'increment'
                                            : 'decrement',
                                          data,
                                          +e.target.value
                                        );
                                      }}
                                      disabled={data?.quantity <= 10}
                                    />

                                    <button
                                      className='plus'
                                      type='button'
                                      onClick={(e) => {
                                        e.preventDefault();
                                        updateCartHandler(
                                          'increment',
                                          data,
                                          data?.quantity + 1
                                        );
                                      }}
                                    >
                                      <TiPlus />
                                    </button>
                                  </div>
                                </td>

                                <td className='notranslate'>
                                  {/* KD */}

                                  {formatCurrency(
                                    data?.productPrice *
                                      data?.quantity?.toFixed(2),
                                    selectedCountry
                                  )}
                                </td>
                                <td>
                                  <Link
                                    className='deleteButton'
                                    href='#'
                                    onClick={(e) => {
                                      e.preventDefault();
                                      removeItemFromCart(data);
                                      setCartCoupon(true);
                                      localStorage.removeItem('promocode');
                                    }}
                                  >
                                    <svg
                                      width='24'
                                      height='24'
                                      viewBox='0 0 24 24'
                                      fill='none'
                                      xmlns='http://www.w3.org/2000/svg'
                                    >
                                      <path
                                        d='M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998'
                                        stroke='#292D32'
                                        stroke-width='1.5'
                                        stroke-linecap='round'
                                        stroke-linejoin='round'
                                      ></path>
                                      <path
                                        d='M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97'
                                        stroke='#292D32'
                                        stroke-width='1.5'
                                        stroke-linecap='round'
                                        stroke-linejoin='round'
                                      ></path>
                                      <path
                                        d='M18.85 9.14001L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79002C6.00002 22 5.91002 20.78 5.80002 19.21L5.15002 9.14001'
                                        stroke='#292D32'
                                        stroke-width='1.5'
                                        stroke-linecap='round'
                                        stroke-linejoin='round'
                                      ></path>
                                      <path
                                        d='M10.33 16.5H13.66'
                                        stroke='#292D32'
                                        stroke-width='1.5'
                                        stroke-linecap='round'
                                        stroke-linejoin='round'
                                      ></path>
                                      <path
                                        d='M9.5 12.5H14.5'
                                        stroke='#292D32'
                                        stroke-width='1.5'
                                        stroke-linecap='round'
                                        stroke-linejoin='round'
                                      ></path>
                                    </svg>
                                  </Link>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    )}
                  </div>
                </div>
              </Col>
              <Col lg={3}>
                <CartPriceDetails cartCoupon={cartCoupon} />
              </Col>
            </Row>
          ) : (
            <div className='text-center'>
              <NoDataFound />
            </div>
          )}

          {Math.ceil(meta?.totalCount / 10) > 1 && (
            <Pagination
              totalCount={meta?.totalCount}
              handelPageChange={(e) => setPage(e.selected + 1)}
            />
          )}
        </Container>
      </section>
      <Footer />
    </>
  );
};
export default Cart;
