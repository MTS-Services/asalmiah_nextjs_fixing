"use client";

import Image from "next/image";
import logo from "../../../../public/assets/img/search_no.png";
function NoDataFound() {
  return (
    <>
      <div className="empty-state">
        <div className="empty-state__content">
          <div className="empty-state__icon">
            {/* logo for no -data-found */}
            {/* <Image width={300} src={logo} alt="logo" /> */}
          </div>
          <div className="empty-state__message"> No Data Found</div>
        </div>
      </div>
    </>
  );
}

export default NoDataFound;
