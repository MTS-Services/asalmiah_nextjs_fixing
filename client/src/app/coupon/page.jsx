"use client";
import { Button, Col, Container, Form, Nav, Navbar, NavDropdown, Row } from "react-bootstrap";
import { BsDot } from "react-icons/bs";
import { FaFacebook, FaInstagram, FaLinkedin, FaTag, FaTwitter } from "react-icons/fa";
import { IoMdCheckboxOutline } from "react-icons/io";
import "../(customer)/cart/page.scss";
import Breadcrums from "../components/Breadcrums";

const Coupon = () => {
    return (
        <>
            <div className="topbar">
                <Container>
                    <div className="d-flex justify-content-between py-3 align-items-center">
                        <Navbar.Brand href="#">LOGO</Navbar.Brand>
                        <div className="searchbar">
                            <Form className="d-flex">
                                <Form.Control
                                    type="search"
                                    placeholder="Search"
                                    className="me-0"
                                    aria-label="Search"
                                />
                                <Button variant="outline-success">

                                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.3033 14.9498L13.1953 11.8418C14.1372 10.6088 14.6538 9.11312 14.654 7.53489C14.654 5.63297 13.9133 3.84475 12.5682 2.4999C11.2234 1.15505 9.43537 0.414307 7.53321 0.414307C5.63128 0.414307 3.84306 1.15505 2.49821 2.4999C-0.278051 5.2764 -0.278051 9.79385 2.49821 12.5699C3.84306 13.915 5.63128 14.6557 7.53321 14.6557C9.11144 14.6555 10.6071 14.1389 11.8402 13.197L14.9481 16.305C15.1351 16.4921 15.3805 16.5857 15.6257 16.5857C15.8709 16.5857 16.1163 16.4921 16.3033 16.305C16.6776 15.9308 16.6776 15.3239 16.3033 14.9498ZM3.85336 11.2147C1.82439 9.18577 1.82462 5.88425 3.85336 3.85504C4.83626 2.87238 6.1432 2.33097 7.53321 2.33097C8.92345 2.33097 10.2302 2.87238 11.2131 3.85504C12.196 4.83794 12.7374 6.14489 12.7374 7.53489C12.7374 8.92513 12.196 10.2318 11.2131 11.2147C10.2302 12.1976 8.92345 12.739 7.53321 12.739C6.1432 12.739 4.83626 12.1976 3.85336 11.2147Z" fill="white" />
                                    </svg>

                                </Button>
                            </Form>
                        </div>

                        <div className="d-flex flex-wrap gap-3">
                            <a href="#">
                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.20997 17.8183C4.21018 17.8185 4.21039 17.8187 4.2106 17.8189C6.02805 19.6287 8.43933 20.625 11 20.625C13.5607 20.625 15.972 19.6287 17.7884 17.8199C17.7889 17.8194 17.7893 17.8189 17.7898 17.8184C17.7903 17.8179 17.7907 17.8174 17.7912 17.8169C19.6185 16.0035 20.625 13.5828 20.625 11C20.625 5.69269 16.3073 1.375 11 1.375C5.69269 1.375 1.375 5.69269 1.375 11C1.375 13.5834 2.38195 16.0047 4.20909 17.8173C4.20938 17.8176 4.20964 17.8179 4.20997 17.8183ZM5.38318 17.0275V15.8263C5.38318 15.2294 5.61447 14.6698 6.03107 14.2529C6.4584 13.8309 7.01935 13.5986 7.6105 13.5986H14.3895C15.6178 13.5986 16.6168 14.598 16.6168 15.8263V17.0276C15.0838 18.458 13.1033 19.25 11 19.25C8.89709 19.25 6.91696 18.4583 5.38318 17.0275ZM7.98178 9.20572C7.98178 7.54135 9.33563 6.1875 11 6.1875C12.6644 6.1875 14.0182 7.54135 14.0182 9.20572C14.0182 10.8698 12.6644 12.2236 11 12.2236C9.33563 12.2236 7.98178 10.8698 7.98178 9.20572ZM11 2.75C15.549 2.75 19.25 6.45102 19.25 11C19.25 12.6 18.7935 14.124 17.9523 15.4349C17.7542 13.6342 16.2418 12.2236 14.3895 12.2236H14.1841C14.9313 11.4357 15.3932 10.3747 15.3932 9.20572C15.3932 6.78336 13.4224 4.8125 11 4.8125C8.57764 4.8125 6.60678 6.78336 6.60678 9.20572C6.60678 10.3747 7.0687 11.4357 7.81595 12.2236H7.6105C6.65546 12.2236 5.75143 12.5969 5.06192 13.2777C4.47664 13.863 4.13474 14.6194 4.04649 15.4331C3.20625 14.123 2.75 12.5994 2.75 11C2.75 6.45102 6.45102 2.75 11 2.75Z" fill="#343434" />
                                </svg>
                                &nbsp;Account</a>
                            <a href="#">
                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 20C10.7153 20 10.4408 19.8957 10.2268 19.7061C9.41888 18.9914 8.63992 18.3198 7.95267 17.7274L7.94916 17.7243C5.93423 15.9873 4.19427 14.4873 2.98364 13.0096C1.63034 11.3576 1 9.79138 1 8.08032C1 6.41788 1.56351 4.88418 2.58661 3.76153C3.62192 2.62561 5.04251 2 6.58716 2C7.74164 2 8.79892 2.36922 9.72955 3.09733C10.1992 3.46486 10.6249 3.91466 11 4.43932C11.3752 3.91466 11.8008 3.46486 12.2706 3.09733C13.2012 2.36922 14.2585 2 15.413 2C16.9575 2 18.3782 2.62561 19.4135 3.76153C20.4366 4.88418 21 6.41788 21 8.08032C21 9.79138 20.3698 11.3576 19.0165 13.0094C17.8059 14.4873 16.0661 15.9872 14.0515 17.724C13.363 18.3173 12.5828 18.99 11.773 19.7064C11.5592 19.8957 11.2846 20 11 20ZM6.58716 3.18516C5.37363 3.18516 4.25882 3.67509 3.44781 4.56481C2.62476 5.46796 2.17142 6.71641 2.17142 8.08032C2.17142 9.5194 2.70013 10.8064 3.88559 12.2534C5.03137 13.652 6.73563 15.1212 8.70889 16.8224L8.71255 16.8255C9.4024 17.4202 10.1844 18.0944 10.9983 18.8144C11.8171 18.0931 12.6003 17.4177 13.2916 16.8221C15.2647 15.1209 16.9688 13.652 18.1146 12.2534C19.2999 10.8064 19.8286 9.5194 19.8286 8.08032C19.8286 6.71641 19.3752 5.46796 18.5522 4.56481C17.7413 3.67509 16.6264 3.18516 15.413 3.18516C14.524 3.18516 13.7078 3.47103 12.9872 4.03475C12.3449 4.53734 11.8975 5.17268 11.6352 5.61723C11.5003 5.84583 11.2629 5.98228 11 5.98228C10.7371 5.98228 10.4997 5.84583 10.3648 5.61723C10.1026 5.17268 9.65524 4.53734 9.01285 4.03475C8.29218 3.47103 7.47598 3.18516 6.58716 3.18516Z" fill="#343434" />
                                </svg>
                                &nbsp;Wishlist</a>
                            <a href="#">
                                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_25_3171)">
                                        <path d="M7.08816 14.2228H7.08917C7.09001 14.2228 7.09085 14.2226 7.09169 14.2226H18.7773C19.065 14.2226 19.318 14.0318 19.397 13.7552L21.9751 4.73176C22.0307 4.53723 21.9918 4.32809 21.8701 4.16662C21.7482 4.00516 21.5577 3.91015 21.3555 3.91015H5.60171L5.14097 1.83675C5.07535 1.54184 4.81384 1.33203 4.51172 1.33203H0.644531C0.288528 1.33203 0 1.62056 0 1.97656C0 2.33256 0.288528 2.62109 0.644531 2.62109H3.99475C4.07632 2.98851 6.19958 12.5433 6.32177 13.093C5.63679 13.3908 5.15625 14.0738 5.15625 14.8672C5.15625 15.9333 6.02368 16.8008 7.08984 16.8008H18.7773C19.1333 16.8008 19.4219 16.5122 19.4219 16.1562C19.4219 15.8002 19.1333 15.5117 18.7773 15.5117H7.08984C6.73451 15.5117 6.44531 15.2225 6.44531 14.8672C6.44531 14.5124 6.7335 14.2237 7.08816 14.2228ZM20.5009 5.19922L18.2911 12.9336H7.60681L5.88806 5.19922H20.5009Z" fill="#343434" />
                                        <path d="M6.44531 18.7344C6.44531 19.8005 7.31274 20.668 8.37891 20.668C9.44507 20.668 10.3125 19.8005 10.3125 18.7344C10.3125 17.6682 9.44507 16.8008 8.37891 16.8008C7.31274 16.8008 6.44531 17.6682 6.44531 18.7344ZM8.37891 18.0898C8.73424 18.0898 9.02344 18.379 9.02344 18.7344C9.02344 19.0897 8.73424 19.3789 8.37891 19.3789C8.02357 19.3789 7.73437 19.0897 7.73437 18.7344C7.73437 18.379 8.02357 18.0898 8.37891 18.0898Z" fill="#343434" />
                                        <path d="M15.5547 18.7344C15.5547 19.8005 16.4221 20.668 17.4883 20.668C18.5544 20.668 19.4219 19.8005 19.4219 18.7344C19.4219 17.6682 18.5544 16.8008 17.4883 16.8008C16.4221 16.8008 15.5547 17.6682 15.5547 18.7344ZM17.4883 18.0898C17.8436 18.0898 18.1328 18.379 18.1328 18.7344C18.1328 19.0897 17.8436 19.3789 17.4883 19.3789C17.1329 19.3789 16.8437 19.0897 16.8437 18.7344C16.8437 18.379 17.1329 18.0898 17.4883 18.0898Z" fill="#343434" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_25_3171">
                                            <rect width="22" height="22" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                &nbsp;Cart</a>
                        </div>
                    </div>
                    <hr />
                </Container>
            </div>
            <Navbar expand="lg" className="bg-white">
                <Container>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto ms-0 my-2 my-lg-0"
                            navbarScroll
                        >
                            <Nav.Link href="#action1" className="ps-0">Home</Nav.Link>

                            <NavDropdown title="Categories" id="navbarScrollingDropdown">
                                <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action4">
                                    Another action
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action5">
                                    Something else here
                                </NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link href="#">About Us</Nav.Link>
                            <Nav.Link href="#action2">Best Deals</Nav.Link>
                            <Nav.Link href="#action2">Features</Nav.Link>
                            <Nav.Link href="#action2">Testimonials</Nav.Link>
                        </Nav>

                    </Navbar.Collapse>
                    <a href="#">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_25_3179)">
                                <path d="M11 1.28906C13.2406 1.28997 15.412 2.06545 17.1463 3.48411C18.8806 4.90278 20.0711 6.87739 20.5161 9.07336C20.9611 11.2693 20.6333 13.5516 19.5881 15.5336C18.5429 17.5155 16.8447 19.0751 14.7812 19.9482C12.408 20.9511 9.73363 20.9701 7.34639 20.0011C4.95914 19.0321 3.05461 17.1545 2.05176 14.7812C1.04891 12.408 1.02989 9.73363 1.99889 7.34639C2.96789 4.95914 4.84553 3.05461 7.21875 2.05176C8.41496 1.54554 9.70109 1.28613 11 1.28906ZM11 0C4.92508 0 0 4.92508 0 11C0 17.0749 4.92508 22 11 22C17.0749 22 22 17.0749 22 11C22 4.92508 17.0749 0 11 0Z" fill="#343434" />
                                <path d="M14.2094 16.9241C13.5705 16.8811 12.6699 16.6607 11.7907 16.3462C8.69097 15.2367 5.6664 12.2809 5.02359 8.14644C4.90929 7.41038 5.02961 6.73792 5.58734 6.1905C5.77425 6.00745 5.94054 5.80378 6.12316 5.61644C6.81066 4.90874 7.81527 4.8907 8.52726 5.57046C8.75285 5.78531 8.9823 5.99714 9.2023 6.21886C9.50356 6.51594 9.67798 6.9182 9.68896 7.34116C9.69994 7.76411 9.54661 8.17487 9.26117 8.48718C9.08929 8.67796 8.90882 8.85929 8.7275 9.04019C8.52941 9.23785 8.2832 9.35128 8.01894 9.43378C7.69281 9.53605 7.63222 9.67269 7.78047 9.98421C8.71718 11.9462 10.1834 13.3588 12.1792 14.2222C12.446 14.3374 12.5693 14.2854 12.6768 14.0207C12.9122 13.4402 13.3441 13.0169 13.8403 12.6749C14.4019 12.2882 15.2063 12.3741 15.7383 12.8313C16.0299 13.0819 16.3086 13.3473 16.5732 13.6262C16.8579 13.9308 17.016 14.3323 17.0156 14.7492C17.0152 15.1662 16.8563 15.5673 16.571 15.8714C16.4881 15.9616 16.4026 16.0497 16.3231 16.1425C15.8444 16.6989 15.2373 16.9593 14.2094 16.9241Z" fill="#343434" />
                            </g>
                            <defs>
                                <clipPath id="clip0_25_3179">
                                    <rect width="22" height="22" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        &nbsp;+123 (4567) (5678)</a>

                </Container>
            </Navbar>
            <Breadcrums firstLink={"Home"} secondLink={"Coupons"} />
            <section className="coupons-main">
                <Container>
                    <Row>
                        <Col lg={6}>
                            <div className="coupon__top d-flex align-items-center justify-content-between pe-4 mb-4">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="coupon__image">
                                        <div className="discount_value coupon">-50%</div>
                                    </div>
                                    <div className="coupon__content">
                                        <div className="coupon__status font-weight--black">
                                            <span className="coupon__verify">
                                                <IoMdCheckboxOutline />
                                                Verify</span>
                                            <span className="coupon__used-count" data-text=" Used">
                                                <BsDot />
                                                21 Used </span>
                                        </div>
                                        <div className="coupon__type">
                                            <span className="ion ion-pricetag"><FaTag className="me-1" />
                                                Coupon Code</span>
                                        </div>
                                        <div className="coupon__provider">
                                            <a href="#">Austin Brook</a>
                                        </div>
                                        <h4 className="coupon__title">Save 50% on All Dresses</h4>
                                    </div>
                                </div>
                                <div className="coupon-btn">
                                    <a href="#" className="btn btn-theme text-capitalize">Get Code</a>
                                </div>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className="coupon__top d-flex align-items-center justify-content-between pe-4 mb-4">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="coupon__image">
                                        <div className="discount_value coupon">-50%</div>
                                    </div>
                                    <div className="coupon__content">
                                        <div className="coupon__status font-weight--black">
                                            <span className="coupon__verify">
                                                <IoMdCheckboxOutline />
                                                Verify</span>
                                            <span className="coupon__used-count" data-text=" Used">
                                                <BsDot />
                                                21 Used </span>
                                        </div>
                                        <div className="coupon__type">
                                            <span className="ion ion-pricetag"><FaTag className="me-1" />
                                                Coupon Code</span>
                                        </div>
                                        <div className="coupon__provider">
                                            <a href="#">Austin Brook</a>
                                        </div>
                                        <h4 className="coupon__title">Save 50% on All Dresses</h4>
                                    </div>
                                </div>
                                <div className="coupon-btn">
                                    <a href="#" className="btn btn-theme text-capitalize">Get Code</a>
                                </div>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className="coupon__top d-flex align-items-center justify-content-between pe-4 mb-4">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="coupon__image">
                                        <div className="discount_value coupon">-20%</div>
                                    </div>
                                    <div className="coupon__content">
                                        <div className="coupon__status font-weight--black">
                                            <span className="coupon__verify">
                                                <IoMdCheckboxOutline />
                                                Verify</span>
                                            <span className="coupon__used-count" data-text=" Used">
                                                <BsDot />
                                                21 Used </span>
                                        </div>
                                        <div className="coupon__type">
                                            <span className="ion ion-pricetag"><FaTag className="me-1" />
                                                Coupon Code</span>
                                        </div>
                                        <div className="coupon__provider">
                                            <a href="#">Austin Brook</a>
                                        </div>
                                        <h4 className="coupon__title">Save 50% on All Dresses</h4>
                                    </div>
                                </div>
                                <div className="coupon-btn">
                                    <a href="#" className="btn btn-theme text-capitalize">Get Code</a>
                                </div>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className="coupon__top d-flex align-items-center justify-content-between pe-4 mb-4">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="coupon__image">
                                        <div className="discount_value coupon">-40%</div>
                                    </div>
                                    <div className="coupon__content">
                                        <div className="coupon__status font-weight--black">
                                            <span className="coupon__verify">
                                                <IoMdCheckboxOutline />
                                                Verify</span>
                                            <span className="coupon__used-count" data-text=" Used">
                                                <BsDot />
                                                21 Used </span>
                                        </div>
                                        <div className="coupon__type">
                                            <span className="ion ion-pricetag"><FaTag className="me-1" />
                                                Coupon Code</span>
                                        </div>
                                        <div className="coupon__provider">
                                            <a href="#">Austin Brook</a>
                                        </div>
                                        <h4 className="coupon__title">Save 50% on All Dresses</h4>
                                    </div>
                                </div>
                                <div className="coupon-btn">
                                    <a href="#" className="btn btn-theme text-capitalize">Get Code</a>
                                </div>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className="coupon__top d-flex align-items-center justify-content-between pe-4 mb-4">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="coupon__image">
                                        <div className="discount_value coupon">-30%</div>
                                    </div>
                                    <div className="coupon__content">
                                        <div className="coupon__status font-weight--black">
                                            <span className="coupon__verify">
                                                <IoMdCheckboxOutline />
                                                Verify</span>
                                            <span className="coupon__used-count" data-text=" Used">
                                                <BsDot />
                                                21 Used </span>
                                        </div>
                                        <div className="coupon__type">
                                            <span className="ion ion-pricetag"><FaTag className="me-1" />
                                                Coupon Code</span>
                                        </div>
                                        <div className="coupon__provider">
                                            <a href="#">Austin Brook</a>
                                        </div>
                                        <h4 className="coupon__title">Save 50% on All Dresses</h4>
                                    </div>
                                </div>
                                <div className="coupon-btn">
                                    <a href="#" className="btn btn-theme text-capitalize">Get Code</a>
                                </div>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className="coupon__top d-flex align-items-center justify-content-between pe-4 mb-4">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="coupon__image">
                                        <div className="discount_value coupon">-80%</div>
                                    </div>
                                    <div className="coupon__content">
                                        <div className="coupon__status font-weight--black">
                                            <span className="coupon__verify">
                                                <IoMdCheckboxOutline />
                                                Verify</span>
                                            <span className="coupon__used-count" data-text=" Used">
                                                <BsDot />
                                                21 Used </span>
                                        </div>
                                        <div className="coupon__type">
                                            <span className="ion ion-pricetag"><FaTag className="me-1" />
                                                Coupon Code</span>
                                        </div>
                                        <div className="coupon__provider">
                                            <a href="#">Austin Brook</a>
                                        </div>
                                        <h4 className="coupon__title">Save 50% on All Dresses</h4>
                                    </div>
                                </div>
                                <div className="coupon-btn">
                                    <a href="#" className="btn btn-theme text-capitalize">Get Code</a>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            <footer className="bg-black py-5 text-white">
                <Container>
                    <Row>
                        <Col md={6}>
                            <svg width="155" height="42" viewBox="0 0 155 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.0635938 41V0.766445H8.59465V33.955H24.9137V41H0.0635938ZM68.4496 20.8282C68.4496 23.9287 68.0644 26.7541 67.2938 29.3042C66.5233 31.836 65.3491 34.0192 63.7713 35.8538C62.2119 37.6885 60.2305 39.1012 57.8271 40.0919C55.4237 41.0642 52.58 41.5504 49.296 41.5504C46.012 41.5504 43.1684 41.0642 40.765 40.0919C38.3616 39.1012 36.371 37.6885 34.7932 35.8538C33.2338 34.0192 32.0688 31.8268 31.2983 29.2767C30.5277 26.7265 30.1424 23.892 30.1424 20.7731C30.1424 16.6085 30.8213 12.9851 32.1789 9.90293C33.5549 6.8024 35.6647 4.39902 38.5084 2.69281C41.3521 0.986601 44.9663 0.133496 49.3511 0.133496C53.7175 0.133496 57.3042 0.986601 60.1112 2.69281C62.9365 4.39902 65.028 6.8024 66.3857 9.90293C67.7616 13.0035 68.4496 16.6452 68.4496 20.8282ZM39.0863 20.8282C39.0863 23.6352 39.4349 26.0569 40.132 28.0933C40.8475 30.1114 41.9575 31.6709 43.4619 32.7717C44.9663 33.8541 46.911 34.3953 49.296 34.3953C51.7178 34.3953 53.6808 33.8541 55.1852 32.7717C56.6896 31.6709 57.7812 30.1114 58.46 28.0933C59.1572 26.0569 59.5058 23.6352 59.5058 20.8282C59.5058 16.6085 58.7169 13.2878 57.1391 10.8661C55.5613 8.44439 52.9653 7.23353 49.3511 7.23353C46.9477 7.23353 44.9846 7.78393 43.4619 8.88471C41.9575 9.96714 40.8475 11.5266 40.132 13.563C39.4349 15.5811 39.0863 18.0028 39.0863 20.8282ZM92.0614 18.4065H108.023V39.2663C105.913 39.9634 103.72 40.523 101.446 40.945C99.1706 41.3486 96.5929 41.5504 93.7126 41.5504C89.7131 41.5504 86.319 40.7615 83.5303 39.1837C80.7417 37.6059 78.6227 35.2759 77.1733 32.1937C75.724 29.1116 74.9993 25.323 74.9993 20.8282C74.9993 16.6085 75.8065 12.9576 77.421 9.87541C79.0538 6.79322 81.4297 4.4082 84.5486 2.72033C87.6858 1.03247 91.511 0.188535 96.0242 0.188535C98.1524 0.188535 100.253 0.417864 102.326 0.876523C104.399 1.33518 106.28 1.93144 107.968 2.66529L105.133 9.49014C103.904 8.86636 102.5 8.34349 100.923 7.92152C99.3449 7.49956 97.6937 7.28857 95.9692 7.28857C93.4924 7.28857 91.3367 7.85731 89.5021 8.99478C87.6858 10.1323 86.2731 11.7284 85.2641 13.7832C84.2734 15.8196 83.778 18.223 83.778 20.9933C83.778 23.6168 84.1358 25.9468 84.8513 27.9833C85.5668 30.0014 86.6951 31.5883 88.2362 32.7441C89.7773 33.8816 91.7862 34.4504 94.263 34.4504C95.4738 34.4504 96.492 34.3953 97.3176 34.2852C98.1616 34.1568 98.9504 34.0284 99.6843 33.9V25.5065H92.0614V18.4065ZM154.145 20.8282C154.145 23.9287 153.76 26.7541 152.99 29.3042C152.219 31.836 151.045 34.0192 149.467 35.8538C147.908 37.6885 145.926 39.1012 143.523 40.0919C141.12 41.0642 138.276 41.5504 134.992 41.5504C131.708 41.5504 128.864 41.0642 126.461 40.0919C124.057 39.1012 122.067 37.6885 120.489 35.8538C118.93 34.0192 117.765 31.8268 116.994 29.2767C116.224 26.7265 115.838 23.892 115.838 20.7731C115.838 16.6085 116.517 12.9851 117.875 9.90293C119.251 6.8024 121.361 4.39902 124.204 2.69281C127.048 0.986601 130.662 0.133496 135.047 0.133496C139.413 0.133496 143 0.986601 145.807 2.69281C148.632 4.39902 150.724 6.8024 152.081 9.90293C153.457 13.0035 154.145 16.6452 154.145 20.8282ZM124.782 20.8282C124.782 23.6352 125.131 26.0569 125.828 28.0933C126.543 30.1114 127.653 31.6709 129.158 32.7717C130.662 33.8541 132.607 34.3953 134.992 34.3953C137.414 34.3953 139.377 33.8541 140.881 32.7717C142.385 31.6709 143.477 30.1114 144.156 28.0933C144.853 26.0569 145.202 23.6352 145.202 20.8282C145.202 16.6085 144.413 13.2878 142.835 10.8661C141.257 8.44439 138.661 7.23353 135.047 7.23353C132.644 7.23353 130.68 7.78393 129.158 8.88471C127.653 9.96714 126.543 11.5266 125.828 13.563C125.131 15.5811 124.782 18.0028 124.782 20.8282Z" fill="white" />
                            </svg>
                        </Col>
                        <Col md={6} className="text-end">
                            <div className="d-flex social justify-content-end">
                                <a href="#" className="me-4">
                                    <FaFacebook />
                                </a>
                                <a href="#" className="me-4">
                                    <FaLinkedin />
                                </a>
                                <a href="#" className="me-4">
                                    <FaTwitter />
                                </a>
                                <a href="#">
                                    <FaInstagram />
                                </a>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={10} className="mx-auto">
                            <ul className="footerlinks d-flex gap-5 justify-content-center flex-wrap mb-4 mt-5">
                                <li>
                                    <a href="#" className="text-white">Home</a>
                                </li>
                                <li>
                                    <a href="#" className="text-white">About Us</a>
                                </li>
                                <li>
                                    <a href="#" className="text-white">Services</a>
                                </li>
                                <li>
                                    <a href="#" className="text-white">Best Deals</a>
                                </li>
                                <li>
                                    <a href="#" className="text-white">Contact Us</a>
                                </li>
                                <li>
                                    <a href="#" className="text-white">Testimonials</a>
                                </li>
                            </ul>
                            <hr />
                            <Row className="mt-4 justify-content-center">
                                <Col md={3}>
                                    <div className="d-flex align-items-center">

                                        <svg width="26" height="35" viewBox="0 0 26 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12.7188 0.15625C9.34553 0.15625 6.11046 1.49626 3.72524 3.88149C1.34001 6.26671 0 9.50178 0 12.875C0 19.5928 11.3313 33.8031 11.8169 34.4159C11.9252 34.551 12.0625 34.66 12.2186 34.7349C12.3747 34.8097 12.5456 34.8486 12.7188 34.8486C12.8919 34.8486 13.0628 34.8097 13.2189 34.7349C13.375 34.66 13.5123 34.551 13.6206 34.4159C14.1063 33.8031 25.4375 19.5928 25.4375 12.875C25.4375 9.50178 24.0975 6.26671 21.7123 3.88149C19.327 1.49626 16.092 0.15625 12.7188 0.15625ZM12.7188 16.3438C11.804 16.3438 10.9098 16.0725 10.1492 15.5643C9.38866 15.0561 8.79586 14.3338 8.44581 13.4887C8.09575 12.6436 8.00416 11.7136 8.18262 10.8165C8.36107 9.9193 8.80156 9.0952 9.44838 8.44838C10.0952 7.80156 10.9193 7.36107 11.8165 7.18262C12.7136 7.00416 13.6436 7.09575 14.4887 7.44581C15.3338 7.79586 16.0561 8.38866 16.5643 9.14924C17.0725 9.90982 17.3438 10.804 17.3438 11.7188C17.3438 12.9454 16.8565 14.1218 15.9891 14.9891C15.1218 15.8565 13.9454 16.3438 12.7188 16.3438Z" fill="#DA2A2C" />
                                        </svg>

                                        <div className="ms-3">
                                            <h4>Find Us</h4>
                                            <p>Columbia, DC 256001,227<br />
                                                Marion Street</p>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="d-flex align-items-center justify-content-center">

                                        <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M33.9857 27.01C32.9751 26.1625 27.0482 22.4093 26.063 22.5816C25.6005 22.6637 25.2467 23.0579 24.2998 24.1876C23.8618 24.7436 23.3809 25.2644 22.8614 25.7451C21.9095 25.5151 20.9882 25.1736 20.1164 24.7276C16.6977 23.0631 13.9359 20.3004 12.2724 16.8813C11.8264 16.0095 11.4849 15.0882 11.2549 14.1363C11.7356 13.6168 12.2564 13.1359 12.8124 12.6979C13.9409 11.751 14.3363 11.3995 14.4184 10.9347C14.5907 9.94722 10.8341 4.02259 9.99 3.01203C9.63619 2.59347 9.31475 2.3125 8.90312 2.3125C7.70987 2.3125 2.3125 8.98638 2.3125 9.85125C2.3125 9.92178 2.42812 16.8697 11.2029 25.7971C20.1303 34.5719 27.0782 34.6875 27.1488 34.6875C28.0136 34.6875 34.6875 29.2901 34.6875 28.0969C34.6875 27.6852 34.4065 27.3638 33.9857 27.01Z" fill="#DA2A2C" />
                                            <path d="M26.5938 17.3438H28.9062C28.9035 14.8913 27.9281 12.5402 26.1939 10.8061C24.4598 9.07194 22.1087 8.0965 19.6562 8.09375V10.4062C21.4956 10.4081 23.2591 11.1396 24.5598 12.4402C25.8604 13.7409 26.5919 15.5044 26.5938 17.3438Z" fill="#DA2A2C" />
                                            <path d="M32.375 17.3438H34.6875C34.6829 13.3586 33.0978 9.53803 30.2799 6.72012C27.462 3.90221 23.6414 2.31709 19.6562 2.3125V4.625C23.0283 4.62898 26.261 5.97026 28.6454 8.35463C31.0297 10.739 32.371 13.9717 32.375 17.3438Z" fill="#DA2A2C" />
                                        </svg>

                                        <div className="ms-3">
                                            <h4>Call Us</h4>
                                            <p>+1 376 653 3763</p>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="d-flex align-items-center">

                                        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clipPath="url(#clip0_25_4095)">
                                                <path d="M43.6124 8.7417L30.2681 22L43.6124 35.2584C43.8536 34.7542 43.9999 34.1968 43.9999 33.6016V10.3985C43.9999 9.8032 43.8536 9.24589 43.6124 8.7417Z" fill="#DA2A2C" />
                                                <path d="M40.1329 6.53125H3.86724C3.27195 6.53125 2.71464 6.6776 2.21045 6.91883L19.2659 23.8883C20.7739 25.3963 23.2262 25.3963 24.7342 23.8883L41.7896 6.91883C41.2855 6.6776 40.7282 6.53125 40.1329 6.53125Z" fill="#DA2A2C" />
                                                <path d="M0.387578 8.7417C0.146352 9.24589 0 9.8032 0 10.3985V33.6016C0 34.1969 0.146352 34.7543 0.387578 35.2584L13.7319 22L0.387578 8.7417Z" fill="#DA2A2C" />
                                                <path d="M28.4454 23.8228L26.5571 25.7111C24.0443 28.2238 19.9557 28.2238 17.443 25.7111L15.5547 23.8228L2.21045 37.0811C2.71464 37.3223 3.27195 37.4687 3.86724 37.4687H40.1329C40.7282 37.4687 41.2855 37.3223 41.7896 37.0811L28.4454 23.8228Z" fill="#DA2A2C" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_25_4095">
                                                    <rect width="44" height="44" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>

                                        <div className="ms-3">
                                            <h4>Mail Us</h4>
                                            <p>abcd@gmail.com</p>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </footer>

            <div className="copyright bg-black">
                <hr className="m-0" />
                <p className="text-center mb-0 pb-3 text-white pt-3">Copyright 2024 <b>ToXSL Technologies</b>. All Rights Reserved. </p>
            </div>
        </>
    );
};
export default Coupon