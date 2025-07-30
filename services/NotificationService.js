/*
@copyright : Toxsl Technologies Pvt. Ltd. < www.ozvid.com >
@author     : Shiv Charan Panjeta < shiv@ozvid.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of Toxsl Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
"use client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const showNotification = (type, message, toastId = "") => {
  switch (type) {
    case "success":
      toast.success(message, {
        position: "top-right",
      });
      break;
    case "danger":
      toast.error(message, {
        position: "top-right",
        toastId: toastId,
      });
      break;
    case "default":
      toast(message, {
        position: "top-right",
      });
      break;
    default:
      break;
  }
};

export default showNotification;
