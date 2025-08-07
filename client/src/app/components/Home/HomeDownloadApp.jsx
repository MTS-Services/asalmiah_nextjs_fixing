'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Col, Container, Row } from 'react-bootstrap';
import apple from '../../../../public/assets/img/a.png';
import downloadimg from '../../../../public/assets/img/app.png';
import googlestore from '../../../../public/assets/img/g.png';

const HomeDownloadApp = () => {
  return (
    <section className='downloadapp'>
      <Container>
        <Row className='align-items-center'>
          <Col md={6}>
            <div className='download-content'>
              <h3>Make your online shop easier with our mobile app</h3>
              <p>
                We offer high-quality films and the best documentary
                selection,and the ability to browse alphabetically and by genre
              </p>
              <div className='mt-5 d-flex align-items-center flex-wrap gap-2'>
                <Link
                  href='https://apps.apple.com/us/app/offarat-%D8%A3%D9%88%D9%81%D8%B1%D8%A7%D8%AA/id6445883175'
                  className='me-3 mb-3'
                  target='_blank'
                >
                  <Image src={apple} />
                </Link>
                <Link
                  href='https://play.google.com/store/search?q=offarat&c=apps&hl=en_IN'
                  className='mb-3 mt-lg-0 '
                  target='_blank'
                >
                  <Image src={googlestore} />
                </Link>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <Image src={downloadimg} className='img-fluid mx-auto d-block' />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HomeDownloadApp;
