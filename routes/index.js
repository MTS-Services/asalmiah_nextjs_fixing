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

require("express-group-routes");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Offarat Server" });
});

const handleResponse = require("../middleware/handleResponse");
const _tokenManager = require("../middleware/auth");
const USER_CONTROLLER = require("../app/userService/controller/userController");
const FAQ_CONTROLLER = require("../app/faq/controller/faq.controller");
const CONTACT_CONTROLLER = require("../app/contactUs/controller/contactUs.controller");
const cms = require("../app/cms/controller/page.controller");
const cms_ = new cms();
const _category = require("../app/category/controller/category.controller");
const _subcategory = require("../app/subCategory/controller/subCategory.controller");
const _product = require("../app/product/controller/product.controller");
const _company = require("../app/company/controller/controller");
const _banner = require("../app/banner/controller/banner.controller");
const _testimonial = require("../app/testimonial/controller/testimonial.controller");
const _contactInfo = require("../app/contactInfo/controller/controller");
const _classification = require("../app/classification/controller/controller");
const _class = require("../app/class/controller/class.controller");
const _review = require("../app/review/controller/review.controller");
const _payment = require("../app/payment/controller/payment.controller");
const { webhooks } = require("../app/payment/model/webhook.model");
const _offer = require("../app/offer/controller/controller");
const _spinner = require("../app/spinner/controller/spinner.controller");
const _dynamicLabeling = require("../app/dynamicLabeling/controller/controller")
const _user = require("../app/userService/controller/userController");
const _order = require("../app/order/controller/order.controller");
const _cart = require("../app/cart/controller/controller");
const _governate = require("../app/governate/controller/controller")
const _version = require("../app/versionService/versionController/versionController");
const _branch = require("../app/branch/controller/controller");



/**AUTHENTICATION */

router.group("/auth", (auth) => {
  auth.post("/userExist", USER_CONTROLLER.socialUserExists, handleResponse.RESPONSE);
  auth.post("/social/login", USER_CONTROLLER.socialLogin, handleResponse.RESPONSE);
  auth.post("/signup", USER_CONTROLLER.signup, handleResponse.RESPONSE);
  auth.post("/login", USER_CONTROLLER.login, handleResponse.RESPONSE);
  auth.post("/userLogin", USER_CONTROLLER.userSignin, handleResponse.RESPONSE);
  auth.put("/verifyOtp", USER_CONTROLLER.verifyOtp, handleResponse.RESPONSE);
  auth.post("/forgotPassword", USER_CONTROLLER.forgotPassword, handleResponse.RESPONSE);
  auth.put("/resetPassword", USER_CONTROLLER.restorePassword, handleResponse.RESPONSE);
  auth.get("/profile", _tokenManager.authenticate, USER_CONTROLLER.profile, handleResponse.RESPONSE);
  auth.put("/editProfile", _tokenManager.authenticate, USER_CONTROLLER.editOwnProfile, handleResponse.RESPONSE);
  auth.put("/changePassword", _tokenManager.authenticate, USER_CONTROLLER.changePassword, handleResponse.RESPONSE);
  auth.post("/logout", _tokenManager.authenticate, USER_CONTROLLER.logout, handleResponse.RESPONSE);
  auth.put("/notifyMe", _tokenManager.authenticate, USER_CONTROLLER.notifyMe, handleResponse.RESPONSE);
  auth.delete("/deleteAccount", _tokenManager.authenticate, USER_CONTROLLER.deleteAccount, handleResponse.RESPONSE);
  auth.post("/passwordLink", USER_CONTROLLER.passwordLink, handleResponse.RESPONSE);
  auth.post("/expireLink", USER_CONTROLLER.expireLink, handleResponse.RESPONSE);
  auth.get("/activeUser", USER_CONTROLLER.activeUserList, handleResponse.RESPONSE);
});

/**CONTENT MANAGEMENT */
router.group("/pages", (auth) => {
  auth.get("/cms/:typeId", cms_.getByType, handleResponse.RESPONSE);
});


