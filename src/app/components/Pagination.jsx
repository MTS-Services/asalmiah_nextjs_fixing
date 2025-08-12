/**
@copyright  :   ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     :   Shiv Charan Panjeta
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of ToXSL Technologies Pvt. Ltd. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
import ReactPaginate from "react-paginate";

import { Paginations } from "../../../utils/constants";
import "../[role]/page.module.scss";
export function Pagination(props) {
  const { totalCount, handelPageChange, pageCount, page } = props;
  const forcePage = page ? page - 1 : ""
  return (
    <div style={{ margin: "-10px" }}>
      {pageCount == "YES"
        ? Math.ceil(totalCount / Paginations?.PRODUCT_PER_PAGE) > 1 && (
          <div className="float-end">
            <ReactPaginate
              containerClassName={"pagination position-relative mt-5 pt-3"}
              previousLinkClassName={"pagination__link"}
              nextLinkClassName={"pagination__link"}
              disabledClassName={"pagination__link--disabled"}
              activeClassName={"pagination__link--active"}
              previousLabel={"Previous"}
              nextLabel={"Next"}
              onPageChange={(e) => handelPageChange(e)}
              pageCount={Math.ceil(
                totalCount / Paginations?.PRODUCT_PER_PAGE
              )}
              forcePage={forcePage}
            />
          </div>
        )
        : Math.ceil(totalCount / Paginations?.PER_PAGE) > 1 && (
          <div className="float-end">
            <ReactPaginate
              containerClassName={"pagination position-relative mt-5 pt-3"}
              previousLinkClassName={"pagination__link"}
              nextLinkClassName={"pagination__link"}
              disabledClassName={"pagination__link--disabled"}
              activeClassName={"pagination__link--active"}
              previousLabel={"Previous"}
              nextLabel={"Next"}
              onPageChange={(e) => handelPageChange(e)}
              pageCount={Math.ceil(totalCount / Paginations?.PER_PAGE)}
              forcePage={forcePage}

            />
          </div>
        )}
    </div>
  );
}
