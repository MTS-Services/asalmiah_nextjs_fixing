'use client';

import { Col, Container, Row } from 'react-bootstrap';
import {
  PAYMENT_SECURE,
  PRODUCT_PACKAGING,
  REFUND_POLICY_ICON,
  SERVICES_HOME,
  SUPPORT_CARE,
} from '../SvgIcons';

const HomeServices = () => {
  return (
    <section className='services'>
      <div className='heading-section text-center mb-lg-5 mb-3'>
        <Container>
          <Row>
            <Col md={8} className='mx-auto'>
              <SERVICES_HOME />
              <h3>Our Services</h3>

              <svg
                width='94'
                height='4'
                viewBox='0 0 94 4'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <rect width='94' height='4' fill='#DA2A2C' />
              </svg>
            </Col>
          </Row>
        </Container>
      </div>
      <Container>
        <Row>
          <Col lg={3} md={6} className='mb-3'>
            <div className='featurecard text-center servicecard pt-5 pb-4'>
              <PRODUCT_PACKAGING />
              <br />
              <h4 className='mt-4'>Product Packing</h4>
              <p>
                Elevate your e-commerce success with protective, sustainable,
                and eye-catching packaging that enhances brand identity and
                customer experience.
              </p>
            </div>
          </Col>

          <Col lg={3} md={6} className='mb-3'>
            <div className='featurecard text-center servicecard pt-5 pb-4'>
              <SUPPORT_CARE />
              <br />
              <h4 className='mt-4'>24/7 Support</h4>
              <p>
                Get instant help anytime with our 24/7 Support Service, designed
                to assist you with all your shopping needs. Whether you have
                questions or need assistance, our team is here to ensure a
                seamless shopping experience, day or night!
              </p>
            </div>
          </Col>

          <Col lg={3} md={6} className='mb-3'>
            <div className='featurecard text-center servicecard pt-5 pb-4'>
              <REFUND_POLICY_ICON />
              <br />
              <h4 className='mt-4'>Refund Policy</h4>
              <p>
                Enjoy peace of mind with our Instant Refund Policy, where you
                can receive your refund immediately upon return approval. We
                prioritize your satisfaction, making the return process quick
                and hassle-free!
              </p>
            </div>
          </Col>

          <Col lg={3} md={6} className='mb-3'>
            <div className='featurecard text-center servicecard pt-5 pb-4'>
              <PAYMENT_SECURE />
              <br />
              <h4 className='mt-4'>Payment Secure</h4>
              <p>
                Shop confidently with our Payment Secure feature, ensuring your
                transactions are protected with the latest encryption
                technology. Your financial information is safe with us, allowing
                you to focus on enjoying your shopping experience!
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HomeServices;
