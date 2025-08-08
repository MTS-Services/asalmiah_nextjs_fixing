/** 
@copyright : ToXsl Technologies Pvt. Ltd. <  www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

var express = require('express');
var router = express.Router();
require('express-group-routes');

/* GET home page. */
router.get('/route', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

const cms = require('../app/cms/controller/page.controller');
const _cms = new cms();
const _faq = require('../app/faq/controller/faq.controller');
const {
  errorLogs_,
  _emailLogs,
  _loginActivity,

  _smsLogs
} = require("../app/errorLogs/controller/logsController");
const _user = require("../app/userService/controller/userController");

const _contact = require("../app/contactUs/controller/contactUs.controller");
const _smtp = require("../app/smtp/controller/smtp.controller");
const _backup = require("../app/backup/controller/backup.controller");
const _category = require("../app/category/controller/category.controller");
const _class = require("../app/class/controller/class.controller");
const _subcategory = require("../app/subCategory/controller/subCategory.controller");
const _company = require("../app/company/controller/controller");
const _deliveryCompany = require("../app/companyDelivery/controller/controller");
const _branch = require("../app/branch/controller/controller");
const _product = require("../app/product/controller/product.controller");
const _promocode = require("../app/promoCode/controller/controller");
const _banner = require("../app/banner/controller/banner.controller");
const _order = require("../app/order/controller/order.controller");
const _testimonial = require("../app/testimonial/controller/testimonial.controller");
const _contactInfo = require("../app/contactInfo/controller/controller");
const _payment = require("../app/payment/controller/payment.controller");
const _dynamic = require("../app/dynamicQuestion/controller/controller");
const _classification = require("../app/classification/controller/controller");
const _permission = require("../app/permission/controller/controller");
const _review = require("../app/review/controller/review.controller");
const _notification = require("../app/notification/controller/notification.controller");
const _coupon = require("../app/coupon/controller/controller");
const _offer = require("../app/offer/controller/controller");
const offer = require("../app/offer/controller/controller");
const _refundRequest = require("../app/redundRequest/controller/controller");
const _statementAccount = require("../app/statementAccount/controller/controller");
const _spinner = require("../app/spinner/controller/spinner.controller");
const _cashback = require("../app/cashBack/controller/controller");
const _dynamicLabeling = require("../app/dynamicLabeling/controller/controller");
const _twillio = require("../app/twillio/controller/twillio.controller");
const _version = require("../app/versionService/versionController/versionController");


//   _smsLogs,
// } = require('../app/errorLogs/controller/logsController');
// const _user = require('../app/userService/controller/userController');
// const _contact = require('../app/contactUs/controller/contactUs.controller');
// const _smtp = require('../app/smtp/controller/smtp.controller');
// const _backup = require('../app/backup/controller/backup.controller');
// const _category = require('../app/category/controller/category.controller');
// const _subcategory = require('../app/subCategory/controller/subCategory.controller');
// const _company = require('../app/company/controller/controller');
// const _deliveryCompany = require('../app/companyDelivery/controller/controller');
// const _branch = require('../app/branch/controller/controller');
// const _product = require('../app/product/controller/product.controller');
// const _promocode = require('../app/promoCode/controller/controller');
// const _banner = require('../app/banner/controller/banner.controller');
// const _order = require('../app/order/controller/order.controller');
// const _testimonial = require('../app/testimonial/controller/testimonial.controller');
// const _contactInfo = require('../app/contactInfo/controller/controller');
// const _payment = require('../app/payment/controller/payment.controller');
// const _dynamic = require('../app/dynamicQuestion/controller/controller');
// const _classification = require('../app/classification/controller/controller');
// const _permission = require('../app/permission/controller/controller');
// const _review = require('../app/review/controller/review.controller');
// const _notification = require('../app/notification/controller/notification.controller');
// const _coupon = require('../app/coupon/controller/controller');
// const _offer = require('../app/offer/controller/controller');
// const offer = require('../app/offer/controller/controller');
// const _refundRequest = require('../app/redundRequest/controller/controller');
// const _statementAccount = require('../app/statementAccount/controller/controller');
// const _spinner = require('../app/spinner/controller/spinner.controller');
// const _cashback = require('../app/cashBack/controller/controller');
// const _dynamicLabeling = require('../app/dynamicLabeling/controller/controller');
// const _twillio = require('../app/twillio/controller/twillio.controller');
// const _version = require('../app/versionService/versionController/versionController');


/* User Management */
router.group('/user', (admin) => {
  admin.get('/list', _user.getUsers);
  admin.get('/view/:id', _user.getUserById);
  admin.post('/add', _user.addUser);
  admin.put('/edit/:id', _user.editUserProfile);
  admin.put('/updateState/:id', _user.updateState);
  admin.delete('/delete/:id', _user.delete);
  admin.get('/downloadLoginReport', _user.downloadLoginReport);
  admin.post('/resendEmail', _user.resendEmail);
  admin.put('/updateWallet/:id', _user.updateWallet);
  admin.put('/updatePoint/:id', _user.updatePoint);
});

/* Content Management pages */
router.group('/cms', (cms) => {
  cms.get('/list', _cms.list);
  cms.post('/add', _cms.add);
  cms.get('/detail/:id', _cms.detail);
  cms.put('/update/:id', _cms.update);
  cms.put('/updateState/:id', _cms.updateState);
  cms.get('/getByType/:typeId', _cms.getByType);
  cms.delete('/delete/:id', _cms.delete);
});

/* Faq Management  */
router.group('/faq', (faq) => {
  faq.get('/list', _faq.faqList);
  faq.post('/add', _faq.addFaq);
  faq.get('/detail/:id', _faq.faqDetails);
  faq.delete('/delete/:id', _faq.delete);
  faq.put('/edit/:id', _faq.editFaq);
  faq.put('/updateState/:id', _faq.updateFaqState);
});

/* Logs Management  */
router.group('/logs', (logs) => {
  logs.get('/errorList', errorLogs_.getLogs);
  logs.get('/errorView/:id', errorLogs_.logDetails);
  logs.delete('/deleteAll', errorLogs_.deleteAllErrorLog);
  logs.delete('/delete/:id', errorLogs_.deleteError);
});

/* Email Logs Management  */
router.group('/emailLogs', (email) => {
  email.get('/list', _emailLogs.emailList);
  email.get('/view/:id', _emailLogs.emailDetails);
  email.delete('/delete/:id', _emailLogs.deleteEmail);
  email.delete('/deleteAll', _emailLogs.deleteAllEmail);
});

/* Login Logs */
router.group('/loginActivity', (loginActivity) => {
  loginActivity.get('/list', _loginActivity.loginHistoryList);
  loginActivity.get('/details/:id', _loginActivity.viewLoginDetails);
  loginActivity.delete('/deleteAll', _loginActivity.deleteAllLoginHistory);
  loginActivity.delete('/delete/:id', _loginActivity.deleteLogs);
});

/* Dashboard Management*/
router.group('/dashboard', (dashboard) => {
  dashboard.get('/count', _user.dashboardCount);
  dashboard.get('/graphData/:year', _user.graphData);
});

/* contact-us Management  */
router.group('/contactUs', (contact) => {
  contact.get('/list', _contact.list);
  contact.get('/view/:id', _contact.view);
  contact.delete('/delete/:id', _contact.delete);
});

/* Smtp Management  */
router.group('/smtp', (smtp) => {
  smtp.post('/add', _smtp.addSmtp);
  smtp.get('/list', _smtp.smtpList);
  smtp.delete('/delete/:id', _smtp.deleteSmtp);
  smtp.get('/view/:id', _smtp.viewSmtp);
  smtp.put('/update/:id', _smtp.editSmtp);
});

/* Twillio Management  */
router.group('/twillio', (twillio) => {
  twillio.post('/add', _twillio.addTwillio);
  twillio.get('/list', _twillio.twillioList);
  twillio.delete('/delete/:id', _twillio.deleteTwillio);
  twillio.get('/view/:id', _twillio.viewTwillio);
  twillio.put('/update/:id', _twillio.editTwillio);
});

/* DB Management  */
router.group('/db', (backup) => {
  backup.get('/backup/list', _backup.listing);
  backup.get('/downloadBackup/:id', _backup.download);
  backup.get('/delete/:id', _backup.delete);
  backup.post('/backup', _backup.create);
});

/* Category Management  */
router.group('/category', (category) => {
  category.post('/add', _category.add);
  category.get('/list', _category.list);
  category.get('/detail/:id', _category.detail);
  category.put('/update/:id', _category.update);
  category.put('/updateState/:id', _category.updateState);
  category.delete('/delete/:id', _category.delete);
});


/* Class Management  */
router.group("/class", (classRoute) => {
  classRoute.post("/add", _class.add);
  classRoute.get("/list", _class.list);
  classRoute.get("/detail/:id", _class.detail);
  classRoute.put("/update/:id", _class.update);
  classRoute.put("/updateState/:id", _class.updateState);
  classRoute.delete("/delete/:id", _class.delete);
  classRoute.get("/dropDownClass", _class.dropDownClass);
  classRoute.get("/activeList", _class.activeList);
  classRoute.get("/classification/:classificationId", _class.getClassesByClassification);
});
/* Sub category Management  */
router.group('/subcategory', (subcategory) => {
  subcategory.post('/add', _subcategory.add);
  subcategory.get('/list', _subcategory.list);
  subcategory.get('/detail/:id', _subcategory.detail);
  subcategory.put('/edit/:id', _subcategory.update);
  subcategory.put('/updateState/:id', _subcategory.updateState);
  subcategory.delete('/delete/:id', _subcategory.delete);
});

/* Delivery company Management  */
router.group('/deliverycompany', (deliverycompany) => {
  deliverycompany.post('/add', _deliveryCompany.add);
  deliverycompany.get('/list', _deliveryCompany.list);
  deliverycompany.get('/detail/:id', _deliveryCompany.detail);
  deliverycompany.put('/edit/:id', _deliveryCompany.update);
  deliverycompany.put('/updateState/:id', _deliveryCompany.updateState);
  deliverycompany.delete('/delete/:id', _deliveryCompany.delete);
});

/* Company Management  */
router.group('/company', (company) => {
  company.post('/add', _company.add);
  company.get('/list', _company.list);
  company.get('/detail/:id', _company.detail);
  company.put('/edit/:id', _company.update);
  company.put('/updateState/:id', _company.updateState);
  company.delete('/delete/:id', _company.delete);
  company.get('/downloadCompanyReport', _company.downloadCompanyReport);
  company.get('/dropDownCompany', _company.dropDownCompany);
});

/* Branch Management  */
router.group('/branch', (branch) => {
  branch.post('/add', _branch.add);
  branch.get('/list', _branch.list);
  branch.get('/detail/:id', _branch.detail);
  branch.put('/edit/:id', _branch.update);
  branch.put('/updateState/:id', _branch.updateState);
  branch.delete('/delete/:id', _branch.delete);
  branch.get('/companyFilter', _branch.companyFilter);
});

/* Product Management  */
router.group('/product', (product) => {
  product.post('/add', _product.add);
  product.get('/list', _product.list);
  product.put('/edit/:id', _product.update);
  product.get('/pendingProduct', _product.pendingProduct);
  product.get('/detail/:id', _product.detail);
  product.put('/updateState/:id', _product.updateState);
  product.get('/downloadSample', _product.downloadSample);
  product.post('/importCsv', _product.importCsv);
  product.delete('/deleteImg/:id', _product.deleteImg);
  product.post('/deleteProduct', _product.delete);
  product.get('/downloadItemReport', _product.downloadItemReport);
  product.put('/setDefaultImage/:id', _product.setDefaultImage);
});

/* Promocode Management  */
router.group('/promotion', (promotion) => {
  promotion.post('/add', _promocode.add);
  promotion.get('/list', _promocode.list);
  promotion.get('/detail/:id', _promocode.details);
  promotion.put('/update/:id', _promocode.update);
  promotion.put('/updateState/:id', _promocode.updateState);
  promotion.delete('/delete/:id', _promocode.delete);
});

/* Banner Management  */
router.group('/banner', (banner) => {
  banner.post('/add', _banner.add);
  banner.get('/list', _banner.list);
  banner.get('/detail/:id', _banner.details);
  banner.put('/update/:id', _banner.update);
  banner.delete('/delete/:id', _banner.delete);
  banner.put('/updateState/:id', _banner.updateState);
});

/* Order Management  */
router.group('/order', (order) => {
  order.get('/adminOrderList', _order.adminOrderList);
  order.get('/orderDetails/:id', _order.orderDetails);
  order.put('/updateOrderState/:id', _order.updateOrderState);
  order.put('/cancelOrder/:id', _order.cancelOrder);
  order.get('/invoiceList', _order.adminInvoiceList);
  order.get('/downloadOrderReport/:id', _order.downloadOrderReport);
  order.get('/downloadMonthlyReport', _order.downloadMonthlyReport);
});

/* Testimonial Management  */
router.group('/testimonial', (testimonial) => {
  testimonial.post('/add', _testimonial.add);
  testimonial.put('/edit/:id', _testimonial.edit);
  testimonial.get('/list', _testimonial.list);
  testimonial.get('/details/:id', _testimonial.details);
  testimonial.put('/changeState/:id', _testimonial.changeState);
  testimonial.delete('/delete/:id', _testimonial.delete);
});

/* Contact info Management  */
router.group('/contactInfo', (contactInfo) => {
  contactInfo.post('/add', _contactInfo.add);
  contactInfo.put('/edit/:id', _contactInfo.update);
  contactInfo.get('/list', _contactInfo.list);
  contactInfo.get('/details/:id', _contactInfo.details);
  contactInfo.put('/updateState/:id', _contactInfo.updateState);
  contactInfo.delete('/delete/:id', _contactInfo.delete);
});

/**
 * Payment Api's
 */
router.group('/payment', (payment) => {
  payment.post('/refund/:id', _payment.addRefund);
  payment.post('/transaction/refund/:id', _payment.transactionRefund);
  payment.get('/transactionList', _payment.transactionList);
  payment.get('/transactionView/:id', _payment.transactionView);
  payment.get('/downloadRefundReport', _payment.downloadRefundReport);
  payment.post('/itemRefund', _payment.sellerAddRefund);
});

/* Dynamic question management  */
router.group('/dynamic', (dynamic) => {
  dynamic.post('/add', _dynamic.add);
  dynamic.get('/list', _dynamic.list);
  dynamic.get('/detail/:id', _dynamic.details);
  dynamic.put('/update/:id', _dynamic.edit);
  dynamic.put('/updateState/:id', _dynamic.updateState);
  dynamic.delete('/delete/:id', _dynamic.delete);
  dynamic.put('/assignQuestion/:id', _dynamic.assignQuestion);
});

/* Classification Management  */

router.group("/classification", (classification) => {
  classification.post("/add", _classification.add);
  classification.get("/list", _classification.list);
  classification.get("/detail/:id", _classification.detail);
  classification.put("/update/:id", _classification.update);
  classification.put("/updateState/:id", _classification.updateState);
  classification.delete("/delete/:id", _classification.delete);
  classification.get("/dropDown", _classification.activeList);
  classification.get("/category/:categoryId", _classification.getByCategory);

// router.group('/classification', (classification) => {
//   classification.post('/add', _classification.add);
//   classification.get('/list', _classification.list);
//   classification.get('/detail/:id', _classification.detail);
//   classification.put('/update/:id', _classification.update);
//   classification.put('/updateState/:id', _classification.updateState);
//   classification.delete('/delete/:id', _classification.delete);
//   classification.get('/dropDown', _classification.activeList);

 });

/* Review Management  */
router.group('/review', (review) => {
  review.get('/list', _review.reviewByProduct);
  review.delete('/delete/:id', _review.deleteReview);
});

/* Permission Management */
router.group('/permission', (permission) => {
  permission.post('/add', _permission.add);
  permission.get('/permissionDetails', _user.permissionDetails);
});

/* Notification Management  */
router.group('/notification', (notification) => {
  notification.post('/sendNotification', _notification.sendNotification);
  notification.get(
    '/getAdminNotificationList',
    _notification.getAdminNotificationList
  );
  notification.get('/notificationView/:id', _notification.notificationView);
});

/* Coupon management  */
router.group('/coupon', (coupon) => {
  coupon.get('/downloadCouponReport', _coupon.downloadCouponReport);
});

/* Offer Management  */
router.group('/offer', (offer) => {
  offer.post('/add', _offer.add);
  offer.get('/list', _offer.list);
  offer.get('/detail/:id', _offer.detail);
  offer.put('/update/:id', _offer.update);
  offer.put('/updateState/:id', _offer.updateState);
  offer.delete('/delete/:id', _offer.delete);
});

/* Refund request  */
router.group('/refundRequest', (refundRequest) => {
  refundRequest.get('/requestList', _refundRequest.requestList);
  refundRequest.put('/updateRequest/:id', _refundRequest.approveRequest);
});

/* Statement account Management */
router.group('/statementAccount', (statementAccount) => {
  statementAccount.post('/add', _statementAccount.add);
  statementAccount.get('/list', _statementAccount.list);
  statementAccount.get('/details/:id', _statementAccount.details);
  statementAccount.put('/edit/:id', _statementAccount.update);
  statementAccount.delete('/delete/:id', _statementAccount.delete);
  statementAccount.put('/updateState/:id', _statementAccount.updateState);

  statementAccount.post(
    '/statementTransaction/add',
    _statementAccount.statementTransactionAdd
  );
  statementAccount.get(
    '/statementTransaction',
    _statementAccount.statementTransaction
  );
  statementAccount.put(
    '/updateStatementTransaction/:id',
    _statementAccount.updateStatementTransaction
  );
  statementAccount.get(
    '/viewStatementTransaction/:id',
    _statementAccount.viewStatementTransaction
  );
  statementAccount.get(
    '/downloadStatementReport',
    _statementAccount.downloadStatementReport
  );
});

/* Spinner Management  */
router.group('/spinner', (spinner) => {
  spinner.post('/add', _spinner.add);
  spinner.get('/list', _spinner.list);
  spinner.get('/detail/:id', _spinner.detail);
  spinner.put('/update/:id', _spinner.update);
  spinner.put('/updateState/:id', _spinner.updateState);
  spinner.delete('/delete/:id', _spinner.delete);
  spinner.get('/downloadSpinnerReport', _spinner.downloadSpinnerReport);
});

/* Spinner Setting Management  */
router.group('/spinner/setting', (spinner) => {
  spinner.post('/add', _spinner.addSpinnerSetting);
  spinner.get('/list', _spinner.SpinnerSettingList);
  spinner.get('/detail/:id', _spinner.SpinnerSettingDetail);
  spinner.put('/update/:id', _spinner.SpinnerSettingUpdate);
  spinner.put('/updateState/:id', _spinner.SpinnerSettingUpdateState);
  spinner.delete('/delete/:id', _spinner.SpinnerSettingDelete);
});

/* Cash back management  */
router.group('/cashback', (cashback) => {
  cashback.get('/cashbackList/:id', _cashback.cashbackList);
});

/* Management Dynamic labeling */
router.group('/dynamicLabeling', (dynamicLabeling) => {
  dynamicLabeling.post('/add', _dynamicLabeling.add);
  dynamicLabeling.put('/update/:id', _dynamicLabeling.edit);
  dynamicLabeling.get('/list', _dynamicLabeling.list);
  dynamicLabeling.get('/detail/:id', _dynamicLabeling.details);
  dynamicLabeling.put('/updateState/:id', _dynamicLabeling.updateState);
  dynamicLabeling.delete('/delete/:id', _dynamicLabeling.delete);
});

/* Login Logs */
router.group('/smsLogs', (smsLogs) => {
  smsLogs.get('/list', _smsLogs.smsList);
  smsLogs.get('/details/:id', _smsLogs.viewSmsDetails);
  smsLogs.delete('/deleteAll', _smsLogs.deleteAllSms);
  smsLogs.delete('/delete/:id', _smsLogs.deleteSms);
});

/* App version Management */
router.group('/appversion', (appversion) => {
  appversion.post('/add', _version.addVersion);
  appversion.get('/list', _version.list);
  appversion.get('/details/:id', _version.viewVersion);
  appversion.put('/update/:id', _version.editVersion);
  appversion.delete('/delete/:id', _version.deleteversion);
});

module.exports = router;
