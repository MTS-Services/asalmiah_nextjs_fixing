"use client"

import React from "react";
import { useSelector } from "react-redux";
import useSlider from "../../../../hooks/useSlider";

const Loading = () => {
  const toggleVal = useSlider();
  return (
    <div className={toggleVal ? "bodymain fullbody" : "bodymain "}>
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center flex-wrap"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
