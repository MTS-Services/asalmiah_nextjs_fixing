/**
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

const _category = require("../app/category/controller/category.controller");
const _product = require("../app/product/controller/product.controller");
const _subcategory = require("../app/subCategory/controller/subCategory.controller");
const _wishlist = require("../app/wishlist/controller/controller");
const _company = require("../app/company/controller/controller");
const _cart = require("../app/cart/controller/controller");
const _branch = require("../app/branch/controller/controller");
const _address = require("../app/address/controller/address.controller");
const _order = require("../app/order/controller/order.controller");
const _promocode = require("../app/promoCode/controller/controller");
const _review = require("../app/review/controller/review.controller");
const _notification = require("../app/notification/controller/notification.controller");
const _scheduleOrder = require("../app/scheduleOrder/controller/controller");
const _user = require("../app/userService/controller/userController");
const _dynamic = require("../app/dynamicQuestion/controller/controller");
const _coupon = require("../app/coupon/controller/controller");
const _payment = require("../app/payment/controller/payment.controller");
const _spinner = require("../app/spinner/controller/spinner.controller");
const _dynamicLabeling = require("../app/dynamicLabeling/controller/controller")

/* Category Management  */
router.group("/category", (category) => {
  category.get("/list", _category.list);
  category.get("/detail/:id", _category.detail);
});

/* Sub category Management  */
router.group("/subcategory", (subcategory) => {
  subcategory.get("/list", _subcategory.activeSubcategory);
  subcategory.get("/detail/:id", _subcategory.detail);
});

/* Product Management  */
router.group("/product", (product) => {
  product.post("/add", _product.add);
  product.get("/list", _product.list);
  product.get("/detail/:id", _product.detail);
  product.put("/edit/:id", _product.update);
  product.delete("/delete/:id", _product.delete);
  product.put("/updateState/:id", _product.updateState);
  product.delete("/deleteImg/:id", _product.deleteImg);
  product.get("/userProduct", _product.userProduct);
  product.get("/userProducts", _product.userProducts);
  product.get("/similarProductList", _product.similarProductList);
  product.get("/bestSellerProduct", _product.bestSellerProduct);
  product.get("/sellerGraphProduct", _product.sellerGraphProduct);
  product.get("/ratingPerformance", _product.ratingPerformance);
  product.get("/newArrival", _product.newArrival);
  product.get("/searchProductList", _product.searchProductList);

});

/* Wishlist Management  */
router.group("/wishlist", (wishlist) => {
  wishlist.post("/add", _wishlist.addWishlist);
  wishlist.get("/list", _wishlist.getwishList);
});

/* Company Management  */
router.group("/company", (company) => {
  company.get("/companyByCategory", _company.companyFilter);
  company.get("/companyDetails/:id", _company.detail);
  company.get("/list", _company.list);
  company.get("/couponCompany", _company.couponCompany);
  company.get("/companyByCategory/v1", _company.companyByCategory);
  company.get("/allCompany", _company.allCompany);
  company.get("/companyByOffer", _company.companyByOffer);
  company.get("/electricCompany", _company.electricCompany);
  company.get("/popularToday", _company.popularToday);
  company.get("/newArrival", _company.newArrival);
});

/* Cart Management  */
router.group("/cart", (cart) => {
  cart.post("/add", _cart.addCart);
  cart.get("/list", _cart.myCart);
  cart.delete("/removeCart/:id", _cart.removeProduct);
  cart.delete("/clearCart", _cart.cartClear);
  cart.put("/increaseQuantity/:id", _cart.increaseQuantity);
  cart.put("/decreaseQuantity/:id", _cart.decreaseQuantity);
});

/* Branch Management  */
router.group("/branch", (branch) => {
  branch.post("/add", _branch.add);
  branch.get("/list", _branch.list);
  branch.put("/edit/:id", _branch.update);
  branch.delete("/delete/:id", _branch.delete);
  branch.put("/updateState/:id", _branch.updateState);
  branch.get("/branchByCompany", _branch.branchByCompany);
  branch.get("/detail/:id", _branch.detail);
});