/**FAQ MANAGEMENT */
router.group("/faq", (faq) => {
  faq.get("/faqList", FAQ_CONTROLLER.activeFaqList, handleResponse.RESPONSE);
});

/**CONTACT-US */
router.group("/contactUs", (contact) => {
  contact.post("/add", CONTACT_CONTROLLER.add, handleResponse.RESPONSE);
});

/* Category Management  */
router.group("/category", (category) => {
  category.get("/list", _category.list, handleResponse.RESPONSE);
  category.get("/detail/:id", _category.detail, handleResponse.RESPONSE);
  category.get("/activeCategoryList", _category.activeCategoryList, handleResponse.RESPONSE);
});

/* Sub category Management  */
router.group("/subcategory", (subcategory) => {
  subcategory.get("/list", _subcategory.activeSubcategory, handleResponse.RESPONSE);
  subcategory.get("/detail/:id", _subcategory.detail), handleResponse.RESPONSE;
  subcategory.get("/activeSubcategoryList", _subcategory.activeSubcategoryList, handleResponse.RESPONSE);

});

/* Company Management  */
router.group("/company", (company) => {
  company.get("/companyByCategory", _company.companyFilter, handleResponse.RESPONSE);
  company.get("/companyDetails/:id", _company.detail, handleResponse.RESPONSE);
  company.get("/list", _company.list, handleResponse.RESPONSE);
  company.get("/list/:categoryId", _company.companyList, handleResponse.RESPONSE);
  company.get("/activeCompanyList", _company.activeCompanyList, handleResponse.RESPONSE);
  company.get("/allCompany", _company.allCompany, handleResponse.RESPONSE);
  company.get("/companyByOffer", _company.companyByOffer, handleResponse.RESPONSE);
  company.get("/couponCompany", _company.couponCompany, handleResponse.RESPONSE);
  company.get("/electricCompany", _company.electricCompany, handleResponse.RESPONSE);
  company.get("/popularToday", _company.popularToday, handleResponse.RESPONSE);
  company.get("/newArrival", _company.newArrival, handleResponse.RESPONSE);
  company.get("/companyByCategory/v1", _company.companyByCategory, handleResponse.RESPONSE);
});

/* Product Management  */
router.group("/product", (product) => {
  product.get("/userProduct", _product.userProduct, handleResponse.RESPONSE);
  product.get("/userProducts", _product.userProducts, handleResponse.RESPONSE);
  product.get("/detail/:id", _product.detail, handleResponse.RESPONSE);
  product.get("/similarProductList", _product.similarProductList, handleResponse.RESPONSE);
  product.get("/bestSellerProduct", _product.bestSellerProduct, handleResponse.RESPONSE);
  product.get("/newArrival", _product.newArrival,handleResponse.RESPONSE);
  product.get("/searchProductList", _product.searchProductList, handleResponse.RESPONSE);
  
  // New filtering routes
  product.get("/company/:companyId", _product.getByCompany, handleResponse.RESPONSE);
  product.get("/category/:categoryId", _product.getByCategory, handleResponse.RESPONSE);
  product.get("/classification/:classificationId", _product.getByClassification, handleResponse.RESPONSE);
  product.get("/subcategory/:subcategoryId", _product.getBySubcategory, handleResponse.RESPONSE);
  
  // Multi-filter route for filtering by any combination (supports classId filtering)
  product.get("/filter", _product.filterProducts, handleResponse.RESPONSE);


});

router.group("/banner", (banner) => {
  banner.get("/activeBanner", _banner.activeBanner, handleResponse.RESPONSE);
});

/* Testimonial Management  */
router.group("/testimonial", (testimonial) => {
  testimonial.get("/list", _testimonial.activeTestimonialList, handleResponse.RESPONSE);
});

/* Contact info Management  */
router.group("/contactInfo", (contactInfo) => {
  contactInfo.get("/list", _contactInfo.activeInfoList, handleResponse.RESPONSE);
});

