import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Button,
  Container,
  Form,
  Nav,
  Navbar,
  Offcanvas,
} from 'react-bootstrap';
import TranslateWidget from './TranslateWidget';
// utils/deviceToken.js
import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import useDetails from '../hooks/useDetails';
import { clearCart } from '../redux/features/cartSlice';
import { USER_CART, USER_CART_WITHOUT_LOGIN } from '../services/APIServices';
import { getDeviceToken } from './helper';
import CountryState from '../hooks/useCountryState';
import { trans } from './trans';
import { country } from '../redux/features/CountrySlice';
import { FaBars } from 'react-icons/fa6';

import useCountryState from '../hooks/useCountryState';
import { FaRegUserCircle, FaSearch } from 'react-icons/fa';
import { IoCartOutline } from 'react-icons/io5';

export const Header = ({ params, scrollToTestimonial, refetchAPI }) => {
  const [contact, setContact] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const selectedCountry = useCountryState();

  let router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setContact(localStorage.getItem('offarat-contact'));
    }
  }, []);

  const searchParams = useSearchParams();

  let searchProduct = searchParams?.get('search');
  const [search, setSearch] = useState(searchProduct);

  let pathName = usePathname();

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

  const redirectToWhatsApp = (phoneNumber) => {
    const url = `https://wa.me/${phoneNumber}`;
    window.open(url, '_blank');
  };

  let dispatch = useDispatch();
  let detail = useDetails();

  const { data: cartListing, refetch } = useQuery({
    queryKey: ['cart-list-user'],
    queryFn: async () => {
      const resp =
        detail == null || detail == undefined
          ? await USER_CART_WITHOUT_LOGIN('', '', getDeviceToken())
          : await USER_CART();
      if (resp?.data?.data?.cartCount == 0) {
        dispatch(clearCart(null));
        localStorage.removeItem('persist:cart');
        Cookies.remove('cartItems');
      }

      return resp?.data?.data ?? [];
    },
  });
  //
  const searchTrans = trans('search');

  const translations = {
    en: {
      home: 'Home',
      about: 'About Us',
      bestseller: 'Best Sellers',
      allProducts: 'All Products',
      companies: 'Companies',
      testimonials: 'Testimonials',
    },
    ar: {
      home: 'الرئيسية',
      about: 'من نحن',
      bestseller: 'الأكثر مبيعًا',
      allProducts: 'جميع المنتجات',
      companies: 'شركات',
      testimonials: 'الشهادات',
    },
  };

  // Get language from localStorage, fallback to 'en'
  let language = localStorage.getItem('language');

  const languageCode =
    language && language.toLowerCase().includes('arabic') ? 'ar' : 'en';

  // Destructure the translations
  const {
    home: homeText,
    testimonials: testimonialsText,
    about: aboutText,
    bestseller: bestsellerText,
    allProducts: allProductsText,
    companies: companiesText,
  } = translations[languageCode];

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    dispatch(country(selectedCountry));

    refetchAPI();
  };

  // Helper to determine if link is active
  const isActive = (href) => {
    return pathName === href;
  };

  return (
    <>
      <div className='topbar '>
        <Container>
          <div className='d-flex  py-3 align-items-center justify-content-between'>
            <Navbar.Brand href='/'>
              <Image
                src={`/assets/img/logo.png`}
                height={57}
                width={145}
                alt='logo'
              />
            </Navbar.Brand>
            <div className='searchbar mx-auto d-lg-block d-none'>
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
                    // e.preventDefault();
                    handleSearch(e);
                  }}
                >
                  <FaSearch size={17} color='white' />
                </Button>
              </Form>
            </div>

            <div className='d-flex align-items-center gap-5'>
              <div>
                <div className='d-flex flex-wrap gap-5 d-md-block d-none'>
                  <Link
                    href={
                      cartListing?.cartCount > 0
                        ? `/login?pathname=${encodeURIComponent(
                            pathName
                          )}&isCart=${true}&deviceToken=${encodeURIComponent(
                            getDeviceToken()
                          )}`
                        : '/login'
                    }
                    className='m-1'
                  >
                    <FaRegUserCircle size={25} />
                    {/* <span className='d-lg-inline-block d-none'>Account</span> */}
                  </Link>

                  <Link className='position-relative mb-4' href='/cart'>
                    {cartListing?.cartCount > 0 ? (
                      <span className='cart-count'>
                        {cartListing?.cartCount}
                      </span>
                    ) : (
                      ''
                    )}
                    <IoCartOutline size={25} />
                  </Link>
                </div>

                <div className='d-flex flex-wrap gap-3 d-md-none  d-none me-3'>
                  <a href='#'>
                    <svg
                      width='22'
                      height='22'
                      viewBox='0 0 22 22'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <g clipPath='url(#clip0_25_3171)'>
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
                  </a>
                </div>
              </div>

              <div className='d-flex align-items-center gap-2'>
                <div className='form-group position-relative selectform mb-0 me-3 d-none d-md-block'>
                  <Form.Select
                    onChange={handleCountryChange}
                    value={selectedCountry}
                  >
                    <option value={'Kuwait'}>Kuwait</option>

                    {/* <option value={'Jordan'}>Jordan</option>
                    <option value={'United Arab Emirates'}>UAE</option> */}
                  </Form.Select>
                </div>
                <div>
                  <TranslateWidget />
                </div>
              </div>
            </div>
          </div>

          <div className='searchbar mx-auto d-lg-none d-block mb-2'>
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
                  // e.preventDefault();
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
          <hr />
        </Container>

        <Container>
          <Navbar
            expand='lg'
            className='bg-white d-flex justify-content-between '
          >
            <Navbar.Toggle aria-controls='navbarScroll' className=' d-none' />

            <Navbar.Collapse id='navbarScroll' className='d-lg-block d-none'>
              <Nav
                className={`d-flex my-2 my-lg-0 ${
                  languageCode === 'ar'
                    ? 'justify-content-end'
                    : 'me-auto w-100'
                }`}
                navbarScroll
              >
                <Link
                  className={`nav-link ${isActive('/') ? 'fw-bold' : ''} ${
                    languageCode === 'ar' ? 'text-end pe-0' : 'ps-lg-0'
                  }`}
                  href='/'
                >
                  {homeText}
                </Link>
                <Link
                  className={`nav-link ${
                    isActive('/about-us') ? 'fw-bold' : ''
                  }`}
                  href='/about-us'
                >
                  {aboutText}
                </Link>
                <Link
                  className={`nav-link ${
                    isActive('/best-seller') ? 'fw-bold' : ''
                  }`}
                  href='/best-seller'
                >
                  {bestsellerText}
                </Link>
                <Link
                  className={`nav-link ${
                    isActive('/product-list') ? 'fw-bold' : ''
                  }`}
                  href='/product-list'
                >
                  {allProductsText}
                </Link>
                <Link
                  className={`nav-link ${
                    isActive('/companies') ? 'fw-bold' : ''
                  }`}
                  href='/companies'
                >
                  {companiesText}
                </Link>
                {pathName === '/' && (
                  <Link
                    className={`nav-link ${
                      window.location.hash === '#testimonials' ? 'fw-bold' : ''
                    }`}
                    href='#'
                    onClick={scrollToTestimonial}
                  >
                    {testimonialsText}
                  </Link>
                )}
              </Nav>
            </Navbar.Collapse>

            <div className='d-lg-none d-block' onClick={handleShow}>
              <FaBars />
            </div>
            <div className='d-flex align-items-center gap-3'>
              {localStorage.getItem('offarat-contact') ? (
                <Link
                  href='#'
                  style={{ textDecoration: 'none' }}
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
                    <g clipPath='url(#clip0_25_3179)'>
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

              <div className='d-flex align-items-center gap-2 d-md-none'>
                <Link
                  href={
                    cartListing?.cartCount > 0
                      ? `/login?pathname=${encodeURIComponent(
                          pathName
                        )}&isCart=${true}&deviceToken=${encodeURIComponent(
                          getDeviceToken()
                        )}`
                      : '/login'
                  }
                  className='m-1'
                >
                  <FaRegUserCircle size={25} />
                  {/* <span className='d-lg-inline-block d-none'>Account</span> */}
                </Link>

                <Link className='position-relative mb-0' href='/cart'>
                  {cartListing?.cartCount > 0 ? (
                    <span className='cart-count'>{cartListing?.cartCount}</span>
                  ) : (
                    ''
                  )}
                  <IoCartOutline size={25} />
                </Link>
              </div>
            </div>
          </Navbar>
        </Container>
      </div>

      {/* Mobile Menu */}
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Navbar className='d-block'>
            <Nav className='flex-column m-0'>
              <Link
                href='/'
                className={`nav-link ps-lg-0 ${isActive('/') ? 'fw-bold' : ''}`}
                onClick={handleClose}
              >
                {homeText}
              </Link>
              <Link
                href='/about-us'
                className={`nav-link ${isActive('/about-us') ? 'fw-bold' : ''}`}
                onClick={handleClose}
              >
                {aboutText}
              </Link>
              <Link
                href='/best-seller'
                className={`nav-link ${
                  isActive('/best-seller') ? 'fw-bold' : ''
                }`}
                onClick={handleClose}
              >
                {bestsellerText}
              </Link>
              <Link
                href='/product-list'
                className={`nav-link ${
                  isActive('/product-list') ? 'fw-bold' : ''
                }`}
                onClick={handleClose}
              >
                {allProductsText}
              </Link>
              <Link
                href='/companies'
                className={`nav-link ${
                  isActive('/companies') ? 'fw-bold' : ''
                }`}
                onClick={handleClose}
              >
                {companiesText}
              </Link>
              {pathName === '/' && (
                <Link
                  href='#'
                  className={`nav-link ${
                    window.location.hash === '#testimonials' ? 'fw-bold' : ''
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToTestimonial();
                    handleClose();
                  }}
                >
                  {testimonialsText}
                </Link>
              )}
            </Nav>

            {contact && (
              <Link href='#'>
                <svg
                  width='22'
                  height='22'
                  viewBox='0 0 22 22'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  {/* SVG paths */}
                </svg>
                &nbsp;{contact}
              </Link>
            )}
          </Navbar>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
export default Header;

<div>
  {/* For Mobile */}
  {/* <div className='d-block d-lg-none'>
        <div className='topbar py-3'>
          <Container>
            <div className='d-flex align-items-center justify-content-between'>
              <Navbar.Brand href='/'>
                <Image
                  src={`/assets/img/logo.png`}
                  height={45}
                  width={120}
                  alt='logo'
                />
              </Navbar.Brand>
              <div className='header-right-profile d-flex align-items-center gap-2'>
                <Link
                  href={
                    cartListing?.cartCount > 0
                      ? `/login?pathname=${encodeURIComponent(
                          pathName
                        )}&isCart=${true}&deviceToken=${encodeURIComponent(
                          getDeviceToken()
                        )}`
                      : '/login'
                  }
                  className='m-1'
                >
                  <svg
                    width='22'
                    height='22'
                    viewBox='0 0 22 22'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M4.20997 17.8183C4.21018 17.8185 4.21039 17.8187 4.2106 17.8189C6.02805 19.6287 8.43933 20.625 11 20.625C13.5607 20.625 15.972 19.6287 17.7884 17.8199C17.7889 17.8194 17.7893 17.8189 17.7898 17.8184C17.7903 17.8179 17.7907 17.8174 17.7912 17.8169C19.6185 16.0035 20.625 13.5828 20.625 11C20.625 5.69269 16.3073 1.375 11 1.375C5.69269 1.375 1.375 5.69269 1.375 11C1.375 13.5834 2.38195 16.0047 4.20909 17.8173C4.20938 17.8176 4.20964 17.8179 4.20997 17.8183ZM5.38318 17.0275V15.8263C5.38318 15.2294 5.61447 14.6698 6.03107 14.2529C6.4584 13.8309 7.01935 13.5986 7.6105 13.5986H14.3895C15.6178 13.5986 16.6168 14.598 16.6168 15.8263V17.0276C15.0838 18.458 13.1033 19.25 11 19.25C8.89709 19.25 6.91696 18.4583 5.38318 17.0275ZM7.98178 9.20572C7.98178 7.54135 9.33563 6.1875 11 6.1875C12.6644 6.1875 14.0182 7.54135 14.0182 9.20572C14.0182 10.8698 12.6644 12.2236 11 12.2236C9.33563 12.2236 7.98178 10.8698 7.98178 9.20572ZM11 2.75C15.549 2.75 19.25 6.45102 19.25 11C19.25 12.6 18.7935 14.124 17.9523 15.4349C17.7542 13.6342 16.2418 12.2236 14.3895 12.2236H14.1841C14.9313 11.4357 15.3932 10.3747 15.3932 9.20572C15.3932 6.78336 13.4224 4.8125 11 4.8125C8.57764 4.8125 6.60678 6.78336 6.60678 9.20572C6.60678 10.3747 7.0687 11.4357 7.81595 12.2236H7.6105C6.65546 12.2236 5.75143 12.5969 5.06192 13.2777C4.47664 13.863 4.13474 14.6194 4.04649 15.4331C3.20625 14.123 2.75 12.5994 2.75 11C2.75 6.45102 6.45102 2.75 11 2.75Z'
                      fill='#343434'
                    />
                  </svg>
                </Link>

                <Link className='position-relative mb-0' href='/cart'>
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
                <div className='form-group position-relative selectform mb-0'>
                  <Form.Select
                    onChange={handleCountryChange}
                    value={selectedCountry}
                  >
                    <option value={'Kuwait'}>Kuwait</option>

                    <option value={'Jordan'}>Jordan</option>
                    <option value={'UAE'}>UAE</option>
                  </Form.Select>
                </div>
                <TranslateWidget />
                <span className='menu_btn' onClick={handleShow}>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='26'
                    height='26'
                    fill='currentColor'
                    className='bi bi-list'
                    viewBox='0 0 16 16'
                  >
                    <path
                      fillRule='evenodd'
                      d='M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5'
                    />
                  </svg>
                </span>
              </div>
            </div>

            <div className='searchbar mt-3'>
              <Form className='d-flex'>
                <Form.Control
                  type='search'
                  placeholder='Search'
                  className='me-0 w-100'
                  aria-label='Search'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key == 'Enter' && handleSearch(e)}
                  onKeyUp={(e) => e.target.value == '' && handleSearch(e)}
                />
                <Button
                  variant='outline-success'
                  onClick={(e) => {
                    // e.preventDefault();
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
          </Container>
        </div>
      </div> */}
</div>;
