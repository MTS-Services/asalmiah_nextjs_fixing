'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { CiClock2, CiHeart } from 'react-icons/ci';
import { FaRegTrashAlt } from 'react-icons/fa';
import ReactStars from 'react-rating-stars-component';
import { useDispatch } from 'react-redux';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import Swal from 'sweetalert2';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { Swiper, SwiperSlide } from 'swiper/react';
import '../../(customer)/cart/page.scss';
import useDetails from '../../../../hooks/useDetails';

import {
  ADD_CART_API,
  ADD_CART_API_WITHOUT_LOGIN,
  ADD_REVIEW,
  ADD_WISHLIST,
  DELETE_ALLCART_ITEMS,
  DELETE_ALLCART_ITEMS_WITHOUT_LOGIN,
  PRODUCT_DETAIL_AUTH,
  PRODUCT_DETAIL_WITHOUT_AUTH,
  REPLY_DYNAMIC_QUESTION_ANSWER,
  REVIEW_LIST,
  SIMILAR_PRODUCT_LIST_AUTH,
  SIMILAR_PRODUCT_LIST_WITHOUT_AUTH,
  WITHOUTAUTH_REVIEW_LIST,
} from '../../../../services/APIServices';
import { constant, Paginations } from '../../../../utils/constants';
import Footer from '../../../../utils/Footer';
import Header from '../../../../utils/Header';
import UserLogInHeader from '../../../../utils/UserLogInHeader';
// import Breadcrums from '../../components/Breadcrums';

// import required modules
import NoDataFound from '@/app/components/no-data-found/page';
import { Pagination } from '@/app/components/Pagination';
import { useFormik } from 'formik';
import Image from 'next/image';
import { AiFillHeart } from 'react-icons/ai';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import * as yup from 'yup';
import useCartSlice from '../../../../hooks/useCartSlice';
import { addToCart, clearCart } from '../../../../redux/features/cartSlice';
import { toastAlert } from '../../../../utils/SweetAlert';

