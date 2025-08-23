/**
 * @copyright : Toxsl Technologies Pvt. Ltd. < www.ozvid.com >
  @author     : Shiv Charan Panjeta 
  
  All Rights Reserved.
  Proprietary and confidential :  All information contained herein is, and remains
  the property of Toxsl Technologies Pvt. Ltd. and its partners.
  Unauthorized copying of this file, via any medium is strictly prohibited.
 * 
 */

import { useSelector } from "react-redux";

const useCartSlice = () => {
  return useSelector((state) => state?.cartStore?.cart?.cartItems);
};

export default useCartSlice;
