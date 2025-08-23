import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import Cookies from 'js-cookie';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Col, Form, Modal, Row } from 'react-bootstrap';
import { MdCancel } from 'react-icons/md';
import OTPInput from 'react-otp-input';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import '../(customer)/cart/page.scss';
import useCartSlice from '../../../hooks/useCartSlice';
import useDetails from '../../../hooks/useDetails';
import { clearCart } from '../../../redux/features/cartSlice';
import { userDetails } from '../../../redux/features/userSlice';
import {
  checkVerify,
  createUserOrder,
  PAYMENT_PROCESS,
  PAYMENT_PROCESS_STATUS,
  PROMOCODE_USER_CART,
  PROMOCODE_USER_CART_WITHOUT_LOGIN,
  resendOTPByOrder,
  USER_CART,
  USER_CART_WITHOUT_LOGIN,
  verifyOTPByLogin,
} from '../../../services/APIServices';
import { toastAlert } from '../../../utils/SweetAlert';
import {
  FORMAT_NUMBER,
  formatCurrency,
  getDeviceToken,
  getStartAndEndDate,
} from '../../../utils/helper';

import useCountryState from '../../../hooks/useCountryState';
import Loading from '../user/loading';
const CartPriceDetails = forwardRef(
  ({ selectedAddressId, branchList, cartCoupon }, ref) => {
    const searchParams = useSearchParams();
    let paymentType = localStorage.getItem('paymentType');
    const address = localStorage.getItem('addressId');
    const tapId = searchParams?.get('tap_id');
    let queryClient = useQueryClient();
    let cart = useCartSlice();
    const details = useDetails();
    let router = useRouter();
    let pathName = usePathname();
    let dispatch = useDispatch();
    const selectedCountry = useCountryState();
    const [show, setShow] = useState(false);
    let promoCodeState = localStorage.getItem('promocode');
    let branchId = localStorage.getItem('branchId');
    let couponBranchId = localStorage.getItem('couponBranchId');
    let keyId = localStorage.getItem('keyId');
    let paymentCardId = localStorage.getItem('paymentCardId');
    let scheduleDate = localStorage.getItem('date');
    let walletAmount = localStorage.getItem('walletAmount');

    let walletUse = localStorage.getItem('walletUse');

    let promoMsgStore = localStorage.getItem('promoMsg');
    const [promoCode, setPromoCode] = useState();

    const [promoRemove, setPromoRemove] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [otpVerifyModal, setOTPverifyModal] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [showVerify, setShowVerify] = useState(false);
    // ["cart-list-user","",null] data is undefined
    const {
      data: cartListing,
      refetch,
      isPending: cartPending,
    } = useQuery({
      queryKey: ['cart-list-user', !cartCoupon ? promoCodeState : '', keyId],
      queryFn: async () => {
        if (cartCoupon) {
          setPromoCode('');
          localStorage.removeItem('promocode');
          const resp =
            details == null || details == undefined
              ? await USER_CART_WITHOUT_LOGIN(keyId, '', getDeviceToken())
              : await USER_CART(keyId);
          if (promoRemove == true) {
            toastAlert('success', 'Promocode removed successfully');
          }
          if (resp?.data?.data?.cartList?.at(0)?.userDetails?.walletDetails) {
            localStorage.setItem(
              'walletAmount',
              resp?.data?.data?.cartList?.at(0)?.userDetails?.walletDetails
                ?.amount
            );
          }
          return resp?.data?.data ?? [];
        } else if (promoCode || promoCodeState) {
          try {
            const resp =
              details == null || details == undefined
                ? await PROMOCODE_USER_CART_WITHOUT_LOGIN(
                    promoCode || promoCodeState,
                    keyId,
                    '',
                    getDeviceToken()
                  )
                : await PROMOCODE_USER_CART(promoCode || promoCodeState, keyId);

            if (promoMsgStore) {
              toastAlert('success', 'Promocode applied successfully');
              localStorage.removeItem('promoMsg');
            }
            if (resp?.data?.data?.cartList?.at(0)?.userDetails?.walletDetails) {
              localStorage.setItem(
                'walletAmount',
                resp?.data?.data?.cartList?.at(0)?.userDetails?.walletDetails
                  ?.amount
              );
            }
            return resp?.data?.data ?? [];
          } catch (error) {
            setPromoCode('');
            toastAlert('error', error?.response?.data?.message);
            localStorage.removeItem('promocode');
            // if (error?.response?.status === 400) {
            // If promo code returns 400, fall back to fetching user's cart
            const resp =
              details == null || details == undefined
                ? await USER_CART_WITHOUT_LOGIN(keyId, '', getDeviceToken())
                : await USER_CART(keyId);

            if (resp?.data?.data?.cartList?.at(0)?.userDetails?.walletDetails) {
              localStorage.setItem(
                'walletAmount',
                resp?.data?.data?.cartList?.at(0)?.userDetails?.walletDetails
                  ?.amount
              );
            }
            return resp?.data?.data ?? [];

            // } else {
            //   throw error;
            // }
          }
        } else {
          const resp =
            details == null || details == undefined
              ? await USER_CART_WITHOUT_LOGIN(keyId, '', getDeviceToken())
              : await USER_CART(keyId);
          if (promoRemove == true) {
            toastAlert('success', 'Promocode removed successfully');
          }
          if (resp?.data?.data?.cartList?.at(0)?.userDetails?.walletDetails) {
            localStorage.setItem(
              'walletAmount',
              resp?.data?.data?.cartList?.at(0)?.userDetails?.walletDetails
                ?.amount
            );
          }
          return resp?.data?.data ?? [];
        }
      },
      // staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
      // refetchOnWindowFocus: true, // Refetch when window gains focus
    });

    // const { data: couponListUser } = useQuery({
    //   queryKey: ["coupon-list-user", page],
    //   queryFn: async () => {
    //     const resp = await GET_USER_PROMOTION_LIST(page);
    //     setMeta(resp?.data?._meta);
    //     return resp?.data?.data ?? [];
    //   },
    // });

    const mutation = useMutation({
      mutationFn: (body) => createUserOrder(body),
      onSuccess: (res) => {
        // handleSubmit();\
        setPromoCode('');
        router.push('/thankyou');

        toastAlert('success', res?.data?.message);
        dispatch(clearCart(null));
        localStorage.removeItem('persist:cart');
        Cookies.remove('cartItems');
        localStorage.removeItem('branchId');
        localStorage.removeItem('couponBranchId');
        localStorage.removeItem('promocode');
        localStorage.removeItem('date');
        localStorage.removeItem('keyId');
        localStorage.removeItem('time');
        localStorage.removeItem('paymentType');
        localStorage.removeItem('paymentCardId');
        localStorage.removeItem('walletUse');
      },
    });

    const { mutate, error, isPending } = useMutation({
      mutationFn: (payload) => PAYMENT_PROCESS(payload),
      onSuccess: (resp) => {
        if (resp?.data?.data?.transaction?.url) {
          router.push(resp?.data?.data?.transaction?.url);
        }
        // localStorage.removeItem("paymentType");

        // orderHandleSubmit();
      },
      onError: (err) => {
        toastAlert('error', err?.response?.data?.message);
        router.push('/cart');
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
        amount: '',
        productId: [],
      },
      onSubmit: async () => {
        let body;
        let walletResult;

        if (pathName == '/cart') {
          let cartProductCount = cartListing?.cartList?.filter(
            (data) => data?.productDetails?.quantity == 0
          );

          if (cartProductCount?.length > 0) {
            return toastAlert(
              'error',
              'One of the products in your cart is currently out of stock.'
            );
          } else {
            router.push('/checkout');

            localStorage.removeItem('branchId');
            localStorage.removeItem('couponBranchId');
            localStorage.removeItem('date');
            localStorage.removeItem('keyId');
            localStorage.removeItem('time');
            localStorage.removeItem('paymentType');
            localStorage.removeItem('paymentCardId');
          }
        } else if (
          pathName == '/checkout' &&
          keyId == 1 &&
          !selectedAddressId
        ) {
          toastAlert('error', 'Select your address');
        } else if (pathName == '/checkout' && keyId == 2 && !branchId) {
          toastAlert('error', 'Kindly! select branch');
        }
        //  else if (pathName == "/checkout" && keyId == 3 && !couponBranchId) {
        //   toastAlert("error", "Kindly! select branch");
        // }
        else if (
          // (pathName == "/checkout" && keyId == 1) ||
          // (pathName == "/checkout" && keyId == 2)
          pathName == '/checkout'
        ) {
          if (walletAmount > 0 && !walletUse) {
            Swal.fire({
              title: 'Are you sure?',
              text: 'Do you want to use wallet?',
              icon: 'warning',
              showDenyButton: true,
              confirmButtonColor: '#000',
              denyButtonColor: '#d33',
              confirmButtonText: 'Yes',
              denyButtonText: 'No',
              allowOutsideClick: false,
              showCloseButton: true,
            }).then(async (result) => {
              if (result.isConfirmed) {
                localStorage.setItem('walletUse', true);
                if (walletAmount < cartListing?.total) {
                  router.push(`/payment`);
                  localStorage.setItem('walletAmount', walletAmount);
                } else {
                  if (localStorage.getItem('walletUse')) {
                    if (walletAmount >= cartListing.total) {
                      walletResult = cartListing?.total; // Wallet amount is enough, return total.
                    } else {
                      walletResult = walletAmount; // Wallet amount is not enough, return wallet amount.
                    }
                  } else {
                    walletResult = null;
                  }
                  if (keyId == 1) {
                    if (scheduleDate && promoCodeState) {
                      const { startIsoDate, endIsoDate } = getStartAndEndDate();
                      body = {
                        address: address,
                        paymentType:
                          (walletUse && walletAmount == cartListing.total) ||
                          (walletUse && walletAmount > cartListing.total)
                            ? ''
                            : paymentType,
                        orderType: keyId,
                        charge: cartListing?.charge,
                        subTotal: cartListing?.subTotal,
                        total: cartListing?.total,
                        promocode: promoCodeState?.trim(),
                        branch: branchId ? branchId : null,
                        startDate: startIsoDate,
                        endDate: endIsoDate,
                        asSoonas: false,
                        chargeId: tapId,
                        walletAmount: walletResult,
                        cashBack: cartListing?.cashBack,
                      };
                    } else if (scheduleDate && !promoCodeState) {
                      const { startIsoDate, endIsoDate } = getStartAndEndDate();

                      body = {
                        address: address,
                        paymentType:
                          (walletUse && walletAmount == cartListing.total) ||
                          (walletUse && walletAmount > cartListing.total)
                            ? ''
                            : paymentType,
                        orderType: keyId,
                        branch: branchId ? branchId : null,
                        charge: cartListing?.charge,
                        subTotal: cartListing?.subTotal,
                        total: cartListing?.total,
                        startDate: startIsoDate,
                        endDate: endIsoDate,
                        asSoonas: false,
                        chargeId: tapId,
                        walletAmount: walletResult
                          ? walletResult
                          : walletUse
                          ? localStorage.getItem('walletAmount')
                          : 0,
                      };
                    } else {
                      body = {
                        branch: branchId ? branchId : null,
                        address: address,
                        paymentType:
                          (walletUse && walletAmount == cartListing.total) ||
                          (walletUse && walletAmount > cartListing.total)
                            ? ''
                            : paymentType,
                        orderType: keyId,
                        charge: cartListing?.charge,
                        subTotal: cartListing?.subTotal,
                        total: cartListing?.total,
                        promocode: promoCodeState?.trim(),
                        asSoonas: true,
                        chargeId: tapId,
                        walletAmount: walletResult
                          ? walletResult
                          : walletUse
                          ? localStorage.getItem('walletAmount')
                          : 0,
                        cashBack: cartListing?.cashBack,
                      };
                    }
                  } else if (!promoCodeState) {
                    body = {
                      address: address,
                      paymentType:
                        (walletUse && walletAmount == cartListing.total) ||
                        (walletUse && walletAmount > cartListing.total)
                          ? ''
                          : paymentType,
                      orderType: keyId,
                      charge: cartListing?.charge,
                      subTotal: cartListing?.subTotal,
                      total: cartListing?.total,
                      branch: branchId ? branchId : null,
                      chargeId: tapId,
                      walletAmount: walletResult
                        ? walletResult
                        : walletUse
                        ? localStorage.getItem('walletAmount')
                        : 0,
                    };
                  } else {
                    body = {
                      address: address,
                      paymentType:
                        (walletUse && walletAmount == cartListing.total) ||
                        (walletUse && walletAmount > cartListing.total)
                          ? ''
                          : paymentType,
                      orderType: keyId,
                      charge: cartListing?.charge,
                      subTotal: cartListing?.subTotal,
                      total: cartListing?.total,
                      promocode: promoCodeState?.trim(),
                      branch: branchId ? branchId : null,
                      chargeId: tapId,
                      walletAmount: walletResult
                        ? walletResult
                        : walletUse
                        ? localStorage.getItem('walletAmount')
                        : 0,
                      cashBack: cartListing?.cashBack,
                    };
                  }
                  mutation.mutate(body);
                }
                return;
              } else if (result?.isDismissed) {
                return;
              } else {
                router.push(`/payment`);
              }
            });
          } else {
            if (walletAmount >= cartListing.total) {
              router.push(`/checkout`);
            } else {
              router.push(`/payment`);
            }
          }
        } else if (pathName == '/payment' && paymentType == 1 && !tapId) {
          let body = {
            amount: walletUse
              ? cartListing?.total - walletAmount
              : cartListing?.total,
            productId: cartListing?.cartList
              ?.map((data) => {
                return data?.productDetails?._id;
              })
              .join(', '),
            cardId: paymentCardId,
            isCardSave: false,
          };
          if (!paymentCardId) {
            Swal.fire({
              title: 'Are you sure?',
              text: 'You want to save this card!',
              icon: 'warning',
              showDenyButton: true,
              confirmButtonColor: '#000',
              denyButtonColor: '#d33',
              confirmButtonText: 'Yes',
              denyButtonText: 'No',
              allowOutsideClick: false,
              showCloseButton: true,
            }).then(async (result) => {
              if (result.isConfirmed) {
                body.isCardSave = true;
                mutate(body);
              } else if (result?.isDismissed) {
                return;
              } else if (result?.isDenied) {
                body.isCardSave = false;
                mutate(body);
              }
            });
          } else {
            body.isCardSave = false;
            mutate(body);
          }
        } else if (
          (pathName == '/payment' && paymentType == 2) ||
          (pathName == '/payment' && paymentType == 3) ||
          (pathName == '/payment' && tapId && paymentType == 1) ||
          (pathName == '/checkout' && keyId == 3)
        ) {
          if (pathName == '/payment') {
            if (keyId == 1) {
              if (scheduleDate && promoCodeState) {
                const { startIsoDate, endIsoDate } = getStartAndEndDate();

                body = {
                  address: address,
                  paymentType:
                    (walletUse && walletAmount == cartListing.total) ||
                    (walletUse && walletAmount > cartListing.total)
                      ? ''
                      : paymentType,
                  orderType: keyId,
                  charge: cartListing?.charge,
                  subTotal: cartListing?.subTotal,
                  total: cartListing?.total,
                  promocode: promoCodeState?.trim(),
                  // branch: branchId ? branchId : null,
                  startDate: startIsoDate,
                  endDate: endIsoDate,
                  asSoonas: false,
                  chargeId: tapId,
                  walletAmount: walletResult
                    ? walletResult
                    : walletUse
                    ? localStorage.getItem('walletAmount')
                    : 0,
                  cashBack: cartListing?.cashBack,
                };
              } else if (scheduleDate && !promoCodeState) {
                const { startIsoDate, endIsoDate } = getStartAndEndDate();

                body = {
                  address: address,
                  paymentType:
                    (walletUse && walletAmount == cartListing.total) ||
                    (walletUse && walletAmount > cartListing.total)
                      ? ''
                      : paymentType,
                  orderType: keyId,
                  // branch: branchId ? branchId : null,
                  charge: cartListing?.charge,
                  subTotal: cartListing?.subTotal,
                  total: cartListing?.total,
                  startDate: startIsoDate,
                  endDate: endIsoDate,
                  asSoonas: false,
                  chargeId: tapId,
                  walletAmount: walletResult
                    ? walletResult
                    : walletUse
                    ? localStorage.getItem('walletAmount')
                    : 0,
                };
              } else {
                body = {
                  branch: branchId ? branchId : null,
                  address: address,
                  paymentType:
                    (walletUse && walletAmount == cartListing.total) ||
                    (walletUse && walletAmount > cartListing.total)
                      ? ''
                      : paymentType,
                  orderType: keyId,
                  charge: cartListing?.charge,
                  subTotal: cartListing?.subTotal,
                  total: cartListing?.total,
                  promocode: promoCodeState?.trim(),
                  asSoonas: true,
                  chargeId: tapId,
                  walletAmount: walletResult
                    ? walletResult
                    : walletUse
                    ? localStorage.getItem('walletAmount')
                    : 0,
                  cashBack: cartListing?.cashBack,
                };
              }
            } else if (!promoCodeState) {
              body = {
                address: address,
                paymentType:
                  (walletUse && walletAmount == cartListing.total) ||
                  (walletUse && walletAmount > cartListing.total)
                    ? ''
                    : paymentType,
                orderType: keyId,
                charge: cartListing?.charge,
                subTotal: cartListing?.subTotal,
                total: cartListing?.total,
                branch: branchId ? branchId : null,
                chargeId: tapId,
                walletAmount: walletResult
                  ? walletResult
                  : walletUse
                  ? localStorage.getItem('walletAmount')
                  : 0,
              };
            } else {
              body = {
                address: address,
                paymentType:
                  (walletUse && walletAmount == cartListing.total) ||
                  (walletUse && walletAmount > cartListing.total)
                    ? ''
                    : paymentType,
                orderType: keyId,
                charge: cartListing?.charge,
                subTotal: cartListing?.subTotal,
                total: cartListing?.total,
                promocode: promoCodeState?.trim(),
                branch: branchId ? branchId : null,
                chargeId: tapId,
                walletAmount: walletResult
                  ? walletResult
                  : walletUse
                  ? localStorage.getItem('walletAmount')
                  : 0,
                cashBack: cartListing?.cashBack,
              };
            }
          }

          // else if (pathName == "/checkout" && keyId == 3) {
          //   if (!promoCodeState) {
          //     body = {
          //       orderType: keyId,
          //       subTotal: cartListing?.subTotal,
          //       total: cartListing?.total,
          //     };
          //   } else {
          //     body = {
          //       orderType: keyId,
          //       subTotal: cartListing?.subTotal,
          //       total: cartListing?.total,
          //       promocode: promoCodeState,
          //     };
          //   }
          // }

          mutation.mutate(body);
        }
      },
    });
    const {
      data,
      isLoading,
      isPending: paymentPending,
    } = useQuery({
      queryKey: ['payment-status', tapId],
      queryFn: async ({ queryKey }) => {
        const [_key, tapId] = queryKey;
        if (!tapId) {
          return null; // or some default value
        }
        const resp = await PAYMENT_PROCESS_STATUS(tapId);

        if (resp?.data?.data?.status === 'CAPTURED' && paymentType) {
          handleSubmit();
        }

        return resp?.data?.data;
      },
      throwOnError: (err) => {
        router.push('/cart');
        toastAlert('error', err?.response?.data?.message);
      },
    });

    // useEffect(() => {
    //   if (!paymentType) {
    //     localStorage.setItem("paymentType", 1);
    //   }
    // }, []);

    //  verify
    const mutationVerify = useMutation({
      mutationFn: ({ body }) => checkVerify(body),
      onSuccess: (res) => {
        setOTPverifyModal(true);
        toastAlert('success', res?.data?.message);
      },
    });

    const formik = useFormik({
      initialValues: {
        otp: '',
      },
      validationSchema: yup.object().shape({
        otp: yup.string().required().label('OTP').length(4),
      }),
      onSubmit: (values) => {
        let body = {
          otp: values?.otp,
          email: details?.email,
        };

        verifyOTPMutation(body);
      },
    });

    const { mutate: verifyOTPMutation } = useMutation({
      mutationFn: (body) => verifyOTPByLogin(body),
      onSuccess: (resp) => {
        toastAlert('success', resp?.data?.message);
        Cookies.set('userDetail', JSON.stringify(resp?.data?.data), {
          expires: 7,
        });

        dispatch(userDetails(resp?.data?.data));
        setShowVerify(false);
        formik.resetForm();
        handleSubmit();
        setOTPverifyModal(false);
      },
      onError: (err) => {
        toastAlert('error', err?.response?.data?.message);
        formik.resetForm();
        setSelectedOption('');
        setShowVerify(false);

        setOTPverifyModal(false);
      },
    });

    const { mutate: resendOTPMutation } = useMutation({
      mutationFn: (body) => resendOTPByOrder(body),
      onSuccess: (resp) => {
        toastAlert('success', resp?.data?.message);
        setSelectedOption('');
        setNewIsActive(true); // Activate the timer after OTP resend
      },
    });

    const [newTimer, setNewTimer] = useState(60); // Initial timer value (seconds)
    const [newIsActive, setNewIsActive] = useState(false); // Timer activation flag

    const handleClick = () => {
      resendOTPMutation({
        email: details?.email,
        type: selectedOption,
      });
      setNewIsActive(true);
    };

    useEffect(() => {
      let intervalId;
      if (newIsActive) {
        intervalId = setInterval(() => {
          setNewTimer((prevTimer) => prevTimer - 1);
        }, 1000);
      }
      return () => clearInterval(intervalId); // Cleanup on component unmount or timer reset
    }, [newIsActive]);

    useEffect(() => {
      if (newTimer === 0) {
        setNewIsActive(false); // Deactivate timer when it reaches 0
        setNewTimer(60); // Reset timer value
      }
    }, [newTimer]);

    useImperativeHandle(ref, () => ({
      handleSubmit: () => {
        handleSubmit();
      },
    }));

    return (
      <>
        {cartListing?.cartList?.length > 0 ? (
          <div className='cart-items'>
            <div className='cart-body'>
              <h6>Price Details ({cartListing?.cartList?.length ?? 0}) </h6>
              <ul>
                <li>
                  <p>Bag </p>
                  <span className='notranslate'>
                    {/* {formatCurrency((cartListing?.total ?? 0) - (cartListing?.charge ?? 0))} */}
                    {formatCurrency(cartListing?.subTotal, selectedCountry)}
                  </span>
                </li>
                {keyId == 2 || keyId == 3 ? (
                  ''
                ) : (
                  <li>
                    <p>Delivery </p>
                    <span className='notranslate'>
                      {formatCurrency(
                        cartListing?.charge?.toFixed(2) ?? 0,
                        selectedCountry
                      )}{' '}
                    </span>
                  </li>
                )}

                {cartListing?.cartList?.at(0)?.promoDetails?.discount &&
                cartListing?.cartList?.at(0)?.promoDetails?.actionType == 1 ? (
                  <li>
                    <p>Promocode Discount (%)</p>
                    <span className='text-orange'>
                      -{cartListing?.cartList?.at(0)?.promoDetails?.discount}%
                    </span>
                  </li>
                ) : (
                  ''
                )}

                {cartListing?.cashBack ? (
                  <li>
                    <p>Cashback </p>
                    <span className='text-orange'>
                      {formatCurrency(cartListing?.cashBack, selectedCountry)}
                    </span>
                  </li>
                ) : (
                  ''
                )}

                {/* {cartListing?.cartList?.at(0)?.promoDetails?.discount ? ( */}
                <li>
                  <p>Sub Total </p>
                  <span className='notranslate'>
                    {/* KD  */}
                    {formatCurrency(
                      cartListing?.orderTotal?.toFixed(2),
                      selectedCountry
                    )}
                  </span>
                </li>
                {/* ) : (
                ""
              )} */}

                {pathName == '/payment' && walletUse ? (
                  <li>
                    <p>Wallet Amount </p>
                    <span className='text-orange notranslate'>
                      -{formatCurrency(walletAmount ?? 0, selectedCountry)}
                    </span>
                  </li>
                ) : (
                  ''
                )}
              </ul>
            </div>

            <div className='cart-bottom'>
              <div className='d-flex align-items-center justify-content-between'>
                <h6 className='fw-bold'>Total</h6>

                <p className='fw-bold mb-0 text-black'>
                  {formatCurrency(
                    pathName == '/payment' && walletUse
                      ? cartListing?.total - walletAmount
                      : FORMAT_NUMBER(cartListing?.total),
                    selectedCountry
                  )}
                </p>
              </div>
              {/* <span>Taxes and shipping calculated at checkout</span> */}
            </div>

            <div className='coupon-box'>
              {details == null || details == undefined ? (
                ''
              ) : (
                <h6>Promocode</h6>
              )}
              <ul>
                {/* <li>
                  <input
                    type="text"
                    placeholder="Apply Promocode"
                    value={promoCode}
                    onChange={(e) => {
                      const uppercaseValue = e.target.value.toUpperCase();
                      setPromoCode(uppercaseValue);
                    }}
                  />

                  <a
                    hrfe="#"
                    onClick={() => {
                      if (!promoCode) {
                        toastAlert(
                          "error",
                          "Please select a promocode to apply."
                        );
                      } else {
                        // refetch();
                        localStorage.setItem("promocode", promoCode);
                        queryClient.invalidateQueries({
                          queryKey: ["cart-list-user"],
                        });
                      }
                    }}
                    className=" btn btn-outline-orange rounded w-100 mt-4"
                  >
                    Apply{" "}
                  </a>
                </li> */}
                {details == null || details == undefined ? (
                  ''
                ) : (
                  <li>
                    <div className='promo-code-input position-relative'>
                      <input
                        type='text'
                        placeholder='Apply Promocode'
                        value={promoCode || promoCodeState || ''} // Use promoCode if available, otherwise use promoCodeState
                        onChange={(e) => {
                          const uppercaseValue = e.target.value.toUpperCase();
                          setPromoCode(uppercaseValue); // Update promoCode state as user types
                        }}
                      />
                      {promoCodeState && (
                        <button
                          type='button'
                          className='clear-button'
                          onClick={() => {
                            setPromoCode(''); // Clear the promo code state
                            localStorage.removeItem('promocode');
                            setPromoRemove(true);
                            // setTimeout(() => {
                            queryClient.invalidateQueries({
                              queryKey: ['cart-list-user'],
                            });
                            // }, 100);
                          }}
                          aria-label='Clear promo code'
                        >
                          <MdCancel
                            style={{ color: '#ff0000', fontSize: '1.5rem' }}
                          />
                        </button>
                      )}
                    </div>
                    {cartListing?.cartList?.at(0)?.promoDetails?.discount &&
                    cartListing?.cartList?.at(0)?.promoDetails?.actionType ==
                      1 ? (
                      <p>
                        Note: You can receive a maximum discount of &nbsp;
                        <span className='notranslate'>
                          {formatCurrency('', selectedCountry)}
                        </span>
                        {
                          cartListing?.cartList?.at(0)?.promoDetails
                            ?.maxDiscountAmount
                        }
                      </p>
                    ) : (
                      ''
                    )}

                    {!promoCodeState ? (
                      <button
                        onClick={() => {
                          if (!promoCode) {
                            toastAlert(
                              'error',
                              'Please select a promocode to apply.'
                            );
                          } else {
                            localStorage.setItem('promocode', promoCode);
                            localStorage.setItem('promoMsg', true);
                            queryClient.invalidateQueries({
                              queryKey: ['cart-list-user'],
                            });
                          }
                        }}
                        className='btn btn-outline-orange rounded w-100 mt-4'
                      >
                        Apply
                      </button>
                    ) : (
                      ''
                    )}
                  </li>
                )}

                <li>
                  <button
                    onClick={(e) => {
                      e.preventDefault();

                      if (details === null || details === undefined) {
                        Swal.fire({
                          title: 'You need to login to checkout',
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
                              )}&isCart=${true}&deviceToken=${encodeURIComponent(
                                getDeviceToken()
                              )}`
                            );
                          }
                        });
                      } else {
                        if (details?.isVerified == true) {
                          // cartProductQuantityData();

                          handleSubmit();
                          setShowVerify(false);
                        } else {
                          setShowVerify(true);
                        }
                      }
                    }}
                    disabled={resendOTPMutation?.isLoading}
                    className='btn btn-theme rounded w-100 mt-4 text-capitalize'
                  >
                    checkout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          ''
        )}
        {isLoading || paymentPending || isPending ? <Loading /> : null}

        {showVerify && (
          <Modal show={showVerify} centered onHide={() => setShowVerify(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Verify OTP</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {!otpVerifyModal && (
                <>
                  <form>
                    <div>
                      <label>
                        <input
                          type='radio'
                          value={1}
                          checked={selectedOption == 1}
                          onChange={() => setSelectedOption(1)}
                        />
                        WhatsApp
                      </label>
                    </div>
                    <div>
                      <label>
                        <input
                          type='radio'
                          value={2}
                          checked={selectedOption == 2}
                          onChange={() => setSelectedOption(2)}
                        />
                        SMS
                      </label>
                    </div>
                  </form>

                  <Modal.Footer>
                    <button
                      className='btn btn-theme mt-3'
                      onClick={handleClose}
                    >
                      Close
                    </button>
                    <button
                      className='btn btn-theme mt-3'
                      onClick={(e) => {
                        e.preventDefault();

                        let body = {
                          type: selectedOption,
                        };
                        mutationVerify.mutate({
                          body,
                        });
                      }}
                      disabled={!selectedOption}
                    >
                      Submit
                    </button>
                  </Modal.Footer>
                </>
              )}

              {!!otpVerifyModal && (
                <>
                  <h6>
                    Account not verify, OTP send on your register mobile.
                    Kindly, verify your account.
                  </h6>
                  <Form>
                    <Row className='align-items-center'>
                      <Col lg={12}>
                        <Form.Group className=''>
                          <OTPInput
                            value={formik?.values?.otp}
                            onChange={(e) => formik.setFieldValue('otp', e)}
                            numInputs={4}
                            renderSeparator={<span>-</span>}
                            inputType='number'
                            renderInput={(props) => <input {...props} />}
                            containerStyle={'otp-input'}
                          />
                          <p className='text-danger mt-3 text-center mb-0'>
                            {formik?.errors.otp}
                          </p>
                        </Form.Group>
                      </Col>
                      <div className='d-flex align-items-center justify-content-center flex-column gap-3'>
                        {newIsActive ? (
                          <span>Resend OTP in {newTimer} seconds</span>
                        ) : (
                          <span
                            onClick={handleClick}
                            className='fs-5 mt-4 mb-3'
                            style={{ cursor: 'pointer' }}
                          >
                            Resend OTP
                          </span>
                        )}

                        <button
                          type='button'
                          onClick={formik.handleSubmit}
                          className='btn btn-theme w-100'
                        >
                          Verify
                        </button>
                      </div>
                    </Row>
                  </Form>
                </>
              )}
            </Modal.Body>
          </Modal>
        )}
        {mutation.isPending || cartPending ? <Loading /> : null}
      </>
    );
  }
);
export default CartPriceDetails;
