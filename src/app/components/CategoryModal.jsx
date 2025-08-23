'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Modal } from 'react-bootstrap';
import { GET_SUBCATEGORY_LIST_HOME } from '../../../services/APIServices';
import { Paginations } from '../../../utils/constants';
import { checkLanguage } from '../../../utils/helper';
import ImageComponent from '../../../utils/ImageComponent';
import { Pagination } from './Pagination';

const CategoryModal = ({
  show,
  onHide,
  categoryId,
  onSubCategoryClick,
  page,
  setPage,
  meta,
  setMeta,
}) => {
  const { data: subCategoryList, isPending } = useQuery({
    queryKey: ['subcategory-list-home', categoryId?.id, page],
    queryFn: async () => {
      if (!categoryId?.id) {
        return null;
      }
      const resp = await GET_SUBCATEGORY_LIST_HOME(categoryId?.id, page);
      setMeta(resp?.data?._meta);
      return resp?.data?.data ?? [];
    },
  });

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {checkLanguage(categoryId?.name, categoryId?.arabic)}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='delivery-main'>
          <ul className='list-sub-category subcategory_list_render'>
            {isPending ? (
              <ImageComponent content={true} />
            ) : subCategoryList?.length !== 0 ? (
              subCategoryList?.map((data) => {
                return (
                  <li key={data?._id}>
                    <Link
                      href={`/company-list?categoryId=${data?.categoryId}&subCategoryId=${data?._id}`}
                      onClick={() => {
                        onSubCategoryClick(data);
                        onHide();
                      }}
                    >
                      <Image
                        src={data?.subCategoryImg}
                        width={70}
                        height={70}
                        alt='subcategory-img'
                      />

                      <h4>
                        {checkLanguage(
                          data?.subcategory,
                          data?.arabicSubcategory
                        )}
                      </h4>
                    </Link>
                  </li>
                );
              })
            ) : (
              <p className='text-center'>No Data Found</p>
            )}
          </ul>

          {Math.ceil(meta?.totalCount / 10) > 1 && (
            <Pagination
              totalCount={meta?.totalCount}
              handelPageChange={(e) => setPage(e.selected + 1)}
            />
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CategoryModal;
