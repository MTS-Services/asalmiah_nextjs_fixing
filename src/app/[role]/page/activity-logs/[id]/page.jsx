/**
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

import { singleEmailView } from "../../../../../../services/APIServices";
import React from "react";

const ActivityLogsView = async ({ params }) => {
  const responseData = await singleEmailView(params.id);
  const data = responseData.data?.data;

  return (
    <>
      <div key={""} className="col-md-4">
        <div className="product_content">
          <h4 className="product_title">{data?.title}</h4>
          <div dangerouslySetInnerHTML={{ __html: data?.description }} />
        </div>
      </div>
    </>
  );
};

export default ActivityLogsView;
