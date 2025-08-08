import { useRouter } from 'next/navigation';
import { Col, Container, Row } from 'react-bootstrap';
import ImageComponent from '../../../utils/ImageComponent';

export default function OfferListComponent({ OfferLists }) {
  /*************OFFER LIST **************/
  console.log(OfferLists);
  let router = useRouter();
  return (
    <>
      <Container>
        <Row>
          {OfferLists?.length !== 0
            ? OfferLists?.slice(0, 1)?.map((data) => {
                return (
                  <>
                    <Col
                      md={6}
                      onClick={() =>
                        router.push(`/product-list?companyId=${data?.company}`)
                      }
                      className='cursor-pointer'
                    >
                      <div className='productcard1 position-relative mb-3'>
                        <ImageComponent
                          data={data?.image}
                          ShimmerClassName={'h-100'}
                          className='w-100'
                          alt='Image'
                          width={50}
                          height={50}
                          dynamicLabellingState={true}
                        />
                        {/* <div className="position-absolute"> */}
                        {/* <h3>
                    {" "}
                    {checkLanguage(data?.title, data?.arabicTitle)}
                  </h3> */}
                        {/* {data?.discount && (
                          <h5>
                            {" "}
                            {data?.discount
                              ? FORMAT_NUMBER(data?.discount, true) + "% Off"
                              : ""}
                          </h5>
                        )} */}
                        {/* </div> */}
                      </div>
                    </Col>
                  </>
                );
              })
            : ''}

          <Col md={6}>
            <Row>
              {OfferLists?.slice(1, 2)?.map((data) => {
                return (
                  <>
                    <Col
                      md={6}
                      onClick={() =>
                        router.push(`/product-list?companyId=${data?.company}`)
                      }
                      className='cursor-pointer'
                    >
                      <div className='productcard2 position-relative mb-3'>
                        <ImageComponent
                          data={data?.image}
                          className='w-100 mb-3'
                          alt='Image'
                          width={50}
                          height={50}
                          dynamicLabellingState={true}
                        />

                        {/* <div className="position-absolute"> */}
                        {/* <h3>
                      {" "}
                      {checkLanguage(data?.title, data?.arabicTitle)}
                    </h3> */}
                        {/* {data?.discount && (
                            <h5>
                              {" "}
                              {data?.discount
                                ? FORMAT_NUMBER(data?.discount, true) + "% Off"
                                : ""}
                            </h5>
                          )} */}
                        {/* </div> */}
                      </div>
                    </Col>
                  </>
                );
              })}

              {OfferLists?.slice(2, 3)?.map((data) => {
                return (
                  <>
                    <Col
                      md={6}
                      onClick={() =>
                        router.push(`/product-list?companyId=${data?.company}`)
                      }
                      className='cursor-pointer'
                    >
                      <div className='productcard3 position-relative mb-3'>
                        <ImageComponent
                          data={data?.image}
                          className='w-100 mb-3'
                          alt='Image'
                          width={50}
                          height={50}
                          dynamicLabellingState={true}
                        />

                        {/* <div className="position-absolute"> */}
                        {/* <h3>{data?.title ?? ""}</h3> */}
                        {/* {data?.discount && (
                            <h5>
                              {" "}
                              {data?.discount
                                ? FORMAT_NUMBER(data?.discount, true) + "% Off"
                                : ""}
                            </h5>
                          )} */}
                        {/* </div> */}
                      </div>
                    </Col>
                  </>
                );
              })}

              {OfferLists?.slice(3, 4)?.map((data) => {
                return (
                  <>
                    <Col
                      md={12}
                      onClick={() =>
                        router.push(`/product-list?companyId=${data?.company}`)
                      }
                      className='cursor-pointer'
                    >
                      <div className='productcard3 position-relative mb-3'>
                        <ImageComponent
                          data={data?.image}
                          className='w-100 mb-3'
                          alt='Image'
                          width={50}
                          height={285}
                          dynamicLabellingState={true}
                        />

                        {/* <div className="position-absolute"> */}
                        {/* <h3>{data?.title ?? ""}</h3> */}
                        {/* {data?.discount && (
                            <h5>
                              {" "}
                              {data?.discount
                                ? FORMAT_NUMBER(data?.discount, true) + "% Off"
                                : ""}
                            </h5>
                          )} */}
                        {/* </div> */}
                      </div>
                    </Col>
                  </>
                );
              })}
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}