/* Classification Management  */
router.group("/classification", (classification) => {
  classification.get("/dropDown", _classification.activeList, handleResponse.RESPONSE);
  classification.get("/companyClassification/:id", _classification.companyClassification, handleResponse.RESPONSE);
  classification.get("/activeClassification", _classification.activeClassification, handleResponse.RESPONSE);
  classification.get("/category/:categoryId", _classification.getByCategory, handleResponse.RESPONSE);
});

/* Class Management  */
router.group("/class", (classRoute) => {
  classRoute.get("/dropDownClass", _class.dropDownClass, handleResponse.RESPONSE);
  classRoute.get("/activeList", _class.activeList, handleResponse.RESPONSE);
  classRoute.get("/classification/:classificationId", _class.getClassesByClassification, handleResponse.RESPONSE);
});

/* Review Management  */
router.group("/review", (review) => {
  review.get("/list", _review.reviewByProduct, handleResponse.RESPONSE);
});

router.group("/payment", (payment) => {
  payment.post("/webhook", _payment.webhook)
});

router.group("/armada", (payment) => {
  payment.post("/webhook", _order.armadaWebhook)
});


/* Offer Management  */
router.group("/offer", (offer) => {
  offer.get("/activeOfferList", _offer.activeOfferList, handleResponse.RESPONSE);
});

/* Spinner Management  */
router.group("/spinner", (spinner) => {
  spinner.get("/list", _spinner.activeSpinnerList, handleResponse.RESPONSE);
  spinner.get("/detail/:id", _spinner.detail, handleResponse.RESPONSE);
  spinner.get("/activeSpinnerList", _spinner.activeSpinnerList, handleResponse.RESPONSE);
  spinner.post("/win", _spinner.winnerDataPublic, handleResponse.RESPONSE);
  spinner.get("/win/list", _spinner.winListPublic, handleResponse.RESPONSE);
});

/* Management Dynamic labeling */
router.group("/dynamicLabeling", (dynamicLabeling) => {
  dynamicLabeling.get("/activeLabeling", _dynamicLabeling.activeLabeling,handleResponse.RESPONSE);
  dynamicLabeling.get("/allLabeling", _dynamicLabeling.allLabeling,handleResponse.RESPONSE);

});

/*App crush api*/
router.group("/apiLogs", (apiLogs) => {
  apiLogs.post("/createCrush", _user.createAppCrash,handleResponse.RESPONSE);
  apiLogs.get("/crushList", _user.getUserApiLogs,handleResponse.RESPONSE);
});

/* Cart Management  */
router.group("/cart", (cart) => {
  cart.post("/add", _cart.addCartPublic,handleResponse.RESPONSE);
  cart.get("/list", _cart.myCartPublic,handleResponse.RESPONSE);
  cart.delete("/removeCart/:id", _cart.removeProduct,handleResponse.RESPONSE);
  cart.delete("/clearCart/:id", _cart.cartClearPublic,handleResponse.RESPONSE);
  cart.put("/increaseQuantity/:id", _cart.increaseQuantity,handleResponse.RESPONSE);
  cart.put("/decreaseQuantity/:id", _cart.decreaseQuantity,handleResponse.RESPONSE);
});

/*Governate api*/
router.group("/governate", (governate) => {
  governate.get("/governateList", _governate.governateList,handleResponse.RESPONSE);
  governate.get("/governateAreaList", _governate.governateAreaList,handleResponse.RESPONSE);
});

/* Order Management  */
router.group("/order", (order) => {
  order.put("/verifyAccount", _order.verifyAccount,handleResponse.RESPONSE);
  order.put("/verifyOtpForOrder", _order.verifyOtpForOrder,handleResponse.RESPONSE);
  order.put("/resendOtpForOrder", _order.resendOtpForOrder,handleResponse.RESPONSE);
})

/* App version Management */
router.group("/appversion", (appversion) => {
  appversion.get("/versionList", _version.versionList,handleResponse.RESPONSE);
});

/* Branch Management  */
router.group("/branch", (branch) => {
  branch.get("/branchByCompany", _branch.branchByCompany,handleResponse.RESPONSE);
});

module.exports = router;
