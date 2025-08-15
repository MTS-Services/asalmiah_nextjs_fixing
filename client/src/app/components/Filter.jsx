/**
@copyright : Mak Tech Solution < www.maktechsolution.com >
@author     : Nayem Islam < inaeem707@gmail.com >

All Rights Reserved.
Proprietary and confidential: All information contained herein is, and remains
the property of Mak Tech Solution and its partners.
Unauthorized copying of this file, via any medium, is strictly prohibited.
*/

'use client';

import { useDispatch } from 'react-redux';
import { Form } from 'react-bootstrap';
import MultiRangeSlider from 'multi-range-slider-react';
import classNames from 'classnames';

import { checkLanguage, formatCurrency } from '../../../utils/helper';

const Filter = (props) => {
  const {
    companyList,
    classListFilter,
    companyArr,
    setCompanyArr,
    setClassificationArr,
    setMinPrice,
    setMaxPrice,
    setMinDiscount,
    setMaxDiscount,
    selectedCountry,
    maxDiscount,
    minDiscount,
    minPrice,
    maxPrice,
  } = props;

  const language = localStorage.getItem('language');
  let dispatch = useDispatch();
  const isArabic = language === 'ar';

  // ================================
  // 📁 HANDLE INPUT
  // ================================
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
      <div className='left-sidebar-innr'>
        {/****************** COMPANY CAT: ******************/}
        <article className='collection-list'>
          <h6 className='text-capitalize mt-4 mb-4 fw-bold'>Company</h6>

          <ul
            className={`mb-4 ${
              companyList?.length >= 10 ? 'overflow-auto' : ''
            }`}
            style={{ maxHeight: companyList?.length >= 10 ? '200px' : 'auto' }}
          >
            {companyList?.map((items) => {
              return (
                <div key={items?._id}>
                  <li
                    className={classNames(
                      'd-flex align-items-center mb-3 gap-2',
                      {
                        'flex-row-reverse': isArabic,
                      }
                    )}
                    key={items.id}
                  >
                    <Form.Check
                      type='checkbox'
                      id={items._id}
                      label=''
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
                    <span className='text-capitalize'>
                      {checkLanguage(items?.company, items?.arabicCompany)}
                    </span>
                  </li>
                </div>
              );
            })}
          </ul>
        </article>

        {/****************** CLASS CAT: ********************/}
        <article className='collection-list border-top'>
          <h6 className='text-capitalize mt-4 mb-4 fw-bold'>class</h6>

          <ul
            className={`mb-4 ${
              classListFilter?.length >= 10 ? 'overflow-auto' : ''
            }`}
            style={{
              maxHeight: classListFilter?.length >= 10 ? '200px' : 'auto',
            }}
          >
            {classListFilter && classListFilter.length > 0
              ? classListFilter.map((items, i) => (
                  <li
                    className={classNames(
                      'd-flex align-items-center mb-3 gap-2',
                      {
                        'flex-row-reverse': isArabic,
                      }
                    )}
                    key={i}
                  >
                    <Form.Check
                      type='checkbox'
                      id={items._id}
                      label=''
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
                    <span className='text-capitalize'>
                      {checkLanguage(items?.name, items?.arbicName)}
                    </span>
                  </li>
                ))
              : ''}
          </ul>
        </article>

        {/****************** PRIZE RANGE ***************/}
        <article className='border-top collection-list'>
          <h6 className='text-capitalize mt-4 mb-4 fw-bold'>
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
            max={1000}
            step={1}
            minValue={minPrice}
            maxValue={maxPrice}
            onInput={(e) => {
              handleInput(e);
            }}
          />
        </article>

        {/****************** DISCOUNT RANGE ******************/}
        <article className='collection-list border-top mb-3'>
          <h6 className='text-capitalize mt-4 mb-4 fw-bold'>
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
        </article>

        {/****************** APPLY BUTTON **************/}
        {/* <div className='d-flex gap-2 justify-content-center'>
          <button
            className='btn btn-primary'
            title='Filter'
            onClick={(e) => {
              e.preventDefault();
              refetch();
            }}
          >
            Apply
          </button>

          <button
            className='btn btn-outline-secondary'
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
        </div> */}
      </div>
    </>
  );
};

export default Filter;
