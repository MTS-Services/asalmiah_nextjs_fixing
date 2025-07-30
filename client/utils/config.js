/*
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author    : Shiv Charan Panjeta < shiv@toxsl.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of ToXSL Technologies Pvt. Ltd. and it's partners.O
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

let apiBase = process.env.NEXT_PUBLIC_API;

if (apiBase === "https://www.offarat.com/api/") {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}
export default apiBase;
