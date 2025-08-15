'use client';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Col, Container, Row } from 'react-bootstrap';
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaSnapchatGhost,
} from 'react-icons/fa';
import useDetails from '../hooks/useDetails';
import logo from '../public/assets/img/logo.png';
import { GET_SOCIAL_LINKS } from '../services/APIServices';
import { constant } from './constants';
import { trans } from './trans';
const Footer = ({ testimonialLists }) => {
  let navigate = useRouter();
  let detail = useDetails();
  const isArabic = '';
  let pathName = usePathname();

  const { data: socialLink, refetch } = useQuery({
    queryKey: ['social-link'],
    queryFn: async () => {
      const resp = await GET_SOCIAL_LINKS();

      if (resp?.data?.data?.length !== 0) {
        localStorage.setItem(
          'offarat-contact',
          resp?.data?.data?.countryCode + ' ' + resp?.data?.data?.mobile
        );
      }
      return resp?.data?.data ?? [];
    },
  });

  // console.log('socialLink :', socialLink);

  const Home = trans('home');

  return (
    <>
      <footer className='bg-black py-5 text-white'>
        <Container>
          <Row>
            <Col md={6}>
              <Link href={'/'}>
                <Image src={logo} height={57} width={145} alt='logo' />
              </Link>
            </Col>
            <Col md={6} className='text-end'>
              <div className='d-flex social justify-content-md-end justify-content-start mt-md-0 mt-5'>
                {socialLink?.fbLink ? (
                  <Link
                    href={socialLink?.fbLink ?? ''}
                    className='me-4'
                    target='_blank'
                  >
                    <FaFacebook />
                  </Link>
                ) : (
                  ''
                )}
                {socialLink?.linkedinLink ? (
                  <Link
                    href={socialLink?.linkedinLink ?? ''}
                    className='me-4'
                    target='_blank'
                  >
                    <FaLinkedin />
                  </Link>
                ) : (
                  ''
                )}
                {socialLink?.snapChatLink ? (
                  <Link
                    href={socialLink?.snapChatLink ?? ''}
                    className='me-4'
                    target='_blank'
                  >
                    <FaSnapchatGhost />
                  </Link>
                ) : (
                  ''
                )}
                {socialLink?.instaLink ? (
                  <Link href={socialLink?.instaLink ?? ''} target='_blank'>
                    <FaInstagram />
                  </Link>
                ) : (
                  ''
                )}
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={10} className='mx-auto'>
              <ul className='footerlinks d-flex gap-md-5 gap-3 justify-content-md-center justify-content-start flex-wrap mb-4 mt-5'>
                <li>
                  <Link href='/' className='text-white'>
                    {Home}
                  </Link>
                </li>
                <li>
                  <Link href='/about-us' className='text-white'>
                    About Us
                  </Link>
                </li>

                <li>
                  <Link href='/privacy' className='text-white'>
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href='/refund-policy' className='text-white'>
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link href='/terms' className='text-white'>
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <a href='/best-seller' className='text-white'>
                    Best Sellers
                  </a>
                </li>
                <li>
                  <Link href='/contact' className='text-white'>
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href='/faq' className='text-white'>
                    FAQ
                  </Link>
                </li>

                {pathName == '/' && testimonialLists !== 0 ? (
                  <Link href='#' className='text-white'>
                    Testimonials
                  </Link>
                ) : (
                  ''
                )}
              </ul>
              <hr />
              <Row className='mt-4 justify-content-center'>
                <Col md={3}>
                  <div className='d-flex align-items-center'>
                    <svg
                      width='26'
                      height='35'
                      viewBox='0 0 26 35'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M12.7188 0.15625C9.34553 0.15625 6.11046 1.49626 3.72524 3.88149C1.34001 6.26671 0 9.50178 0 12.875C0 19.5928 11.3313 33.8031 11.8169 34.4159C11.9252 34.551 12.0625 34.66 12.2186 34.7349C12.3747 34.8097 12.5456 34.8486 12.7188 34.8486C12.8919 34.8486 13.0628 34.8097 13.2189 34.7349C13.375 34.66 13.5123 34.551 13.6206 34.4159C14.1063 33.8031 25.4375 19.5928 25.4375 12.875C25.4375 9.50178 24.0975 6.26671 21.7123 3.88149C19.327 1.49626 16.092 0.15625 12.7188 0.15625ZM12.7188 16.3438C11.804 16.3438 10.9098 16.0725 10.1492 15.5643C9.38866 15.0561 8.79586 14.3338 8.44581 13.4887C8.09575 12.6436 8.00416 11.7136 8.18262 10.8165C8.36107 9.9193 8.80156 9.0952 9.44838 8.44838C10.0952 7.80156 10.9193 7.36107 11.8165 7.18262C12.7136 7.00416 13.6436 7.09575 14.4887 7.44581C15.3338 7.79586 16.0561 8.38866 16.5643 9.14924C17.0725 9.90982 17.3438 10.804 17.3438 11.7188C17.3438 12.9454 16.8565 14.1218 15.9891 14.9891C15.1218 15.8565 13.9454 16.3438 12.7188 16.3438Z'
                        fill='#DA2A2C'
                      />
                    </svg>
                    {socialLink?.address ? (
                      <div className='ms-3'>
                        <h4>Find Us</h4>
                        <p>
                          <Link
                            className='text-white'
                            href={`https://www.google.com/maps/search/?api=1&query=${socialLink?.address}`}
                            target='_blank'
                          >
                            {socialLink?.address}
                          </Link>
                        </p>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className='d-flex align-items-center justify-content-md-center justify-content-start'>
                    <svg
                      width='37'
                      height='37'
                      viewBox='0 0 37 37'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M33.9857 27.01C32.9751 26.1625 27.0482 22.4093 26.063 22.5816C25.6005 22.6637 25.2467 23.0579 24.2998 24.1876C23.8618 24.7436 23.3809 25.2644 22.8614 25.7451C21.9095 25.5151 20.9882 25.1736 20.1164 24.7276C16.6977 23.0631 13.9359 20.3004 12.2724 16.8813C11.8264 16.0095 11.4849 15.0882 11.2549 14.1363C11.7356 13.6168 12.2564 13.1359 12.8124 12.6979C13.9409 11.751 14.3363 11.3995 14.4184 10.9347C14.5907 9.94722 10.8341 4.02259 9.99 3.01203C9.63619 2.59347 9.31475 2.3125 8.90312 2.3125C7.70987 2.3125 2.3125 8.98638 2.3125 9.85125C2.3125 9.92178 2.42812 16.8697 11.2029 25.7971C20.1303 34.5719 27.0782 34.6875 27.1488 34.6875C28.0136 34.6875 34.6875 29.2901 34.6875 28.0969C34.6875 27.6852 34.4065 27.3638 33.9857 27.01Z'
                        fill='#DA2A2C'
                      />
                      <path
                        d='M26.5938 17.3438H28.9062C28.9035 14.8913 27.9281 12.5402 26.1939 10.8061C24.4598 9.07194 22.1087 8.0965 19.6562 8.09375V10.4062C21.4956 10.4081 23.2591 11.1396 24.5598 12.4402C25.8604 13.7409 26.5919 15.5044 26.5938 17.3438Z'
                        fill='#DA2A2C'
                      />
                      <path
                        d='M32.375 17.3438H34.6875C34.6829 13.3586 33.0978 9.53803 30.2799 6.72012C27.462 3.90221 23.6414 2.31709 19.6562 2.3125V4.625C23.0283 4.62898 26.261 5.97026 28.6454 8.35463C31.0297 10.739 32.371 13.9717 32.375 17.3438Z'
                        fill='#DA2A2C'
                      />
                    </svg>
                    {/* {socialLink?.mobile ? (
                      <div className="ms-3 notranslate ">
                        <h4>Call Us</h4>
                        <p>
                          <Link
                            className="footer_link"
                            href={`tel:${socialLink?.countryCode + socialLink?.mobile
                              }`}
                          >
                            {socialLink?.countryCode + " " + socialLink?.mobile}{" "}
                          </Link>
                        </p>
                      </div>
                    ) : (
                      ""
                    )} */}

                    {socialLink?.mobile ? (
                      <div className={`ms-3 ${isArabic ? 'text-right' : ''}`}>
                        <h4>{isArabic ? 'اتصل بنا' : 'Contact Us'}</h4>
                        <p>
                          <Link
                            className='footer_link'
                            href={`tel:${
                              socialLink?.countryCode + socialLink?.mobile
                            }`}
                          >
                            <span dir='ltr'>
                              {socialLink?.countryCode +
                                ' ' +
                                socialLink?.mobile}
                            </span>
                          </Link>
                        </p>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                </Col>
                <Col md={3}>
                  <div className='d-flex align-items-center'>
                    <svg
                      width='44'
                      height='44'
                      viewBox='0 0 44 44'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <g clipPath='url(#clip0_25_4095)'>
                        <path
                          d='M43.6124 8.7417L30.2681 22L43.6124 35.2584C43.8536 34.7542 43.9999 34.1968 43.9999 33.6016V10.3985C43.9999 9.8032 43.8536 9.24589 43.6124 8.7417Z'
                          fill='#DA2A2C'
                        />
                        <path
                          d='M40.1329 6.53125H3.86724C3.27195 6.53125 2.71464 6.6776 2.21045 6.91883L19.2659 23.8883C20.7739 25.3963 23.2262 25.3963 24.7342 23.8883L41.7896 6.91883C41.2855 6.6776 40.7282 6.53125 40.1329 6.53125Z'
                          fill='#DA2A2C'
                        />
                        <path
                          d='M0.387578 8.7417C0.146352 9.24589 0 9.8032 0 10.3985V33.6016C0 34.1969 0.146352 34.7543 0.387578 35.2584L13.7319 22L0.387578 8.7417Z'
                          fill='#DA2A2C'
                        />
                        <path
                          d='M28.4454 23.8228L26.5571 25.7111C24.0443 28.2238 19.9557 28.2238 17.443 25.7111L15.5547 23.8228L2.21045 37.0811C2.71464 37.3223 3.27195 37.4687 3.86724 37.4687H40.1329C40.7282 37.4687 41.2855 37.3223 41.7896 37.0811L28.4454 23.8228Z'
                          fill='#DA2A2C'
                        />
                      </g>
                      <defs>
                        <clipPath id='clip0_25_4095'>
                          <rect width='144' height='144' fill='white' />
                        </clipPath>
                      </defs>
                    </svg>
                    {/* {socialLink?.email ? (
                      <div className="ms-3">
                        <h4>Mail Us</h4>
                        <p>
                          <Link
                            href={`mailto:${socialLink?.email}`}
                            className="footer_link"
                          >
                            {socialLink?.email ?? ""}
                          </Link>
                        </p>
                      </div>
                    ) : (
                      ""
                    )} */}
                    {socialLink?.email ? (
                      <div className='ms-3'>
                        <h4>Mail Us</h4>
                        <p>
                          <Link
                            href={`mailto:${socialLink?.email}`}
                            className='footer_link notranslate'
                          >
                            {socialLink?.email ?? ''}
                          </Link>
                        </p>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </footer>

      <div className='copyright bg-black'>
        <hr className='m-0' />
        <p className='text-center mb-0 pb-3 text-white pt-3'>
          © {new Date().getFullYear()}
          <Link
            href='#'
            onClick={(e) => {
              e.preventDefault();
              navigate.push('/');
            }}
          >
            &nbsp;Offarat{' '}
          </Link>{' '}
          | All Rights Reserved. Developed By
          <Link href='https://toxsl.com/' target='_blank'>
            &nbsp;Offarat Company.
          </Link>
        </p>
      </div>
    </>
  );
};

export default Footer;
