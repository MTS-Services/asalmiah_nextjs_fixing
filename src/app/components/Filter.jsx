/**
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
'use client';

import { useQuery } from '@tanstack/react-query';
import MultiRangeSlider from 'multi-range-slider-react';
import { Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { searchQuery } from '../../../redux/features/searchQuery';
import {
  GET_FILTER_CLASSIFICATION_API,
  USER_COMPANYLIST,
} from '../../../services/APIServices';
import { checkLanguage, formatCurrency } from '../../../utils/helper';

const Filter = (props) => {
  const {
    selectedCountry,
    refetch,
    companyArr,
    setCompanyArr,
    setCategoryArr,
    categoryArr,
    setClassificationArr,
    classificationArr,
    subCategoryArr,
    setSubCategoryArr,
    setSearch,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    minDiscount,
    setMinDiscount,
    maxDiscount,
    setMaxDiscount,
  } = props;

  // const { data: categoryList } = useQuery({
  //   queryKey: ['category-list'],
  //   queryFn: async () => {
  //     const resp = await GET_CATEGORY_LIST_HOME();
  //     return resp?.data?.data ?? [];
  //   },
  // });

  const { data: classificationListFilter } = useQuery({
    queryKey: ['classification-filter-list'],
    queryFn: async () => {
      const resp = await GET_FILTER_CLASSIFICATION_API();
      return resp?.data?.data ?? [];
    },
  });

  // const { data: subcategoryList } = useQuery({
  //   queryKey: ["subcategory-list"],
  //   queryFn: async () => {
  //     const resp = await GET_SUB_CATEGORY_LIST_HOME();
  //     return resp?.data?.data ?? [];
  //   },
  // });

  let dispatch = useDispatch();

  const { data: companyList } = useQuery({
    queryKey: ['company-list'],
    queryFn: async () => {
      const resp = await USER_COMPANYLIST();
      return resp?.data?.data ?? [];
    },
  });

  const language = localStorage.getItem('language');
  // const { data: categoryList } = useQuery({
  //   queryKey: ["category-list"],
  //   queryFn: async () => {
  //     const resp = await GET_CATEGORY_LIST_HOME();
  //     return resp?.data?.data ?? [];
  //   },
  // });

  const handleInput = (e) => {
    setMinPrice(e.minValue);
    setMaxPrice(e.maxValue);
  };

  const handleInputDiscount = (e) => {
    setMinDiscount(e.minValue);
    setMaxDiscount(e.maxValue);
  };
  return (
    <>
      <div className='left-sidebar-innr '>
        <div className='collection-list'>
          <h6 className='text-capitalize mt-4 mb-4 fw-bold'>Companies</h6>

          <ul className={companyList?.length >= 10 ? 'mb-4 scroller' : 'mb-4'}>
            {companyList?.map((items) => {
              return (
                <div key={items?._id}>
                  <li
                    className='d-flex align-items-center mb-3 gap-2'
                    key={items.id}
                  >
                    <Form.Check
                      type='checkbox'
                      id={items._id}
                      label={checkLanguage(
                        items?.company,
                        items?.arabicCompany
                      )}
                      checked={companyArr.includes(items._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCompanyArr((prevCompany) => [
                            ...prevCompany,
                            items._id,
                          ]);
                        } else {
                          setCompanyArr((prevCompany) =>
                            prevCompany.filter((id) => id !== items._id)
                          );
                        }
                      }}
                    />
                  </li>
                </div>
              );
            })}
          </ul>
        </div>

        {/* <div className="collection-list border-top">
          <h6 className="text-capitalize mt-4 mb-2 fw-bold">categories</h6>

          <ul className="mb-4 ">
            {categoryList && categoryList.length > 0
              ? categoryList.map((items, i) => (
                <li className="d-flex align-items-center mb-3 gap-2" key={i}>
                  <Form.Check
                    type="checkbox"
                    id={items._id}
                    label={items?.category}
                    checked={categoryArr.includes(items._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCategoryArr((prevCategory) => [
                          ...prevCategory,
                          items._id,
                        ]);
                      } else {
                        setCategoryArr((prevCategory) =>
                          prevCategory.filter((id) => id !== items._id)
                        );
                      }
                    }}
                  />
                </li>
              ))
              : ""}
          </ul>
        </div> */}

        <div className='collection-list border-top'>
          <h6 className='text-capitalize mt-4 mb-4  fw-bold'>classification</h6>

          <ul
            className={
              classificationListFilter?.length >= 10 ? 'mb-4 scroller' : 'mb-4'
            }
          >
            {classificationListFilter && classificationListFilter.length > 0
              ? classificationListFilter.map((items, i) => (
                  <li className='d-flex align-items-center mb-3 gap-2' key={i}>
                    <Form.Check
                      type='checkbox'
                      id={items._id}
                      // label={items?.name}
                      label={checkLanguage(items?.name, items?.arbicName)}
                      checked={classificationArr.includes(items._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setClassificationArr((prevClassification) => [
                            ...prevClassification,
                            items._id,
                          ]);
                        } else {
                          setClassificationArr((prevClassification) =>
                            prevClassification.filter((id) => id !== items._id)
                          );
                        }
                      }}
                    />
                  </li>
                ))
              : ''}
          </ul>
        </div>

        {/* <div className="collection-list border-top">
          <h6 className="text-capitalize mt-4 mb-2 fw-bold">Sub Categories</h6>
          <ul className="mb-4 ">
            {subcategoryList && subcategoryList.length > 0
              ? subcategoryList.map((items, i) => (
                  <li className="d-flex align-items-center mb-3 gap-2" key={i}>
                    <Form.Check
                      type="checkbox"
                      id={items._id}
                      label={items?.subcategory}
                      checked={subCategoryArr.includes(items._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSubCategoryArr((prevCategory) => [
                            ...prevCategory,
                            items._id,
                          ]);
                        } else {
                          setSubCategoryArr((prevCategory) =>
                            prevCategory.filter((id) => id !== items._id)
                          );
                        }
                      }}
                    />
                  </li>
                ))
              : ""}
          </ul>
        </div> */}
        <div className='collection-list border-top'>
          <h6 className='text-capitalize mt-4 mb-4  fw-bold'>
            Price range{' '}
            {` (${
              formatCurrency('', selectedCountry) +
              ' ' +
              minPrice +
              ' - ' +
              formatCurrency('', selectedCountry) +
              ' ' +
              maxPrice
            })`}
          </h6>
          <MultiRangeSlider
            min={0}
            max={1000000}
            step={0}
            minValue={minPrice}
            maxValue={maxPrice}
            onInput={(e) => {
              handleInput(e);
            }}
          />
        </div>

        <div className='collection-list border-top mb-3'>
          <h6 className='text-capitalize mt-4 mb-4  fw-bold'>
            Discount range{' '}
            {` (${minDiscount + '%' + ' - ' + maxDiscount + '%'})`}
          </h6>
          <MultiRangeSlider
            min={0}
            max={100}
            step={1}
            minValue={minDiscount}
            maxValue={maxDiscount}
            onInput={(e) => handleInputDiscount(e)}
          />
        </div>

        <div className='d-flex gap-1 justify-content-center'>
          <button
            className='btn-theme btn'
            title='Filter'
            onClick={(e) => {
              e.preventDefault();
              refetch();
            }}
          >
            Apply
          </button>

          <button
            className='btn-theme btn'
            title='Reset Filter'
            onMouseUpCapture={(e) => {
              e.preventDefault();
              setCategoryArr([]);
              setSubCategoryArr([]);
              setCompanyArr([]);
              setClassificationArr([]);
              dispatch(searchQuery(''));
              setSearch('');
              setMinPrice(0);
              setMaxPrice(100000);
              setMaxDiscount(100);
              setMinDiscount(0);

              setTimeout(() => {
                refetch();
              }, 100);
            }}
          >
            Clear
          </button>
        </div>
      </div>
    </>
  );
};

export default Filter;
