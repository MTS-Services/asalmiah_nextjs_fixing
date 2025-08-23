"use client";

function NoDataFound(props) {
  return (
    <>
      <div className="empty-state">
        <div className="empty-state__content">
          <div className="empty-state__icon">
            {/* logo for no -data-found */}
            {/* <Image height={57} width={154} src={logo} alt="logo" /> */}
          </div>
          <div className="empty-state__message">
            {props?.text ? props?.text : "No Data Found"}
          </div>
        </div>
      </div>
    </>
  );
}

export default NoDataFound;