/* Address Management  */
router.group("/address", (address) => {
  address.post("/add", _address.addAddress);
  address.get("/list", _address.myAddress);
  address.get("/details/:id", _address.addressDetails);
  address.put("/edit/:id", _address.editAddress);
  address.put("/setDefault/:id", _address.setDefaultAddress);
  address.delete("/delete/:id", _address.deleteAddress);
});

/* Order Management  */
router.group("/order", (order) => {
  order.put("/verifyAccount", _order.verifyAccount);
  order.put("/verifyOtpForOrder", _order.verifyOtpForOrder);
  order.put("/resendOtpForOrder", _order.resendOtpForOrder);
  order.post("/createOrder", _order.createOrder);
  order.get("/myOrder", _order.myOrder);
  order.get("/orderDetails/:id", _order.orderDetails);
  order.put("/cancelOrder/:id", _order.cancelOrder);
  order.put("/updateOrderState/:id", _order.updateOrderState);
  order.get("/sellerOrderList", _order.sellerOrderlist);
  order.get("/sellerGraphData", _order.sellerGraphData);
  order.get("/invoiceList", _order.userInvoiceList);
  order.get("/downloadOrderReport/:id", _order.downloadOrderReport);
  order.get("/downloadOrderInvoice/:id", _order.downloadOrderInvoice);
});

/* Promocode Management  */
router.group("/promotion", (promotion) => {
  promotion.get("/activeList", _promocode.actovePromoCode);
  promotion.put("/applyPromoCode", _promocode.applyPromoCode);
});

/* Review Management  */
router.group("/review", (review) => {
  review.post("/add", _review.addReview);
  review.delete("/delete/:id", _review.deleteReview);
  review.get("/list", _review.reviewByProduct);
});

/* Notification Management  */
router.group("/notification", (notification) => {
  notification.get("/myNotification", _notification.getUserNotification);
  notification.delete("/deleteNotification", _notification.deleteNotification);
});

/* Schedule order  */
router.group("/scheduleOrder", (scheduleOrder) => {
  scheduleOrder.get("/slotList/:id", _scheduleOrder.slotList);
  scheduleOrder.post("/scheduleOrder", _scheduleOrder.scheduleOrder);
});

/* Dashboard Management */
router.group("/dashboard", (dashboard) => {
  dashboard.get("/count", _user.userDashboardCount);
});

/* Dynamic question management  */
router.group("/dynamic", (dynamic) => {
  dynamic.post("/submitAnswer", _dynamic.sendAnswer);
});

/* Coupon management  */
router.group("/coupon", (coupon) => {
  coupon.get("/list", _coupon.list);
  coupon.get("/details/:id", _coupon.details);
  coupon.get("/manuallyAddCode", _coupon.manuallyAddCode);
  coupon.get("/scanCoupon/:id", _coupon.scanCoupon);
});

/* Pyament Management  */
router.group("/payment", (payment) => {
  payment.post("/charge", _payment.addCharge);
  payment.post("/createAppCharge", _payment.createAppCharge);
  payment.get("/charge", _payment.getChargeRecord);
  payment.get("/myTransaction", _payment.myTransaction);
  payment.get("/transactionView/:id", _payment.transactionView);
  payment.get("/transactionGraph", _payment.transactionGraph);
  payment.get("/myRefundList", _payment.myRefundList);
  payment.get("/cardList", _payment.cardList);
  payment.delete("/deleteCard/:cardId", _payment.deleteCard);
  payment.post("/sellerAddRefund", _payment.sellerAddRefund);
});

/* Spinner Management  */
router.group("/spinner", (spinner) => {
  spinner.get("/list", _spinner.list);
  spinner.get("/detail/:id", _spinner.detail);
  spinner.post("/win", _spinner.winnerData);
  spinner.get("/win/list", _spinner.winList);
});

// /* Cash back management  */
router.group("/cashback", (cashback) => {
  cashback.get("/myCashBack", _user.myCashBack);
});

/* Management Dynamic labeling */
router.group("/dynamicLabeling", (dynamicLabeling) => {
  dynamicLabeling.get("/activeLabeling", _dynamicLabeling.activeLabeling);
  dynamicLabeling.get("/allLabeling", _dynamicLabeling.allLabeling);
});


module.exports = router;