import Cookies from 'js-cookie';
import moment from 'moment';
import { DynamicStar } from 'react-dynamic-star';
import { RxCross2 } from 'react-icons/rx';
import {
  ShimmerCategoryItem,
  ShimmerSectionHeader,
  ShimmerText,
  ShimmerThumbnail,
} from 'react-shimmer-effects';
import useCountryState from '../../../../hooks/useCountryState';
import {
  checkLanguage,
  FORMAT_NUMBER,
  formatCurrency,
  getDeviceToken,
} from '../../../../utils/helper';
import '../../[role]/page/product-management/view-product/page.scss';
import { trans } from '../../../../utils/trans';
const ProductDetail = () => {
  let detail = useDetails();
  const selectedCountry = useCountryState();
  let queryClient = useQueryClient();
  const pathName = usePathname();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  let router = useRouter();
  let dispatch = useDispatch();
  let cart = useCartSlice();
  const [meta, setMeta] = useState('');
  const [page, setPage] = useState(Paginations?.DEFAULT_PAGE);
  const { id } = useParams();
  const {
    data: productDetailData,
    refetch,
    isPending: detailPending,
    isFetching,
  } = useQuery({
    queryKey: ['product-detail', { id }],
    queryFn: async () => {
      const res =
        detail?.roleId == constant?.USER
          ? await PRODUCT_DETAIL_AUTH(id)
          : await PRODUCT_DETAIL_WITHOUT_AUTH(id);
      return res?.data?.data ?? '';
    },
  });
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
        queryClient.invalidateQueries({ queryKey: ['cart-list-user'] });
        dispatch(clearCart(null));
        localStorage.removeItem('persist:cart');

        Cookies.remove('cartItems');
      }
    } catch (error) {
      console.error(error);
    }
  };

  let categoryId = productDetailData?.categoryId;
  const { data: relatedProductData, refetch: relatedReftch } = useQuery({
    queryKey: ['related-product', { categoryId }, page],
    queryFn: async () => {
      const res =
        detail?.roleId == constant?.USER
          ? await SIMILAR_PRODUCT_LIST_AUTH(id, page)
          : await SIMILAR_PRODUCT_LIST_WITHOUT_AUTH(id, page);
      setMeta(res?.data?._meta);
      return res?.data?.data ?? '';
    },
  });

  const { mutate, error, isPending } = useMutation({
    mutationFn: (payload) => {
      if (detail === null || detail === undefined) {
        const updatedPayload = {
          ...payload,
          deviceToken: getDeviceToken(), // Include the deviceToken in the payload
        };
        return ADD_CART_API_WITHOUT_LOGIN(updatedPayload);
      } else {
        return ADD_CART_API(payload);
      }
    },
    onSuccess: (resp) => {
      dispatch(
        addToCart({
          ...resp?.data?.data,
          cartProductId: id,
          quantity: 1,
          size: values?.size,
          color: values?.color,
          purchase_Price:
            productDetailData?.size?.length !== 0
              ? values?.discount
                ? values?.price
                : values?.mrp
              : productDetailData?.discount
              ? productDetailData?.price
              : productDetailData?.mrpPrice,
          product_cost: productDetailData?.pickupCost,
        })
      );
      toastAlert('success', resp?.data?.message);

      queryClient.invalidateQueries({ queryKey: ['cart-list-user'] });
      // router.push("/cart");
    },

    onError: (err) => {
      if (err?.response?.data?.DiffCompany == true) {
        Swal.fire({
          title:
            'Your cart having products from different company, please completed the current purchase',
          icon: 'warning',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Delete All',
          allowOutsideClick: false,
          showCloseButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            removeAllItemFromCart();
          }
        });
      }
    },
  });

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    touched,
    errors,
    resetForm,
    setValues,
    setFieldValue,
    setFieldTouched,
  } = useFormik({
    initialValues: {
      size: '',
      color: '',
      price: '',
      mrp: '',
      discount: '',
    },

    validationSchema: yup.object().shape({
      size: productDetailData?.size?.some((item) => item?.sizes !== '')
        ? yup.string().required().label('Size')
        : yup.string().notRequired(),

      color:
        productDetailData?.color?.length == 0
          ? yup.string().notRequired()
          : yup.string().required().label('Color'),
    }),
    onSubmit: async (values) => {
      const formData = questions
        .filter((question) => {
          const answer = formValues[question._id];
          return answer !== undefined && answer !== null && answer !== '';
        })
        .map((question) => {
          const answer = formValues[question._id];
          let answerText = '';

          // Find the answer text based on the answer ID
          if (question.answerType === constant?.RADIO) {
            const selectedAnswer = question.answers.find(
              (ans) => ans._id === answer
            );
            answerText = selectedAnswer ? selectedAnswer.answer_text : '';
          } else {
            answerText = answer; // For textarea, just take the answer directly
          }

          return {
            questionId: question.question,
            answerId: answerText, // Use the actual answer text
          };
        });

      let body = {
        productId: id,
        quantity: 1,
        size: values?.size,
        color: values?.color,
        companyId: productDetailData?.companyDetails?._id,
        product_cost: productDetailData?.pickupCost,
        purchase_Price:
          productDetailData?.size?.length !== 0
            ? values?.discount
              ? values?.price
              : values?.mrp
            : productDetailData?.discount
            ? productDetailData?.price
            : productDetailData?.mrpPrice,
        mrp:
          productDetailData?.size?.length !== 0
            ? values?.mrp
            : productDetailData?.mrpPrice,
        discount:
          productDetailData?.size?.length !== 0
            ? values?.discount
            : productDetailData?.discount,
        answers: formData,
      };

      mutate(body);
    },
  });

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { data: getreview, refetch: reviewRefetch } = useQuery({
    queryKey: ['getreview-list', id, page],
    queryFn: async () => {
      const res =
        detail?.roleId == constant?.USER
          ? await REVIEW_LIST(page, id)
          : await WITHOUTAUTH_REVIEW_LIST(page, id);
      setMeta(res?.data?._meta);

      return res?.data?.data ?? '';
    },
  });

  //Add review

  const mutationImport = useMutation({
    mutationFn: (body) => ADD_REVIEW(body),
    onSuccess: (resp) => {
      toastAlert('success', resp?.data?.message);
      reviewRefetch();
      refetch();
      handleClose();
      importresetForm();
    },
    onError: (err) => {
      toastAlert('error', err?.response?.data?.message);
      handleClose();
    },
  });

  const {
    handleSubmit: handleSubmitImport,
    setFieldValue: setFieldValueImport,
    values: importValues,
    errors: importerrors,
    touched: importtouched,
    resetForm: importresetForm,
    setFieldValue: importsetFieldValue,
    handleChange: handlechangenew,
  } = useFormik({
    initialValues: {
      imagePreview: [],
      review: '',
      rating: 3,
      productId: '',
    },
    validationSchema: yup.object().shape({
      review: yup.string().required().label('Review'),
      rating: yup.string().required().label('Rating'),
      imagePreview: yup.mixed().when(([file], schema) => {
        if (file?.length > 0) {
          return yup
            .array()
            .of(
              yup
                .mixed()
                .test('fileType', 'Unsupported file format', (value) => {
                  if (value) {
                    return ['image/jpeg', 'image/png'].includes(value.type);
                  }
                  return true;
                })
                .test(
                  'is-valid-size',
                  'Max allowed size is 10 MB',
                  (value) => value && value.size <= 10485760 // Update to 10 MB (10485760 bytes)
                )
            )
            .max(5, 'Only 5 productImg are allowed');
        }
        return schema;
      }),
    }),
    onSubmit: async (values) => {
      let formData = new FormData();
      formData.append('review', values?.review);
      formData.append('rating', values?.rating);
      formData.append('productId', id);

      if (values?.imagePreview) {
        values?.imagePreview.forEach((file) => {
          formData.append('reviewImg', file);
        });
      }

      mutationImport.mutate(formData);
    },
  });

  /****************************Dynamic Question Functionality***************************/
  const [formValues, setFormValues] = useState({});

  const questions = productDetailData?.dynamicquestions;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const assiginMutation = useMutation({
    mutationFn: (body) => REPLY_DYNAMIC_QUESTION_ANSWER(body),
    onSuccess: (resp) => {
      setFormValues({});
      toastAlert('success', resp?.data?.message);
    },
  });

  const handleAnswerSubmit = (event) => {
    event.preventDefault();

    const formData = questions
      .filter((question) => {
        let answer;
        if (question.answerType === 0) {
          answer = formValues[question._id];
        } else {
          answer = formValues[question._id];
        }
        return answer !== undefined && answer !== null && answer !== '';
      })
      .map((question) => {
        let answer;
        if (question.answerType === 0) {
          answer = formValues[question._id];
        } else {
          answer = formValues[question._id];
        }
        return { questionId: question._id, answerId: answer };
      });

    if (formData?.length == 0) {
      toastAlert('error', 'Please complete all fields or select an option.');
      return;
    }
    let body = {
      answers: formData,
    };
    assiginMutation.mutate(body);
  };

  const getPriceData = () => {
    const price = productDetailData?.price
      ? productDetailData.price
      : values?.size
      ? values?.price
      : productDetailData?.size?.at(0)?.price;

    return formatCurrency(price, selectedCountry);
  };

  const getMrpData = () => {
    const mrpPrice = productDetailData?.discount
      ? productDetailData.mrpPrice
      : values?.discount
      ? values?.mrp
      : productDetailData?.size?.at(0)?.mrp;

    return formatCurrency(mrpPrice, selectedCountry);
  };

  const getDiscountData = () => {
    const discount =
      productDetailData?.discount !== null
        ? productDetailData?.discount
        : values?.discount
        ? values?.discount
        : productDetailData?.size?.at(0)?.discount;
    return `${FORMAT_NUMBER(discount, true)} % off`;
  };
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const [lightboxImage, setLightboxImage] = useState(null);

  const handleImageClick = (image) => {
    setLightboxImage(image);
    setLightboxOpen(true);
  };
  const videoRefs = useRef([]);

  const handleSlideChange = (swiper) => {
    // Pause all videos
    videoRefs.current.forEach((video) => {
      if (video) video.pause();
    });

    // Play the current video
    const currentVideo = videoRefs.current[swiper.activeIndex];
    if (currentVideo) {
      currentVideo.pause();
    }
  };

  let language = localStorage.getItem('language');
  const Home = trans('home');
  const specifications = trans('specifications');
  const description = trans('description');
  const offerContent = trans('offerContent');
  return (
    <>
      {detail?.roleId == constant?.USER ? (
        <UserLogInHeader refetchAPI={refetch} />
      ) : (
        <Header refetchAPI={refetch} />
      )}

      {productDetailData?.length !== 0 ? (
        <>
          {/* <Breadcrums /> */}

          {/* ============================================= products detail
          ================================================= */}
          <section className='list-main gap-10'>
            <Container>
              <Row>
                {/* Image Section - Now takes 50% width */}
                <Col lg={6} xl={6}>
                  <div className='product-img'>
                    <div className='position-relative slider-img'>
                      {detailPending ? (
                        <ShimmerThumbnail height={250} rounded />
                      ) : (
                        <Swiper
                          style={{
                            '--swiper-navigation-color': '#fff',
                            '--swiper-pagination-color': '#fff',
                          }}
                          spaceBetween={10}
                          navigation={true}
                          thumbs={{ swiper: thumbsSwiper }}
                          modules={[FreeMode, Navigation, Thumbs]}
                          className='mySwiper2 mb-3'
                          onSlideChange={handleSlideChange}
                        >
                          {productDetailData?.productImg?.map((data, index) => {
                            return (
                              <SwiperSlide key={data?._id}>
                                {data?.type ? (
                                  data?.type?.includes('image') ? (
                                    <Image
                                      className='bg-img w-100'
                                      src={data?.url}
                                      fill={true}
                                      alt='image'
                                      onClick={() => handleImageClick(data)}
                                    />
                                  ) : (
                                    <video
                                      ref={(el) =>
                                        (videoRefs.current[index] = el)
                                      }
                                      width='100%'
                                      height='100%'
                                      src={data?.url}
                                      controls
                                    />
                                  )
                                ) : (
                                  <Image
                                    className='bg-img w-100'
                                    src={data?.url}
                                    width={500}
                                    height={500}
                                    alt='image'
                                    onClick={() => handleImageClick(data)}
                                  />
                                )}
                                <div className='onhover-show'>
                                  <ul>
                                    <li>
                                      {productDetailData?.isWishlist == true ? (
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
                                                productId:
                                                  productDetailData?._id,
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
                                                productId:
                                                  productDetailData?._id,
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
                              </SwiperSlide>
                            );
                          })}
                        </Swiper>
                      )}

                      {detailPending ? (
                        <ShimmerCategoryItem
                          hasImage
                          imageType='thumbnail'
                          imageWidth={100}
                          imageHeight={100}
                        />
                      ) : (
                        <Swiper
                          onSwiper={setThumbsSwiper}
                          spaceBetween={10}
                          slidesPerView={4}
                          freeMode={true}
                          watchSlidesProgress={true}
                          modules={[FreeMode, Navigation, Thumbs]}
                          className='mySwiper'
                        >
                          {productDetailData?.productImg?.map((data) => {
                            return (
                              <SwiperSlide key={data?._id}>
                                {data?.type ? (
                                  data?.type?.includes('image') ? (
                                    <Image
                                      className='bg-img w-100'
                                      src={data?.url}
                                      width={100}
                                      height={100}
                                      alt='image'
                                    />
                                  ) : (
                                    <video
                                      width='100%'
                                      height='100%'
                                      src={data?.url}
                                    />
                                  )
                                ) : (
                                  <Image
                                    className='bg-img w-100'
                                    src={data?.url}
                                    width={100}
                                    height={100}
                                    alt='image'
                                  />
                                )}
                              </SwiperSlide>
                            );
                          })}
                        </Swiper>
                      )}
                    </div>
                  </div>
                </Col>

                {/* Product Details Section - Now takes 50% width */}
                {detailPending ? (
                  <Col lg={6} xl={6}>
                    <ShimmerText line={5} gap={10} />
                    <ShimmerText line={5} gap={10} />
                  </Col>
                ) : (
                  <Col lg={6} xl={6}>
                    <div className='product-detail mt-lg-0 mt-4'>
                      <h5 className='fw-bold mb-4 text-black text-capitalize'>
                        {checkLanguage(
                          productDetailData?.productName,
                          productDetailData?.productArabicName
                        )}
                      </h5>
                      <Link
                        href={`/companies/${productDetailData?.companyDetails?._id}`}
                      >
                        <small className='text-muted mt-3'>
                          {productDetailData?.companyDetails?.company ?? '-'}
                        </small>
                      </Link>
                      {!!productDetailData && (
                        <p className='justify-content-start notranslate'>
                          <b>{getPriceData()}</b>
                          <del>{getMrpData()}</del>
                          <span>{getDiscountData()}</span>
                        </p>
                      )}
                      <ul className='rating justify-content-start '>
                        <li>
                          <div className=''>
                            <DynamicStar
                              rating={
                                productDetailData?.averageRating?.averageRating
                              }
                              height={15}
                              width={15}
                              outlined
                            />
                          </div>
                        </li>
                      </ul>
                      {/* Size Selection */}
                      {productDetailData?.size?.length !== 0 &&
                      productDetailData?.size?.at(0)?.sizes !== '' ? (
                        <div className='size-box border-top mt-2 pt-4'>
                          <h6 className='text-capitalize fw-bold'>size:</h6>
                          <ul className='selected d-flex align-items-center gap-3 mb-4 middle1'>
                            {productDetailData?.size?.map((data, index) => {
                              return (
                                <li>
                                  <input
                                    type='radio'
                                    name='size'
                                    label={data?.sizes}
                                    id={data?.sizes}
                                    checked={values?.size == data?.sizes}
                                    value={data?.sizes}
                                    onChange={() => {
                                      setFieldValue('size', data?.sizes);
                                      setFieldValue('price', data?.price);
                                      setFieldValue('mrp', data?.mrp);
                                      setFieldValue('discount', data?.discount);
                                    }}
                                  />
                                  <label for={data?.sizes}>{data?.sizes}</label>
                                </li>
                              );
                            })}

                            {touched?.size && errors?.size ? (
                              <span className='error'>
                                {touched?.size && errors?.size}
                              </span>
                            ) : (
                              ''
                            )}
                          </ul>
                        </div>
                      ) : (
                        ''
                      )}
                      {/* Color Selection */}
                      {productDetailData?.color?.length !== 0 ? (
                        <div className='color-box border-top pt-4'>
                          <h6 className='text-capitalize fw-bold'>color:</h6>
                          <ul
                            className='color-variant d-flex align-items-center gap-3 mb-4 middle'
                            style={{ flexWrap: 'wrap', maxWidth: '600px' }}
                          >
                            {productDetailData?.color?.map((data, index) => {
                              return (
                                <li key={index}>
                                  <input
                                    type='radio'
                                    name='color'
                                    label={data}
                                    id={data}
                                    checked={values?.color == data}
                                    value={data}
                                    onChange={handleChange}
                                  />
                                  <label
                                    for={data}
                                    style={{ backgroundColor: data }}
                                  ></label>
                                </li>
                              );
                            })}
                          </ul>

                          {touched?.color && errors?.color ? (
                            <span className='error'>
                              {touched?.color && errors?.color}
                            </span>
                          ) : (
                            ''
                          )}
                        </div>
                      ) : (
                        ''
                      )}
                      <div style={{ margin: '' }}>
                        {productDetailData?.quantity == 0 ? (
                          <p className='text-danger'>Out of stock</p>
                        ) : (
                          <Link
                            className='btn btn-theme my-3'
                            href='#'
                            onClick={async () => {
                              if (productDetailData?.quantity == 0) {
                                Swal.fire({
                                  toast: true,
                                  position: 'top-end',
                                  icon: 'warning',
                                  title: 'Product is out of stock',
                                  showConfirmButton: false,
                                  timer: 3000,
                                });
                                return;
                              }
                              const existItem = cart?.find((item) => {
                                return (
                                  item?.productId?._id ===
                                    productDetailData?._id &&
                                  item?.size === values?.size &&
                                  item?.color === values?.color
                                );
                              });

                              if (existItem) {
                                Swal.fire({
                                  toast: true,
                                  position: 'top-end',
                                  icon: 'warning',
                                  title: 'Product Already Added in cart',
                                  showConfirmButton: false,
                                  timer: 3000,
                                });
                              } else {
                                // --- START GTM ADD_TO_CART INTEGRATION ---
                                if (typeof window !== 'undefined') {
                                  window.dataLayer = window.dataLayer || [];
                                  window.dataLayer.push({
                                    event: 'add_to_cart', // GA4 Enhanced Ecommerce Event
                                    ecommerce: {
                                      currency: 'EUR', // Your currency code (e.g., BDT, USD, EUR)
                                      value: productDetailData?.price * 1, // Assuming quantity is 1 if no selector
                                      items: [
                                        {
                                          item_name: productDetailData?.name,
                                          item_id: productDetailData?._id,
                                          price: productDetailData?.price,
                                          quantity: 1, // Assuming quantity is 1 if no selector
                                          item_brand:
                                            productDetailData?.brand || '',
                                          item_category:
                                            productDetailData?.category || '',
                                          item_variant: `${
                                            values?.size || ''
                                          }-${values?.color || ''}`.trim(),
                                        },
                                      ],
                                    },
                                  });
                                  console.log(
                                    'GTM add_to_cart pushed for:',
                                    productDetailData?.name
                                  );
                                }
                                // --- END GTM ADD_TO_CART INTEGRATION ---

                                handleSubmit();
                              }
                            }}
                            aria-disabled={isPending}
                          >
                            Add to cart
                          </Link>
                        )}
                      </div>
                      {/* Product Description and Details */}
                      <section
                        className='product-description-main -mt-'
                        style={{ marginTop: '-60px' }}
                      >
                        <Container>
                          <Row>
                            <Col lg={12}>
                              <div className='product-description'>
                                <h5 className='mb-2 dis-title'>
                                  {description}
                                </h5>

                                <div
                                  className='mt-4'
                                  style={{ fontSize: '16px !important' }}
                                >
                                  <p
                                    style={{
                                      font: '400px',
                                      fontSize: '16px !important',
                                    }}
                                    dangerouslySetInnerHTML={{
                                      __html: checkLanguage(
                                        productDetailData?.description,
                                        productDetailData?.arabicDescription
                                      ),
                                    }}
                                  ></p>
                                </div>

                                {/* Specifications */}
                                {productDetailData?.madeIn ||
                                productDetailData?.companyDetails
                                  ?.costDelivery ||
                                productDetailData?.warranty ||
                                productDetailData?.material ||
                                productDetailData?.serialCode ||
                                productDetailData?.weight ||
                                productDetailData?.Brand ? (
                                  <div className='specification'>
                                    <h5
                                      className='mb-2 dis-title'
                                      style={{
                                        font: '400px',
                                        fontSize: '16px',
                                      }}
                                    >
                                      {specifications}
                                    </h5>
                                    <div className='mt-1 table-responsive'>
                                      {productDetailData?.madeIn ? (
                                        <div>
                                          <b>Made In: </b>
                                          <span>
                                            {productDetailData?.madeIn}
                                          </span>
                                        </div>
                                      ) : (
                                        ''
                                      )}
                                      {productDetailData?.companyDetails
                                        ?.costDelivery ? (
                                        <div>
                                          <b>Delivery Cost: </b>
                                          <span className='notranslate'>
                                            {formatCurrency(
                                              productDetailData?.companyDetails
                                                ?.costDelivery,
                                              selectedCountry
                                            )}
                                          </span>
                                        </div>
                                      ) : (
                                        ''
                                      )}
                                      {productDetailData?.warranty ? (
                                        <div>
                                          <b>Warranty (Years) : </b>
                                          <span>
                                            {productDetailData?.warranty}
                                          </span>
                                        </div>
                                      ) : (
                                        ''
                                      )}
                                      {productDetailData?.material ? (
                                        <div>
                                          <b>Material : </b>
                                          <span>
                                            {productDetailData?.material}
                                          </span>
                                        </div>
                                      ) : (
                                        ''
                                      )}
                                      {productDetailData?.serialCode ? (
                                        <div>
                                          <b>Serial Code : </b>
                                          <span>
                                            {productDetailData?.serialCode}
                                          </span>
                                        </div>
                                      ) : (
                                        ''
                                      )}
                                      {productDetailData?.weight ? (
                                        <div>
                                          <b>Weight (KG) : </b>
                                          <span>
                                            {productDetailData?.weight}
                                          </span>
                                        </div>
                                      ) : (
                                        ''
                                      )}
                                      {productDetailData?.Brand ? (
                                        <div>
                                          <b>Brand : </b>
                                          <span>
                                            {productDetailData?.brand}
                                          </span>
                                        </div>
                                      ) : (
                                        ''
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  ''
                                )}

                                {/* Offer Content */}
                                {productDetailData?.offerContent ? (
                                  <div className='mt-4'>
                                    <h5
                                      className='mb-2 dis-title'
                                      style={{
                                        color: '#d33',
                                      }}
                                    >
                                      {offerContent}
                                    </h5>
                                    <p
                                      dangerouslySetInnerHTML={{
                                        __html: checkLanguage(
                                          productDetailData?.offerContent,
                                          productDetailData?.arabicOfferContent
                                        ),
                                      }}
                                    ></p>
                                  </div>
                                ) : (
                                  ''
                                )}

                                {/* Terms & Conditions */}
                                {productDetailData?.termsCondition ? (
                                  <div className='comment mt-4'>
                                    <h5
                                      className='mb-2 dis-title'
                                      style={{
                                        color: '#d33',
                                      }}
                                    >
                                      Terms & Conditions
                                    </h5>
                                    <p
                                      dangerouslySetInnerHTML={{
                                        __html: checkLanguage(
                                          productDetailData?.termsCondition,
                                          productDetailData?.arabicTermsCondition
                                        ),
                                      }}
                                    />
                                  </div>
                                ) : (
                                  ''
                                )}

                                {/* Reviews Section */}
                                <div className='comment mt-4'>
                                  {getreview?.length !== 0 ? (
                                    <h4 className='mb-2 dis-title'>Reviews</h4>
                                  ) : (
                                    ''
                                  )}

                                  <div className='d-flex align-items-center justify-content-end mb-4'>
                                    {detail?.roleId === constant?.USER && (
                                      <a
                                        className='btn btn-theme text-capitalize'
                                        onClick={() => {
                                          handleShow();
                                          importresetForm();
                                        }}
                                      >
                                        Add Reviews
                                      </a>
                                    )}
                                  </div>
                                  <ul>
                                    {getreview?.length !== 0
                                      ? getreview?.map((comment, index) => {
                                          return (
                                            <li
                                              key={index}
                                              className='bg-color'
                                            >
                                              <div className='comment-items d-flex align-items-start gap-2 flex-lg-nowrap flex-wrap'>
                                                <div className='user-img'>
                                                  <img
                                                    src={
                                                      comment?.userDetails
                                                        ?.profileImg
                                                        ? comment?.userDetails
                                                            ?.profileImg
                                                        : '/assets/img/default.png'
                                                    }
                                                    alt='User'
                                                  />
                                                </div>
                                                <div className='user-content flex-grow-1'>
                                                  <div className='user-info'>
                                                    <div className='d-flex justify-content-between gap-3'>
                                                      <h6>
                                                        {
                                                          comment.userDetails
                                                            ?.fullName
                                                        }
                                                      </h6>
                                                      <div className=''>
                                                        <span>
                                                          <i
                                                            className='iconsax me-2'
                                                            data-icon='clock'
                                                          >
                                                            <CiClock2 />
                                                          </i>
                                                          {moment(
                                                            comment.createdAt
                                                          ).format('lll')}
                                                        </span>
                                                      </div>
                                                    </div>
                                                    <ul className='rating d-flex align-items-center gap-2 justify-content-start'>
                                                      <DynamicStar
                                                        rating={comment?.rating}
                                                        height={15}
                                                        width={15}
                                                        outlined
                                                      />
                                                    </ul>
                                                    <p>{comment.review}</p>
                                                    {comment?.reviewImg?.map(
                                                      (data) => {
                                                        return (
                                                          <Image
                                                            src={data?.url}
                                                            onClick={() =>
                                                              window.open(
                                                                data?.url,
                                                                '_blank',
                                                                'width=800,height=600'
                                                              )
                                                            }
                                                            alt='review-img'
                                                            className='preview-img'
                                                            height={100}
                                                            width={100}
                                                          />
                                                        );
                                                      }
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            </li>
                                          );
                                        })
                                      : ''}
                                    {Math.ceil(meta?.totalCount / 10) > 1 && (
                                      <Pagination
                                        totalCount={meta?.totalCount}
                                        handelPageChange={(e) =>
                                          setPage(e.selected + 1)
                                        }
                                      />
                                    )}
                                  </ul>
                                </div>

                                {/* Questions Section */}
                                {questions?.length !== 0 ? (
                                  <div className='comment mt-4'>
                                    <h4 className='mb-2 dis-title'>
                                      Questions
                                    </h4>
                                    <form>
                                      {questions?.length !== 0 ? (
                                        questions?.map((question, index) => (
                                          <div key={index} className='mb-3'>
                                            <label>
                                              {index + 1}. {question.question}
                                            </label>
                                            {question.answerType ===
                                            constant?.RADIO ? (
                                              <div>
                                                {question.answers.map(
                                                  (answer, answerIndex) => (
                                                    <div
                                                      key={answerIndex}
                                                      className='form-check'
                                                    >
                                                      <input
                                                        type='radio'
                                                        name={question._id}
                                                        value={answer._id}
                                                        onChange={
                                                          handleInputChange
                                                        }
                                                        className='form-check-input'
                                                      />
                                                      <label className='form-check-label'>
                                                        {answer.answer_text}
                                                      </label>
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            ) : (
                                              <>
                                                <textarea
                                                  rows='5'
                                                  placeholder='Please Enter Answer'
                                                  name={question._id}
                                                  value={
                                                    formValues[question._id] ||
                                                    ''
                                                  }
                                                  onChange={handleInputChange}
                                                  className='form-control'
                                                />
                                              </>
                                            )}
                                          </div>
                                        ))
                                      ) : (
                                        <NoDataFound />
                                      )}
                                    </form>
                                  </div>
                                ) : (
                                  ''
                                )}
                              </div>
                            </Col>
                          </Row>
                        </Container>
                      </section>
                    </div>
                  </Col>
                )}
              </Row>
            </Container>
          </section>

          {/* ============================================== products details apge
          ============================================= */}
          {relatedProductData?.length !== 0 ? (
            <section className='related-product pt-0'>
              <Container>
                <h2 className='text-capitalize text-black mb-4'>
                  related product
                </h2>
                <Row>
                  {relatedProductData?.length !== 0 ? (
                    relatedProductData?.map((data) => {
                      return (
                        <Col lg={8}>
                          <div className='product-box-3 mb-5'>
                            <div className='img-wrapper position-relative'>
                              <div className='product-image'>
                                <Link
                                  className='pro-first bg-size'
                                  href={`/product-detail/${data?._id}`}
                                >
                                  {data?.type ? (
                                    data?.type?.includes('image') ? (
                                      <Image
                                        className='bg-img w-100'
                                        src={data?.productImg[0]?.url}
                                        width={500}
                                        height={500}
                                        alt='image'
                                        // layout="intrinsic"
                                      />
                                    ) : (
                                      <video
                                        width='100%'
                                        height='100%'
                                        src={data?.productImg[0]?.url}
                                        controls
                                      />
                                    )
                                  ) : (
                                    <Image
                                      className='bg-img w-100'
                                      src={data?.productImg[0]?.url}
                                      width={500}
                                      height={500}
                                      alt='image'
                                      // layout="intrinsic"
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
                                          let body = {
                                            productId: data?._id,

                                            type: '1',
                                            isWishlist: false,
                                            web: true,
                                          };
                                          wishlistMutation?.mutate(body);
                                        }}
                                      >
                                        <AiFillHeart />
                                      </Link>
                                    ) : (
                                      <Link
                                        href='#'
                                        onClick={(e) => {
                                          e.preventDefault();
                                          let body = {
                                            productId: data?._id,
                                            type: '1',
                                            isWishlist: true,
                                            web: true,
                                          };
                                          wishlistMutation?.mutate(body);
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
                              <ul className='rating'>
                                <DynamicStar
                                  rating={data?.averageRating?.averageRating}
                                  height={15}
                                  width={15}
                                  outlined
                                />
                                <li className='ms-1'>
                                  ({data?.averageRating?.averageRating ?? 0}
                                  )Rating
                                </li>
                              </ul>
                              <a href='#'>
                                <h6>
                                  {checkLanguage(
                                    data?.productName,
                                    data?.productArabicName
                                  )}
                                </h6>
                              </a>
                              <p className='notranslate'>
                                {formatCurrency(data?.price, selectedCountry)}
                                {data?.discount !== null ? (
                                  <del>
                                    {formatCurrency(
                                      data?.mrpPrice,
                                      selectedCountry
                                    )}
                                  </del>
                                ) : (
                                  ''
                                )}
                                {data?.discount !== null ? (
                                  <span>{data?.discount}% off</span>
                                ) : (
                                  ''
                                )}
                              </p>
                            </div>
                          </div>
                        </Col>
                      );
                    })
                  ) : (
                    <NoDataFound />
                  )}
                </Row>
                {Math.ceil(meta?.totalCount / 10) > 1 && (
                  <Pagination
                    totalCount={meta?.totalCount}
                    handelPageChange={(e) => setPage(e.selected + 1)}
                  />
                )}
              </Container>
            </section>
          ) : (
            ''
          )}
        </>
      ) : (
        <Container className='d-flex justify-content-center align-items-center company-list-card'>
          <Row>
            <Col className='text-center'>
              <h4>Product details not found</h4>
              <button className='btn btn-theme m-2' e>
                Go Back to Home
              </button>
            </Col>
          </Row>
        </Container>
      )}

      <Footer />

      {/*  Add Review start */}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Reviews</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitImport}>
            <Row>
              <Col lg={6}>
                <Form.Group
                  className='mb-3'
                  controlId='exampleForm.ControlInput1'
                >
                  <Form.Label>Rating</Form.Label>

                  <ReactStars
                    size={40}
                    count={5}
                    value={importValues.rating}
                    isHalf={true}
                    emptyIcon={<i className='far fa-star'></i>}
                    halfIcon={<i className='fa fa-star-half-alt'></i>}
                    fullIcon={<i className='fa fa-star'></i>}
                    activeColor='#ffd700'
                    onChange={(newRating) => {
                      setFieldValueImport('rating', newRating);
                    }}
                  />
                </Form.Group>
              </Col>

              <Col lg={12}>
                <Form.Group
                  className='mb-3'
                  controlId='exampleForm.ControlTextarea1'
                >
                  <Form.Label>Your Comment</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={3}
                    type='text'
                    placeholder='Enter Review'
                    name='review'
                    value={importValues.review}
                    onChange={handlechangenew}
                    // onBlur={importtouched}
                    autoComplete='off'
                  />
                  {importtouched?.review && importerrors?.review ? (
                    <span className='error'>
                      {importtouched.review && importerrors.review}
                    </span>
                  ) : (
                    ''
                  )}
                </Form.Group>
              </Col>

              <Col lg={12}>
                <div className='form-group upload-cntnt-card'>
                  <input
                    type='file'
                    name='imagePreview'
                    onChange={(e) => {
                      importsetFieldValue('imagePreview', [
                        ...importValues.imagePreview,
                        ...e.target.files,
                      ]);
                    }}
                    multiple
                    accept='image/*'
                  />
                  <div className='upload-content-here'>
                    <h4>Upload Image</h4>
                  </div>
                </div>
                {importValues?.imagePreview?.length !== 0 ? (
                  <div className='upload-cntnt-view mb-3'>
                    {importValues?.imagePreview?.map((item, index) => {
                      return (
                        <div className='upload-icn-view' key={index}>
                          <img src={URL.createObjectURL(item)} alt='Thumb' />
                          <h4 className='me-auto'>Content name {index + 1}</h4>
                          <a
                            className='trash-btn'
                            href='#'
                            onClick={() => {
                              let img = importValues?.imagePreview;
                              img.splice(index, 1);
                              importsetFieldValue('imagePreview', img);
                            }}
                          >
                            <FaRegTrashAlt />
                          </a>
                          {importtouched?.imagePreview &&
                          importerrors?.imagePreview ? (
                            <span className='error'>
                              {importtouched?.imagePreview &&
                                importerrors?.imagePreview?.at(index)}
                            </span>
                          ) : (
                            ''
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  ''
                )}
              </Col>

              <Col lg={12}>
                <div className='d-flex align-items-center justify-content-end'>
                  <button
                    className='btn btn-theme text-capitalize'
                    type='submit'
                  >
                    Submit
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
      {/* {detailPending || isFetching || isPending ? <Loading /> : null} */}
      {/*  Add Review end */}

      {lightboxOpen && (
        <div className={`lightbox-container ${lightboxOpen ? 'show' : ''}`}>
          <div className='lightbox-content'>
            {lightboxImage && (
              <TransformWrapper
                initialScale={1}
                initialPositionX={0}
                initialPositionY={0}
                wheel={{ step: 0.6 }}
              >
                {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                  <React.Fragment>
                    <TransformComponent>
                      {lightboxImage?.type ? (
                        lightboxImage?.type?.includes('image') ? (
                          <img
                            className='lightbox-image'
                            src={lightboxImage?.url}
                            alt='image'
                          />
                        ) : (
                          <video
                            className='lightbox-video'
                            src={lightboxImage?.url}
                            controls
                          />
                        )
                      ) : (
                        <img
                          className='lightbox-image'
                          src={lightboxImage?.url}
                          alt='image'
                        />
                      )}
                    </TransformComponent>
                    <div className='lightbox-controls'>
                      <button
                        className='lightbox-close'
                        onClick={() => setLightboxOpen(false)}
                      >
                        <RxCross2 />
                      </button>

                      {lightboxImage?.type ? (
                        lightboxImage?.type?.includes('image') ? (
                          <div className='bottom-btns'>
                            <button
                              className='zoom-button'
                              onClick={() => zoomIn(0.1)}
                            >
                              +
                            </button>
                            <button
                              className='zoom-button'
                              onClick={() => zoomOut(0.1)}
                            >
                              -
                            </button>
                            <button
                              className='reset-button'
                              onClick={() => {
                                if (
                                  rest?.scale !== 1 ||
                                  rest?.positionX !== 0 ||
                                  rest?.positionY !== 0
                                ) {
                                  resetTransform();
                                }
                              }}
                            >
                              Reset
                            </button>
                          </div>
                        ) : (
                          ''
                        )
                      ) : (
                        <div className='bottom-btns'>
                          <button
                            className='zoom-button'
                            onClick={() => zoomIn(0.1)}
                          >
                            +
                          </button>
                          <button
                            className='zoom-button'
                            onClick={() => zoomOut(0.1)}
                          >
                            -
                          </button>
                          <button
                            className='reset-button'
                            onClick={() => {
                              if (
                                rest?.scale !== 1 ||
                                rest?.positionX !== 0 ||
                                rest?.positionY !== 0
                              ) {
                                resetTransform();
                              }
                            }}
                          >
                            Reset
                          </button>
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                )}
              </TransformWrapper>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;
