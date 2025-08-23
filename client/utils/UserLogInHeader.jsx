import { useMutation, useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  Button,
  Container,
  Dropdown,
  Form,
  Nav,
  Navbar,
  Offcanvas,
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import useCountryState from '../hooks/useCountryState';
import useDetails from '../hooks/useDetails';
import userDummyImage from '../public/assets/img/default.png';
import { country } from '../redux/features/CountrySlice';
import { clearCart } from '../redux/features/cartSlice';
import { logoutUser } from '../redux/features/userSlice';
import { logOut, USER_CART } from '../services/APIServices';
import '../src/app/(customer)/dashboard/page.scss';
import { toastAlert } from './SweetAlert';
import TranslateWidget from './TranslateWidget';
import { formatCurrency } from './helper';
import { trans } from './trans';
import { FaBars } from 'react-icons/fa6';

const UserLogInHeader = ({ params, scrollToTestimonial, refetchAPI }) => {
  let dispatch = useDispatch();
  let detail = useDetails();

  const selectedCountry = useCountryState();

  const { data: cartListing, refetch } = useQuery({
    queryKey: ['cart-list-user'],
    queryFn: async () => {
      const resp = await USER_CART();
      if (resp?.data?.data?.cartCount == 0) {
        dispatch(clearCart(null));
        localStorage.removeItem('persist:cart');
        Cookies.remove('cartItems');
      }
      return resp?.data?.data ?? [];
    },
  });

  let router = useRouter();
  let pathName = usePathname();
  function removeAllCookies() {
    // Get all cookies
    const allCookies = Cookies.get();

    // Loop through each cookie and remove it
    for (const cookie in allCookies) {
      Cookies.remove(cookie);
    }
  }
  const logoutMutation = useMutation({
    mutationFn: () => logOut(),
    onSuccess: () => {
      signOut();
      toastAlert('success', 'Logout Successfully');
      removeAllCookies();
      localStorage.clear();
      sessionStorage.clear();
      dispatch(logoutUser(null));
      dispatch(clearCart(null));

      router.push(`/login`);
    },
  });
  const searchParams = useSearchParams();
  let searchProduct = searchParams?.get('search');
  const [search, setSearch] = useState(searchProduct);

  const handleSearch = (e) => {
    e.preventDefault();
    if (pathName == '/product-grid') {
      router.push(`/product-grid?search=${search}`);
    } else if (pathName == '/companies') {
      router.push(`/companies?search=${search}`);
    } else if (pathName == '/best-seller') {
      router.push(`/best-seller?search=${search}`);
    } else {
      router.push(`/product-list?search=${search}`);
    }
  };

  const [showOne, setShowOne] = useState(false);
  const handleCloseOne = () => setShowOne(false);
  const handleShowOne = () => setShowOne(true);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const redirectToWhatsApp = (phoneNumber) => {
    const url = `https://wa.me/${phoneNumber}`;
    window.open(url, '_blank');
  };

  const searchTrans = trans('search');
  const translations = {
    en: {
      home: 'Home',
      testimonials: 'Testimonials',
    },
    ar: {
      home: 'الرئيسية',
      testimonials: 'الشهادات',
    },
  };

  let language = localStorage.getItem('language');
  const languageCode = language && language.startsWith('Arabic') ? 'ar' : 'en';
  const { home: homeText, testimonials: testimonialsTest } =
    translations[languageCode];

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    dispatch(country(selectedCountry));
    refetchAPI();
  };

  return (
    <>
      <div className='topbar d-lg-block'>
        <Container>
          <div className='d-flex justify-content-between py-3 align-items-center gap-2'>
            <Navbar.Brand href='/'>
              <Image
                src={`/assets/img/logo.png`}
                height={57}
                width={145}
                alt='logo'
              />
            </Navbar.Brand>
            <div className='searchbar mx-3 d-lg-block d-none'>
              <Form className='d-flex'>
                <Form.Control
                  type='search'
                  placeholder={searchTrans}
                  className='me-0'
                  aria-label='Search'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key == 'Enter' && handleSearch(e)}
                  onKeyUp={(e) => e.target.value == '' && handleSearch(e)}
                />
                <Button
                  variant='outline-success'
                  onClick={(e) => {
                    e.preventDefault();
                    handleSearch(e);
                  }}
                >
                  <svg
                    width='17'
                    height='17'
                    viewBox='0 0 17 17'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M16.3033 14.9498L13.1953 11.8418C14.1372 10.6088 14.6538 9.11312 14.654 7.53489C14.654 5.63297 13.9133 3.84475 12.5682 2.4999C11.2234 1.15505 9.43537 0.414307 7.53321 0.414307C5.63128 0.414307 3.84306 1.15505 2.49821 2.4999C-0.278051 5.2764 -0.278051 9.79385 2.49821 12.5699C3.84306 13.915 5.63128 14.6557 7.53321 14.6557C9.11144 14.6555 10.6071 14.1389 11.8402 13.197L14.9481 16.305C15.1351 16.4921 15.3805 16.5857 15.6257 16.5857C15.8709 16.5857 16.1163 16.4921 16.3033 16.305C16.6776 15.9308 16.6776 15.3239 16.3033 14.9498ZM3.85336 11.2147C1.82439 9.18577 1.82462 5.88425 3.85336 3.85504C4.83626 2.87238 6.1432 2.33097 7.53321 2.33097C8.92345 2.33097 10.2302 2.87238 11.2131 3.85504C12.196 4.83794 12.7374 6.14489 12.7374 7.53489C12.7374 8.92513 12.196 10.2318 11.2131 11.2147C10.2302 12.1976 8.92345 12.739 7.53321 12.739C6.1432 12.739 4.83626 12.1976 3.85336 11.2147Z'
                      fill='white'
                    />
                  </svg>
                </Button>
              </Form>
            </div>

            <div className='header-right-profile d-flex align-items-center gap-3'>
              <Link className='position-relative' href='/cart'>
                {' '}
                {cartListing?.cartCount > 0 ? (
                  <span className='cart-count'>{cartListing?.cartCount}</span>
                ) : (
                  ''
                )}
                <svg
                  width='22'
                  height='22'
                  viewBox='0 0 22 22'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <g clip-path='url(#clip0_25_3171)'>
                    <path
                      d='M7.08816 14.2228H7.08917C7.09001 14.2228 7.09085 14.2226 7.09169 14.2226H18.7773C19.065 14.2226 19.318 14.0318 19.397 13.7552L21.9751 4.73176C22.0307 4.53723 21.9918 4.32809 21.8701 4.16662C21.7482 4.00516 21.5577 3.91015 21.3555 3.91015H5.60171L5.14097 1.83675C5.07535 1.54184 4.81384 1.33203 4.51172 1.33203H0.644531C0.288528 1.33203 0 1.62056 0 1.97656C0 2.33256 0.288528 2.62109 0.644531 2.62109H3.99475C4.07632 2.98851 6.19958 12.5433 6.32177 13.093C5.63679 13.3908 5.15625 14.0738 5.15625 14.8672C5.15625 15.9333 6.02368 16.8008 7.08984 16.8008H18.7773C19.1333 16.8008 19.4219 16.5122 19.4219 16.1562C19.4219 15.8002 19.1333 15.5117 18.7773 15.5117H7.08984C6.73451 15.5117 6.44531 15.2225 6.44531 14.8672C6.44531 14.5124 6.7335 14.2237 7.08816 14.2228ZM20.5009 5.19922L18.2911 12.9336H7.60681L5.88806 5.19922H20.5009Z'
                      fill='#343434'
                    />
                    <path
                      d='M6.44531 18.7344C6.44531 19.8005 7.31274 20.668 8.37891 20.668C9.44507 20.668 10.3125 19.8005 10.3125 18.7344C10.3125 17.6682 9.44507 16.8008 8.37891 16.8008C7.31274 16.8008 6.44531 17.6682 6.44531 18.7344ZM8.37891 18.0898C8.73424 18.0898 9.02344 18.379 9.02344 18.7344C9.02344 19.0897 8.73424 19.3789 8.37891 19.3789C8.02357 19.3789 7.73437 19.0897 7.73437 18.7344C7.73437 18.379 8.02357 18.0898 8.37891 18.0898Z'
                      fill='#343434'
                    />
                    <path
                      d='M15.5547 18.7344C15.5547 19.8005 16.4221 20.668 17.4883 20.668C18.5544 20.668 19.4219 19.8005 19.4219 18.7344C19.4219 17.6682 18.5544 16.8008 17.4883 16.8008C16.4221 16.8008 15.5547 17.6682 15.5547 18.7344ZM17.4883 18.0898C17.8436 18.0898 18.1328 18.379 18.1328 18.7344C18.1328 19.0897 17.8436 19.3789 17.4883 19.3789C17.1329 19.3789 16.8437 19.0897 16.8437 18.7344C16.8437 18.379 17.1329 18.0898 17.4883 18.0898Z'
                      fill='#343434'
                    />
                  </g>
                  <defs>
                    <clipPath id='clip0_25_3171'>
                      <rect width='22' height='22' fill='white' />
                    </clipPath>
                  </defs>
                </svg>
              </Link>

              <Link href='/wishlist'>
                <svg
                  width='22'
                  height='22'
                  viewBox='0 0 22 22'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M11 20C10.7153 20 10.4408 19.8957 10.2268 19.7061C9.41888 18.9914 8.63992 18.3198 7.95267 17.7274L7.94916 17.7243C5.93423 15.9873 4.19427 14.4873 2.98364 13.0096C1.63034 11.3576 1 9.79138 1 8.08032C1 6.41788 1.56351 4.88418 2.58661 3.76153C3.62192 2.62561 5.04251 2 6.58716 2C7.74164 2 8.79892 2.36922 9.72955 3.09733C10.1992 3.46486 10.6249 3.91466 11 4.43932C11.3752 3.91466 11.8008 3.46486 12.2706 3.09733C13.2012 2.36922 14.2585 2 15.413 2C16.9575 2 18.3782 2.62561 19.4135 3.76153C20.4366 4.88418 21 6.41788 21 8.08032C21 9.79138 20.3698 11.3576 19.0165 13.0094C17.8059 14.4873 16.0661 15.9872 14.0515 17.724C13.363 18.3173 12.5828 18.99 11.773 19.7064C11.5592 19.8957 11.2846 20 11 20ZM6.58716 3.18516C5.37363 3.18516 4.25882 3.67509 3.44781 4.56481C2.62476 5.46796 2.17142 6.71641 2.17142 8.08032C2.17142 9.5194 2.70013 10.8064 3.88559 12.2534C5.03137 13.652 6.73563 15.1212 8.70889 16.8224L8.71255 16.8255C9.4024 17.4202 10.1844 18.0944 10.9983 18.8144C11.8171 18.0931 12.6003 17.4177 13.2916 16.8221C15.2647 15.1209 16.9688 13.652 18.1146 12.2534C19.2999 10.8064 19.8286 9.5194 19.8286 8.08032C19.8286 6.71641 19.3752 5.46796 18.5522 4.56481C17.7413 3.67509 16.6264 3.18516 15.413 3.18516C14.524 3.18516 13.7078 3.47103 12.9872 4.03475C12.3449 4.53734 11.8975 5.17268 11.6352 5.61723C11.5003 5.84583 11.2629 5.98228 11 5.98228C10.7371 5.98228 10.4997 5.84583 10.3648 5.61723C10.1026 5.17268 9.65524 4.53734 9.01285 4.03475C8.29218 3.47103 7.47598 3.18516 6.58716 3.18516Z'
                    fill='#343434'
                  />
                </svg>
                <span className='wishlist-text'> &nbsp;Wishlist</span>
              </Link>
              <div className='form-group position-relative selectform mb-0'>
                <Form.Select
                  onChange={handleCountryChange}
                  value={selectedCountry}
                  disabled={selectedCountry}
                >
                  <option value={'Kuwait'}>Kuwait</option>

                  <option value={'Jordan'}>Jordan</option>
                  <option value={'United Arab Emirates'}>UAE</option>
                </Form.Select>
              </div>
              <TranslateWidget />
              <Dropdown>
                <Dropdown.Toggle id='dropdown-basic'>
                  <Image
                    className='img-fluid'
                    src={
                      detail?.profileImg ? detail?.profileImg : userDummyImage
                    }
                    height={100}
                    width={100}
                    alt='profile-img'
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      router.push('/dashboard');
                    }}
                  >
                    Dashboard
                  </Dropdown.Item>
                  <Dropdown.Item
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      router.push('/profile');
                    }}
                  >
                    profile
                  </Dropdown.Item>
                  <Dropdown.Item
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      router.push('/change-password');
                    }}
                  >
                    change password
                  </Dropdown.Item>
                  <Dropdown.Item
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      logoutMutation.mutate();
                    }}
                  >
                    log out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <div className='searchbar mx-3 d-lg-none d-block mb-3'>
            <Form className='d-flex'>
              <Form.Control
                type='search'
                placeholder={searchTrans}
                className='me-0'
                aria-label='Search'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key == 'Enter' && handleSearch(e)}
                onKeyUp={(e) => e.target.value == '' && handleSearch(e)}
              />
              <Button
                variant='outline-success'
                onClick={(e) => {
                  e.preventDefault();
                  handleSearch(e);
                }}
              >
                <svg
                  width='17'
                  height='17'
                  viewBox='0 0 17 17'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M16.3033 14.9498L13.1953 11.8418C14.1372 10.6088 14.6538 9.11312 14.654 7.53489C14.654 5.63297 13.9133 3.84475 12.5682 2.4999C11.2234 1.15505 9.43537 0.414307 7.53321 0.414307C5.63128 0.414307 3.84306 1.15505 2.49821 2.4999C-0.278051 5.2764 -0.278051 9.79385 2.49821 12.5699C3.84306 13.915 5.63128 14.6557 7.53321 14.6557C9.11144 14.6555 10.6071 14.1389 11.8402 13.197L14.9481 16.305C15.1351 16.4921 15.3805 16.5857 15.6257 16.5857C15.8709 16.5857 16.1163 16.4921 16.3033 16.305C16.6776 15.9308 16.6776 15.3239 16.3033 14.9498ZM3.85336 11.2147C1.82439 9.18577 1.82462 5.88425 3.85336 3.85504C4.83626 2.87238 6.1432 2.33097 7.53321 2.33097C8.92345 2.33097 10.2302 2.87238 11.2131 3.85504C12.196 4.83794 12.7374 6.14489 12.7374 7.53489C12.7374 8.92513 12.196 10.2318 11.2131 11.2147C10.2302 12.1976 8.92345 12.739 7.53321 12.739C6.1432 12.739 4.83626 12.1976 3.85336 11.2147Z'
                    fill='white'
                  />
                </svg>
              </Button>
            </Form>
          </div>

          <Navbar className='bg-white'>
            <Container>
              <Navbar.Toggle aria-controls='navbarScroll' />
              <Navbar.Collapse id='navbarScroll' class='d-lg-block d-none'>
                <Nav className='me-auto ms-0 my-2 my-lg-0' navbarScroll>
                  <Link className='nav-link ps-lg-0' href='/'>
                    {homeText}
                  </Link>

                  <Link className='nav-link' href='/about-us'>
                    About Us
                  </Link>
                  <Link className='nav-link' href='/best-seller'>
                    Best Sellers
                  </Link>
                  <Link className='nav-link' href='/product-list'>
                    All Products
                  </Link>
                  <Link className='nav-link' href='/companies'>
                    Companies
                  </Link>
                  {pathName == '/' ? (
                    <Link
                      className='nav-link'
                      href='#'
                      onClick={scrollToTestimonial}
                    >
                      {testimonialsTest}
                    </Link>
                  ) : (
                    ''
                  )}
                </Nav>
              </Navbar.Collapse>
              <div className='d-lg-none d-block' onClick={handleShow}>
                <FaBars />
              </div>
              {localStorage.getItem('offarat-contact') ? (
                <Link
                  href='#'
                  onClick={() =>
                    redirectToWhatsApp(localStorage.getItem('offarat-contact'))
                  }
                  dir='ltr'
                >
                  <svg
                    width='22'
                    height='22'
                    viewBox='0 0 22 22'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <g clip-path='url(#clip0_25_3179)'>
                      <path
                        d='M11 1.28906C13.2406 1.28997 15.412 2.06545 17.1463 3.48411C18.8806 4.90278 20.0711 6.87739 20.5161 9.07336C20.9611 11.2693 20.6333 13.5516 19.5881 15.5336C18.5429 17.5155 16.8447 19.0751 14.7812 19.9482C12.408 20.9511 9.73363 20.9701 7.34639 20.0011C4.95914 19.0321 3.05461 17.1545 2.05176 14.7812C1.04891 12.408 1.02989 9.73363 1.99889 7.34639C2.96789 4.95914 4.84553 3.05461 7.21875 2.05176C8.41496 1.54554 9.70109 1.28613 11 1.28906ZM11 0C4.92508 0 0 4.92508 0 11C0 17.0749 4.92508 22 11 22C17.0749 22 22 17.0749 22 11C22 4.92508 17.0749 0 11 0Z'
                        fill='#343434'
                      />
                      <path
                        d='M14.2094 16.9241C13.5705 16.8811 12.6699 16.6607 11.7907 16.3462C8.69097 15.2367 5.6664 12.2809 5.02359 8.14644C4.90929 7.41038 5.02961 6.73792 5.58734 6.1905C5.77425 6.00745 5.94054 5.80378 6.12316 5.61644C6.81066 4.90874 7.81527 4.8907 8.52726 5.57046C8.75285 5.78531 8.9823 5.99714 9.2023 6.21886C9.50356 6.51594 9.67798 6.9182 9.68896 7.34116C9.69994 7.76411 9.54661 8.17487 9.26117 8.48718C9.08929 8.67796 8.90882 8.85929 8.7275 9.04019C8.52941 9.23785 8.2832 9.35128 8.01894 9.43378C7.69281 9.53605 7.63222 9.67269 7.78047 9.98421C8.71718 11.9462 10.1834 13.3588 12.1792 14.2222C12.446 14.3374 12.5693 14.2854 12.6768 14.0207C12.9122 13.4402 13.3441 13.0169 13.8403 12.6749C14.4019 12.2882 15.2063 12.3741 15.7383 12.8313C16.0299 13.0819 16.3086 13.3473 16.5732 13.6262C16.8579 13.9308 17.016 14.3323 17.0156 14.7492C17.0152 15.1662 16.8563 15.5673 16.571 15.8714C16.4881 15.9616 16.4026 16.0497 16.3231 16.1425C15.8444 16.6989 15.2373 16.9593 14.2094 16.9241Z'
                        fill='#343434'
                      />
                    </g>
                    <defs>
                      <clipPath id='clip0_25_3179'>
                        <rect width='22' height='22' fill='white' />
                      </clipPath>
                    </defs>
                  </svg>
                  &nbsp;{localStorage.getItem('offarat-contact')}
                </Link>
              ) : (
                ''
              )}
            </Container>
          </Navbar>
        </Container>
      </div>

      {/* For Mobile */}
      {/* <div className="d-block d-lg-none">
        <div className="topbar py-3">
          <Container>
            <div className="d-flex align-items-center justify-content-between">
              <Navbar.Brand href="/">
                <Image
                  src={`/assets/img/logo.png`}
                  height={45}
                  width={120}
                  alt="logo"
                />
              </Navbar.Brand>
              <div className="header-right-profile d-flex align-items-center gap-2">
                <Link className="position-relative me-2" href="/cart">
                  {" "}
                  {cartListing?.cartCount > 0 ? (
                    <span className="cart-count">{cartListing?.cartCount}</span>
                  ) : (
                    ""
                  )}
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_25_3171)">
                      <path
                        d="M7.08816 14.2228H7.08917C7.09001 14.2228 7.09085 14.2226 7.09169 14.2226H18.7773C19.065 14.2226 19.318 14.0318 19.397 13.7552L21.9751 4.73176C22.0307 4.53723 21.9918 4.32809 21.8701 4.16662C21.7482 4.00516 21.5577 3.91015 21.3555 3.91015H5.60171L5.14097 1.83675C5.07535 1.54184 4.81384 1.33203 4.51172 1.33203H0.644531C0.288528 1.33203 0 1.62056 0 1.97656C0 2.33256 0.288528 2.62109 0.644531 2.62109H3.99475C4.07632 2.98851 6.19958 12.5433 6.32177 13.093C5.63679 13.3908 5.15625 14.0738 5.15625 14.8672C5.15625 15.9333 6.02368 16.8008 7.08984 16.8008H18.7773C19.1333 16.8008 19.4219 16.5122 19.4219 16.1562C19.4219 15.8002 19.1333 15.5117 18.7773 15.5117H7.08984C6.73451 15.5117 6.44531 15.2225 6.44531 14.8672C6.44531 14.5124 6.7335 14.2237 7.08816 14.2228ZM20.5009 5.19922L18.2911 12.9336H7.60681L5.88806 5.19922H20.5009Z"
                        fill="#343434"
                      />
                      <path
                        d="M6.44531 18.7344C6.44531 19.8005 7.31274 20.668 8.37891 20.668C9.44507 20.668 10.3125 19.8005 10.3125 18.7344C10.3125 17.6682 9.44507 16.8008 8.37891 16.8008C7.31274 16.8008 6.44531 17.6682 6.44531 18.7344ZM8.37891 18.0898C8.73424 18.0898 9.02344 18.379 9.02344 18.7344C9.02344 19.0897 8.73424 19.3789 8.37891 19.3789C8.02357 19.3789 7.73437 19.0897 7.73437 18.7344C7.73437 18.379 8.02357 18.0898 8.37891 18.0898Z"
                        fill="#343434"
                      />
                      <path
                        d="M15.5547 18.7344C15.5547 19.8005 16.4221 20.668 17.4883 20.668C18.5544 20.668 19.4219 19.8005 19.4219 18.7344C19.4219 17.6682 18.5544 16.8008 17.4883 16.8008C16.4221 16.8008 15.5547 17.6682 15.5547 18.7344ZM17.4883 18.0898C17.8436 18.0898 18.1328 18.379 18.1328 18.7344C18.1328 19.0897 17.8436 19.3789 17.4883 19.3789C17.1329 19.3789 16.8437 19.0897 16.8437 18.7344C16.8437 18.379 17.1329 18.0898 17.4883 18.0898Z"
                        fill="#343434"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_25_3171">
                        <rect width="22" height="22" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </Link>
                <Link href="/wishlist">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 20C10.7153 20 10.4408 19.8957 10.2268 19.7061C9.41888 18.9914 8.63992 18.3198 7.95267 17.7274L7.94916 17.7243C5.93423 15.9873 4.19427 14.4873 2.98364 13.0096C1.63034 11.3576 1 9.79138 1 8.08032C1 6.41788 1.56351 4.88418 2.58661 3.76153C3.62192 2.62561 5.04251 2 6.58716 2C7.74164 2 8.79892 2.36922 9.72955 3.09733C10.1992 3.46486 10.6249 3.91466 11 4.43932C11.3752 3.91466 11.8008 3.46486 12.2706 3.09733C13.2012 2.36922 14.2585 2 15.413 2C16.9575 2 18.3782 2.62561 19.4135 3.76153C20.4366 4.88418 21 6.41788 21 8.08032C21 9.79138 20.3698 11.3576 19.0165 13.0094C17.8059 14.4873 16.0661 15.9872 14.0515 17.724C13.363 18.3173 12.5828 18.99 11.773 19.7064C11.5592 19.8957 11.2846 20 11 20ZM6.58716 3.18516C5.37363 3.18516 4.25882 3.67509 3.44781 4.56481C2.62476 5.46796 2.17142 6.71641 2.17142 8.08032C2.17142 9.5194 2.70013 10.8064 3.88559 12.2534C5.03137 13.652 6.73563 15.1212 8.70889 16.8224L8.71255 16.8255C9.4024 17.4202 10.1844 18.0944 10.9983 18.8144C11.8171 18.0931 12.6003 17.4177 13.2916 16.8221C15.2647 15.1209 16.9688 13.652 18.1146 12.2534C19.2999 10.8064 19.8286 9.5194 19.8286 8.08032C19.8286 6.71641 19.3752 5.46796 18.5522 4.56481C17.7413 3.67509 16.6264 3.18516 15.413 3.18516C14.524 3.18516 13.7078 3.47103 12.9872 4.03475C12.3449 4.53734 11.8975 5.17268 11.6352 5.61723C11.5003 5.84583 11.2629 5.98228 11 5.98228C10.7371 5.98228 10.4997 5.84583 10.3648 5.61723C10.1026 5.17268 9.65524 4.53734 9.01285 4.03475C8.29218 3.47103 7.47598 3.18516 6.58716 3.18516Z"
                      fill="#343434"
                    />
                  </svg>
                </Link>

                <div className="form-group position-relative selectform mb-0">
                  <Form.Select
                    onChange={handleCountryChange}
                    value={selectedCountry}
                  >
                    
                    <option value={"Kuwait"}>Kuwait</option>

                    <option value={"Jordan"}>Jordan</option>
                    <option value={"UAE"}>UAE</option>
                  </Form.Select>
                </div>

                <TranslateWidget />
                <span className="menu_btn" onClick={handleShow}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    fill="currentColor"
                    class="bi bi-list"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
                    />
                  </svg>
                </span>
                <Dropdown>
                  <Dropdown.Toggle id="dropdown-basic">
                    <Image
                      className="img-fluid"
                      src={
                        detail?.profileImg ? detail?.profileImg : userDummyImage
                      }
                      height={100}
                      width={100}
                      alt="profile-img"
                    />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push("/dashboard");
                      }}
                    >
                      Dashboard
                    </Dropdown.Item>
                    <Dropdown.Item
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push("/profile");
                      }}
                    >
                      profile
                    </Dropdown.Item>
                    <Dropdown.Item
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push("/change-password");
                      }}
                    >
                      change password
                    </Dropdown.Item>
                    <Dropdown.Item
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        logoutMutation.mutate();
                      }}
                    >
                      log out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>

            <div className="searchbar mt-3 mx-3">
              <Form className="d-flex justify-content-center">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-0 w-100"
                  aria-label="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key == "Enter" && handleSearch(e)}
                  onKeyUp={(e) => e.target.value == "" && handleSearch(e)}
                />
                <Button
                  variant="outline-success"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSearch(e);
                  }}
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.3033 14.9498L13.1953 11.8418C14.1372 10.6088 14.6538 9.11312 14.654 7.53489C14.654 5.63297 13.9133 3.84475 12.5682 2.4999C11.2234 1.15505 9.43537 0.414307 7.53321 0.414307C5.63128 0.414307 3.84306 1.15505 2.49821 2.4999C-0.278051 5.2764 -0.278051 9.79385 2.49821 12.5699C3.84306 13.915 5.63128 14.6557 7.53321 14.6557C9.11144 14.6555 10.6071 14.1389 11.8402 13.197L14.9481 16.305C15.1351 16.4921 15.3805 16.5857 15.6257 16.5857C15.8709 16.5857 16.1163 16.4921 16.3033 16.305C16.6776 15.9308 16.6776 15.3239 16.3033 14.9498ZM3.85336 11.2147C1.82439 9.18577 1.82462 5.88425 3.85336 3.85504C4.83626 2.87238 6.1432 2.33097 7.53321 2.33097C8.92345 2.33097 10.2302 2.87238 11.2131 3.85504C12.196 4.83794 12.7374 6.14489 12.7374 7.53489C12.7374 8.92513 12.196 10.2318 11.2131 11.2147C10.2302 12.1976 8.92345 12.739 7.53321 12.739C6.1432 12.739 4.83626 12.1976 3.85336 11.2147Z"
                      fill="white"
                    />
                  </svg>
                </Button>
              </Form>
            </div>
          </Container>
        </div>
      </div> */}
      {/* Mobile Menu */}
      {/*  */}

      <Offcanvas show={showOne} onHide={handleCloseOne}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Offcanvas</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          Some text as placeholder. In real life you can have the elements you
          have chosen. Like, text, images, lists, etc.
        </Offcanvas.Body>
      </Offcanvas>
      {/*  */}

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Navbar className='d-block'>
            <Nav className='flex-column m-0'>
              <Nav.Link href='/' className='ps-lg-0'>
                {homeText}
              </Nav.Link>

              <Nav.Link href='/about-us'>About Us</Nav.Link>
              <Nav.Link href='/best-seller'>Best Sellers</Nav.Link>
              <Nav.Link href='/product-list'>All Products</Nav.Link>
              <Nav.Link href='/companies'>Companies</Nav.Link>
              {pathName == '/' ? (
                <Nav.Link href='#' onClick={scrollToTestimonial}>
                  {testimonialsTest}
                </Nav.Link>
              ) : (
                ''
              )}
            </Nav>
            {localStorage.getItem('offarat-contact') ? (
              <Link href='#'>
                <svg
                  width='22'
                  height='22'
                  viewBox='0 0 22 22'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <g clip-path='url(#clip0_25_3179)'>
                    <path
                      d='M11 1.28906C13.2406 1.28997 15.412 2.06545 17.1463 3.48411C18.8806 4.90278 20.0711 6.87739 20.5161 9.07336C20.9611 11.2693 20.6333 13.5516 19.5881 15.5336C18.5429 17.5155 16.8447 19.0751 14.7812 19.9482C12.408 20.9511 9.73363 20.9701 7.34639 20.0011C4.95914 19.0321 3.05461 17.1545 2.05176 14.7812C1.04891 12.408 1.02989 9.73363 1.99889 7.34639C2.96789 4.95914 4.84553 3.05461 7.21875 2.05176C8.41496 1.54554 9.70109 1.28613 11 1.28906ZM11 0C4.92508 0 0 4.92508 0 11C0 17.0749 4.92508 22 11 22C17.0749 22 22 17.0749 22 11C22 4.92508 17.0749 0 11 0Z'
                      fill='#343434'
                    />
                    <path
                      d='M14.2094 16.9241C13.5705 16.8811 12.6699 16.6607 11.7907 16.3462C8.69097 15.2367 5.6664 12.2809 5.02359 8.14644C4.90929 7.41038 5.02961 6.73792 5.58734 6.1905C5.77425 6.00745 5.94054 5.80378 6.12316 5.61644C6.81066 4.90874 7.81527 4.8907 8.52726 5.57046C8.75285 5.78531 8.9823 5.99714 9.2023 6.21886C9.50356 6.51594 9.67798 6.9182 9.68896 7.34116C9.69994 7.76411 9.54661 8.17487 9.26117 8.48718C9.08929 8.67796 8.90882 8.85929 8.7275 9.04019C8.52941 9.23785 8.2832 9.35128 8.01894 9.43378C7.69281 9.53605 7.63222 9.67269 7.78047 9.98421C8.71718 11.9462 10.1834 13.3588 12.1792 14.2222C12.446 14.3374 12.5693 14.2854 12.6768 14.0207C12.9122 13.4402 13.3441 13.0169 13.8403 12.6749C14.4019 12.2882 15.2063 12.3741 15.7383 12.8313C16.0299 13.0819 16.3086 13.3473 16.5732 13.6262C16.8579 13.9308 17.016 14.3323 17.0156 14.7492C17.0152 15.1662 16.8563 15.5673 16.571 15.8714C16.4881 15.9616 16.4026 16.0497 16.3231 16.1425C15.8444 16.6989 15.2373 16.9593 14.2094 16.9241Z'
                      fill='#343434'
                    />
                  </g>
                  <defs>
                    <clipPath id='clip0_25_3179'>
                      <rect width='22' height='22' fill='white' />
                    </clipPath>
                  </defs>
                </svg>
                &nbsp;{localStorage.getItem('offarat-contact')}
              </Link>
            ) : (
              ''
            )}
          </Navbar>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default UserLogInHeader;
