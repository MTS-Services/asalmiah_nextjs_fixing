import axios from 'axios';
import { store } from '../redux/store';
import URL from '../utils/config';
import { Paginations } from '../utils/constants';

const http = axios.create({
  baseURL: URL,
});

/* request interceptor */
http.interceptors.request.use(
  function (config) {
    let token = store.getState()?.auth?.data?.token;
    if (token) {
      config.headers['authorization'] = `Bearer ${token}`;
    }

    let country = store.getState()?.country;
    if (country) {
      config.headers['country'] = country?.country;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

const paymentHttp = axios.create({
  baseURL: URL,
});

paymentHttp.interceptors.request.use(
  function (config) {
    const customToken = 'sk_test_JYveiWjzynFTsdp3HPtw1SQ5'; // replace with your custom token
    config.headers['authorization'] = `Bearer ${customToken}`;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

/****************************AUTHENTICATION*******************************/

export const loginAPI = async (body) => {
  return await http.post(`/auth/userLogin`, body);
};

export const socialLoginAPI = async (body) => {
  return await http.post(`/auth/social/login`, body);
};

export const adminLogin = async (data) => {
  return await http.post('/auth/login', data);
};

export const signup = async (data) => {
  return await http.post('/auth/signup', data);
};

export const verifyOTP = async (body) => {
  return await http.put(`/auth/verifyOtp`, body);
};

export const verifyOTPByLogin = async (body) => {
  return await http.put(`/users/order/verifyOtpForOrder`, body);
};

export const resendOTP = async (body) => {
  return await http.post(`/auth/forgotPassword`, body);
};

export const resendOTPByOrder = async (body) => {
  return await http.put(`/users/order/resendOtpForOrder`, body);
};

export const resetOldPassword = async (body) => {
  return await http.put(`/auth/resetPassword`, body);
};

export const logOut = async () => {
  return await http.post('/auth/logout');
};

export const forgetPassword = async (body) => {
  return await http.post('/auth/forgotPassword', body);
};

export const resetPasswordLink = async (body) => {
  return await http.post('/auth/passwordLink', body);
};

export const userChangePassword = async (body) => {
  return await http.put(`/auth/changePassword`, body);
};

export const adminProfile = async () => {
  return await http.get(`/auth/profile`);
};
export const updateMyProfile = async (body) => {
  return await http.put(`/auth/editProfile`, body);
};

/****************************CMS MODULE*******************************/

export const getCMSPage = async () => {
  return await http.get(`/admin/cms/list`);
};

export const getSingleCMSDetail = async (id) => {
  return await http.get(`/admin/cms/detail/${id}`);
};

export const cmsStateChange = async (id, body) => {
  return await http.put(`/admin/cms/updateState/${id}`, body);
};

export const cmsDelete = async (id) => {
  return await http.delete(`/admin/cms/delete/${id}`);
};
export const cmsUpdate = async (id, body) => {
  return await http.put(`/admin/cms/update/${id}`, body);
};

export const addCmsDetail = async (body) => {
  return await http.post(`/admin/cms/add`, body);
};

/****************************USER MANAGEMENT MODULE*******************************/

export const getAllUsers = async (page, search, filter, roleId) => {
  return await http.get(`/admin/user/list`, {
    params: {
      pageNo: page,
      pageLimit: 10,
      search: search,
      state: filter,
      roleId: roleId,
    },
  });
};

export const getUserDetail = async (id) => {
  return await http.get(`/admin/user/view/${id}`);
};

// User Wallet List
export const getUsersWalletList = async (id, page) => {
  return await http.get(`/admin/cashback/cashbackList/${id}`, {
    params: {
      pageNo: page,
      pageLimit: 10,
    },
  });
};

export const adminDeleteUser = async (id) => {
  return await http.delete(`/admin/user/delete/${id}`);
};

export const adminAddUser = async (body) => {
  return await http.post(`/admin/user/add`, body);
};

export const adminUpdateUser = async (id, body) => {
  return await http.put(`/admin/user/edit/${id}`, body);
};

export const adminUpdateUserState = async (id, state) => {
  return await http.put(`/admin/user/updateState/${id}?stateId=${state}`);
};

export const adminUpdateUserWallet = async (id, body) => {
  return await http.put(`/admin/user/updateWallet/${id}`, body);
};

export const adminUpdateUserPoints = async (id, body) => {
  return await http.put(`/admin/user/updatePoint/${id}`, body);
};

/****************************NOTIFICATION MODULE*******************************/

export const getNotifications = async () => {
  return await http.get(`/admin/notification/list`);
};

/****************************EMAIL LOGS*******************************/

export const adminGetAllEmailQueue = async (page, search, state) => {
  return await http.get(`/admin/emailLogs/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      search: search,
      stateId: state,
    },
  });
};

export const singleEmailView = async (id) => {
  return await http.get(`/admin/emailLogs/view/${id}`);
};
export const deleteSingleEmail = async (id) => {
  return await http.delete(`/admin/emailLogs/delete/${id}`);
};

/****************************FAQ MODULE*******************************/

export const addFaq = async (body) => {
  return await http.post(`/admin/faq/add`, body);
};
export const getAllFaq = async () => {
  return await http.get(`/admin/faq/list`);
};
export const getFaqDetail = async (id) => {
  return await http.get(`/admin/faq/detail/${id}`);
};
export const editFaq = async (id, body) => {
  return await http.put(`/admin/faq/edit/${id}`, body);
};
export const faqChangeState = async (id) => {
  return await http.put(`/admin/faq/updateState/${id}`);
};
export const faqDelete = async (id) => {
  return await http.delete(`/admin/faq/delete/${id}`);
};
/****************************ACTIVITY LOGS MODULE*******************************/

export const adminGetAllactivity = async (pageNo, role) => {
  return await http.get(
    `/admin/loginActivity/list?pageNo=${pageNo}&role=${role}`
  );
};

export const adminGetSingleActivity = async (id) => {
  return await http.get(`/admin/loginActivity/details/${id}`);
};

/****************************ERROR LOGS MODULE*******************************/

export const adminGetAllError = async (pageNo, role) => {
  return await http.get(`/admin/logs/errorList?pageNo=${pageNo}&role=${role}`);
};

export const adminGetSingleError = async (id) => {
  return await http.get(`/admin/logs/errorView/${id}`);
};

export const deleteAllError = async () => {
  return await http.delete(`/admin/logs/deleteAll`);
};

export const deleteSingleError = async (id) => {
  return await http.delete(`/admin/logs/delete/${id}`);
};

/****************************BACKUP MODULE*******************************/

export const adminBackupList = async (pageNo, role) => {
  return await http.get(`/admin/db/backup/list?pageNo=${pageNo}&role=${role}`);
};

export const adminCreateBackup = async () => {
  return await http.post(`/admin/db/backup`);
};

export const deleteBackup = async (id) => {
  return await http.get(`/admin/db/delete/${id}`);
};

/*************************************PRODUCT MODULE*************************************/

/**
 * Get All Products List For Admin
 * @returns
 */
export const getAdminProductList = async (pageNo = '', perPage = '') => {
  return await http.get(
    `/admin/product/all?pageNo=${pageNo}&pageLimit=${perPage}`
  );
};

/**
 * Soft Delete Product from Admin
 * @param {Number} id
 * @param {Number} stateId
 * @returns
 */
export const adminDeleteProduct = async (id) => {
  return await http.post(`/admin/product/delete/${id}`);
};

/**
 * Get Product Details By Id for Admin
 * @param {Object} body
 * @returns
 */
export const adminproductDetailsById = async (id) => {
  return await http.get(`/users/product/view-item/${id}`);
};

/*
 * Update Product Details By Id from Admin
 * @param {Object} body
 * @returns
 */
export const adminUpdateProductDetailsById = async (id, body) => {
  return await http.put(`/admin/product/edit/${id}`, body);
};
//filter api for product
export const productFilter = async (body) => {
  return await http.post(`/users/product/filter-item`, body);
};
/**
 * Add Product
 * @param {Object} body
 * @returns
 */
export const userAddProduct = async (body) => {
  return await http.post('/users/product/addProduct', body);
};
/**
 * Get All Products List
 * @returns
 */

export const getAdminProductLists = async (
  page,
  search,
  filter,
  companyArr,
  company = ''
) => {
  return await http.get(`/admin/product/pendingProduct`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      search: search,
      state: filter,
      companyArr: companyArr,
      company: company,
    },
  });
};

export const STATE_UPDATE_PRODUCT_API = async (id, stateId) => {
  return await http.put(`/admin/product/updateState/${id}?stateId=${stateId}`);
};

/**
 * Get Product Details By Id
 * @param {Object} body
 * @returns
 */
export const PRODUCT_DETAILS_ADMIN = async (id) => {
  return await http.get(`/admin/product/detail/${id}`);
};

/***********************************************CATEGORY SUB CATEGORY MODULE******************************************/
/**
 * category api's ->categorys
 * add,edit,delete,
 */
export const getAllCategory = async (page = 1, stateId = '') => {
  return await http.get(
    `/admin/category/get-all?pageNo=${page}&stateId=${stateId}`
  );
};

/**
 * category api's ->subcategory
 * add,edit,delete,
 */
export const getAllSubCategory = async (page = 1, stateId = '') => {
  return await http.get(
    `/admin/subcategory/get-all?pageNo=${page}&stateId=${stateId}`
  );
};
export const addSubCategory = async (body) => {
  return await http.post(`/admin/subcategory/add-subCategory`, body);
};
export const editSubCategory = async (id, body) => {
  return await http.put(`/admin/subcategory/update-subcategory/${id}`, body);
};
export const viewSubCategory = async (id) => {
  return await http.get(`/admin/subcategory/view-subcategory/${id}`);
};
export const updateSubCategoryState = async (id, stateId) => {
  return await http.put(
    `/admin/subcategory/update-subcategory-stateId/${id}?stateId=${stateId}`
  );
};
/****************************CATEGORY MODULE*******************************/
export const ADD_CATEGORY_API = async (body) => {
  return await http.post(`/admin/category/add`, body);
};
export const GET_CATEGORY_API = async (page, search, state) => {
  return await http.get(`/admin/category/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      search: search,
      stateId: state,
    },
  });
};
export const GET_CATEGORY_DETAIL = async (id) => {
  return await http.get(`/admin/category/detail/${id}`);
};
export const EDIT_CATEGORY_API = async (id, body) => {
  return await http.put(`/admin/category/update/${id}`, body);
};
export const STATE_UPDATE_CATEGORY_API = async (id, stateId) => {
  return await http.put(`/admin/category/updateState/${id}?stateId=${stateId}`);
};
export const DELETE_CATEGORY_API = async (id) => {
  return await http.delete(`/admin/category/delete/${id}`);
};

/****************************SUB-CATEGORY MODULE*******************************/
export const ADD_SUBCATEGORY_API = async (body) => {
  return await http.post(`/admin/subcategory/add`, body);
};
export const GET_SUBCATEGORY_API = async (page, search, state) => {
  return await http.get(`/admin/subcategory/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      search: search,
      stateId: state,
    },
  });
};
export const GET_SUBCATEGORY_DETAIL = async (id) => {
  return await http.get(`/admin/subcategory/detail/${id}`);
};
export const EDIT_SUBCATEGORY_API = async (id, body) => {
  return await http.put(`/admin/subcategory/edit/${id}`, body);
};
export const STATE_UPDATE_SUBCATEGORY_API = async (id, stateId) => {
  return await http.put(
    `/admin/subcategory/updateState/${id}?stateId=${stateId}`
  );
};
export const DELETE_SUBCATEGORY_API = async (id) => {
  return await http.delete(`/admin/subcategory/delete/${id}`);
};
export const GET_SEARCH_CATEGORY_API = async (
  page,
  pageLimit,
  state,
  search
) => {
  return await http.get(
    `/admin/category/list?pageNo=${page}&pageLimit=${pageLimit}&stateId=${state}&search=${search}`
  );
};

/****************************COMPANY MANAGEMENT MODULE*******************************/

export const ADD_COMPANY_API = async (body) => {
  return await http.post(`/admin/company/add`, body);
};
export const GET_COMPANY_API = async (
  page,
  search,
  state,
  startDate,
  endDate,
  country
) => {
  return await http.get(`/admin/company/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      search: search,
      stateId: state,
      startDate: startDate,
      endDate: endDate,
      country: country,
    },
  });
};
export const GET_COMPANY_DETAIL = async (id) => {
  return await http.get(`/admin/company/detail/${id}`);
};
export const EDIT_COMPANY_API = async (id, body) => {
  return await http.put(`/admin/company/edit/${id}`, body);
};
export const STATE_UPDATE_COMPANY_API = async (id, stateId) => {
  return await http.put(`/admin/company/updateState/${id}?stateId=${stateId}`);
};
export const DELETE_COMPANY_API = async (id) => {
  return await http.delete(`/admin/company/delete/${id}`);
};
export const GET_SEARCH_DELIVERY_COMPANY_API = async (
  page,
  pageLimit,
  state,
  search
) => {
  return await http.get(
    `/admin/deliverycompany/list?pageNo=${page}&pageLimit=${pageLimit}&stateId=${state}&search=${search}&active=${true}`
  );
};

/****************************BRANCH MANAGEMENT MODULE*******************************/
export const ADD_BRANCH_API = async (body) => {
  return await http.post(`/admin/branch/add`, body);
};
export const GET_BRANCH_API = async (
  page,
  search,
  state,
  branch,
  companyArr
) => {
  return await http.get(`/admin/branch/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      search: search,
      stateId: state,
      branch: branch,
      companyArr: companyArr,
    },
  });
};
export const GET_BRANCH_DETAIL = async (id) => {
  return await http.get(`/admin/branch/detail/${id}`);
};
export const EDIT_BRANCH_API = async (id, body) => {
  return await http.put(`/admin/branch/edit/${id}`, body);
};
export const STATE_UPDATE_BRANCH_API = async (id, stateId) => {
  return await http.put(`/admin/branch/updateState/${id}?stateId=${stateId}`);
};
export const DELETE_BRANCH_API = async (id) => {
  return await http.delete(`/admin/branch/delete/${id}`);
};
export const GET_BRANCH_BY_COMPANY = async (id) => {
  return await http.get(`/admin/branch/companyFilter?companyId=${id}`);
};

export const GET_SEARCH_COMPANY_API = async (
  page,
  pageLimit,
  state,
  search
) => {
  return await http.get(
    `/admin/company/list?pageNo=${page}&pageLimit=${pageLimit}&stateId=${state}&search=${search}&active=${true}`
  );
};

export const GET_SEARCH_COMPANY_API_ACTIVE_PRODUCT = async (
  page,
  pageLimit,
  state,
  search,
  country = '',
  categoryId = ''
) => {
  return await http.get(
    `/admin/company/dropDownCompany?pageNo=${page}&pageLimit=${pageLimit}&stateId=${state}&search=${search}&active=${true}&country=${country}&categoryId=${categoryId}`
  );
};
/****************************DELIVERY COMPANY MANAGEMENT MODULE*******************************/

export const ADD_DELIVERY_COMPANY_API = async (body) => {
  return await http.post(`/admin/deliverycompany/add`, body);
};
export const GET_DELIVERY_COMPANY_API = async (page, search, state) => {
  return await http.get(`/admin/deliverycompany/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      search: search,
      stateId: state,
    },
  });
};
export const GET_DELIVERY_COMPANY_DETAIL = async (id) => {
  return await http.get(`/admin/deliverycompany/detail/${id}`);
};
export const EDIT_DELIVERY_COMPANY_API = async (id, body) => {
  return await http.put(`/admin/deliverycompany/edit/${id}`, body);
};
export const STATE_DELIVERY_COMPANY_API = async (id, stateId) => {
  return await http.put(
    `/admin/deliverycompany/updateState/${id}?stateId=${stateId}`
  );
};
export const DELETE_DELIVERY_COMPANY_API = async (id) => {
  return await http.delete(`/admin/deliverycompany/delete/${id}`);
};

export const GET_SEARCH_SUBCATEGORY_API = async (
  page,
  pageLimit,
  state,
  search,
  categoryId
) => {
  return await http.get(
    `/subcategory/list?pageNo=${page}&pageLimit=${pageLimit}&stateId=${state}&search=${search}&categoryId=${categoryId}`
  );
};

/****************************USER MODULE*******************************/

export const GET_CATEGORY_LIST_HOME = async () => {
  return await http.get(`/category/activeCategoryList`);
};

export const GET_SUB_CATEGORY_LIST_HOME = async () => {
  return await http.get(`/subcategory/activeSubcategoryList`);
};

export const GET_SUBCATEGORY_LIST_HOME = async (id, page) => {
  return await http.get(`/subcategory/list`, {
    params: {
      categoryId: id,
      pageNo: page,
      pageLimit: Paginations.PER_PAGE,
    },
  });
};

export const GET_COMPANY_SUBCATEGORY_LIST_HOME = async (
  id,
  subcategoryId,
  page
) => {
  return await http.get(`/company/companyByCategory`, {
    params: {
      categoryId: id,
      subcategoryId: subcategoryId,
      pageNo: page,
      pageLimit: Paginations.PRODUCT_PER_PAGE,
      active: true,
    },
  });
};

export const GET_USERS_COMPANY_SUBCATEGORY_LIST_HOME = async (
  id,
  subcategoryId,
  page
) => {
  return await http.get(`/users/company/companyByCategory`, {
    params: {
      categoryId: id,
      subcategoryId: subcategoryId,
      pageNo: page,
      pageLimit: Paginations.PRODUCT_PER_PAGE,
      active: true,
    },
  });
};

export const GET_PRODUCTLIST = async (
  search,
  categoryId,
  subcategoryId,
  companyId,
  categoryArr,
  classificationArr,
  subCategoryArr,
  companyArr,
  pageNo,
  // company,
  // category,
  // discount
  minPrice,
  maxPrice,
  sort,
  minDiscount,
  maxDiscount
) => {
  return await http.get(`/product/userProduct`, {
    params: {
      search: search,
      categoryId: categoryId,
      subcategoryId: subcategoryId,
      companyId: companyId,
      categoryArr: categoryArr,
      classificationArr: classificationArr,
      subCategoryArr: subCategoryArr,
      companyArr: companyArr,
      pageNo: pageNo,
      pageLimit: Paginations.PRODUCT_PER_PAGE,
      // company: company,
      // category: category,
      // discount: discount,
      minPrice: minPrice,
      maxPrice: maxPrice,

      sort: sort,
      minDiscount: minDiscount,
      maxDiscount: maxDiscount,
    },
  });
};

export const GET_PRODUCTLIST_AUTH = async (
  search,
  categoryId,
  subcategoryId,
  companyId,
  categoryArr,
  classificationArr,
  subCategoryArr,
  companyArr,
  pageNo,
  // company,
  // category,
  // discount
  minPrice,
  maxPrice,
  sort,
  minDiscount,
  maxDiscount
) => {
  return await http.get(`/users/product/userProduct`, {
    params: {
      search: search,
      categoryId: categoryId,
      subcategoryId: subcategoryId,
      companyId: companyId,
      categoryArr: categoryArr,
      classificationArr: classificationArr,
      subCategoryArr: subCategoryArr,
      companyArr: companyArr,
      pageNo: pageNo,
      pageLimit: Paginations.PRODUCT_PER_PAGE,
      // company: company,
      // category: category,
      // discount: discount,
      minPrice: minPrice,
      maxPrice: maxPrice,
      sort: sort,
      minDiscount: minDiscount,
      maxDiscount: maxDiscount,
    },
  });
};

export const ADD_CART_API = async (body) => {
  return await http.post(`/users/cart/add`, body);
};

export const ADD_CART_API_WITHOUT_LOGIN = async (body) => {
  return await http.post(`/cart/add`, body);
};

export const INCREMENT_CART_QUANTITY = async (id, body) => {
  return await http.put(`/users/cart/increaseQuantity/${id}`, body);
};

export const INCREMENT_CART_QUANTITY_WITHOUT_LOGIN = async (id, body) => {
  return await http.put(`/cart/increaseQuantity/${id}`, body);
};

export const DECREMENT_CART_QUANTITY = async (id, body) => {
  return await http.put(`/users/cart/decreaseQuantity/${id}`, body);
};

export const DECREMENT_CART_QUANTITY_WITHOUT_LOGIN = async (id, body) => {
  return await http.put(`/cart/decreaseQuantity/${id}`, body);
};

export const DELETE_CART_ITEM = async (id) => {
  return await http.delete(`/users/cart/removeCart/${id}`);
};

export const DELETE_CART_ITEM_WITHOUT_LOGIN = async (id) => {
  return await http.delete(`/cart/removeCart/${id}`);
};

export const DELETE_ALLCART_ITEMS = async () => {
  return await http.delete(`/users/cart/clearCart`);
};

export const DELETE_ALLCART_ITEMS_WITHOUT_LOGIN = async (deviceToken) => {
  return await http.delete(`/cart/clearCart/${deviceToken}`);
};

export const ADD_WISHLIST = async (body) => {
  return await http.post(`/users/wishlist/add`, body);
};

export const GET_WISHLIST = async (page, type) => {
  return await http.get(`/users/wishlist/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations.PER_PAGE,
      type: type,
    },
  });
};
export const PRODUCT_DETAIL_WITHOUT_AUTH = async (id) => {
  return await http.get(`/product/detail/${id}`);
};

export const PRODUCT_DETAIL_AUTH = async (id) => {
  return await http.get(`/users/product/detail/${id}`);
};

export const SIMILAR_PRODUCT_LIST_WITHOUT_AUTH = async (id, page) => {
  return await http.get(`/product/similarProductList`, {
    params: {
      categoryId: id,
      pageNo: page,
      pageLimit: Paginations.PER_PAGE,
    },
  });
};
export const SIMILAR_PRODUCT_LIST_AUTH = async (id, page) => {
  return await http.get(`/users/product/similarProductList`, {
    params: {
      categoryId: id,
      pageNo: page,
      pageLimit: Paginations.PER_PAGE,
    },
  });
};

export const USER_CATEGORYLIST = async (page) => {
  return await http.get(`/category/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
    },
  });
};

export const USER_COMPANYLIST = async (search = '') => {
  return await http.get(`/company/activeCompanyList?search=${search}`);
};

export const FILTER_PRODUCT = async (categoryIds, companyIds) => {
  return await http.get(`/product/filterProduct`, {
    params: {
      categoryId: JSON.stringify(categoryIds), // Send as a JSON string
      companyId: JSON.stringify(companyIds), // Send as a JSON string
    },
  });
};
export const ADD_CONTACT_US = async (body) => {
  return await http.post(`/contactUs/add`, body);
};
export const CONTACT_US_API = async (page, search, state) => {
  return await http.get(`/admin/contactUs/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations.PER_PAGE,
      search: search,
      stateId: state,
    },
  });
};
export const DELETE_CONTACT_US = async (id) => {
  return await http.delete(`/admin/contactus/delete/${id}`);
};
export const VIEW_CONTACT_US_API = async (id) => {
  return await http.get(`/admin/contactus/view/${id}`);
};
export const staticPages = async (typeId) => {
  return await http.get(`/pages/cms/${typeId}`);
};
/***************************************PROMOTION API**************************************/

export const ADD_PROMOTION_API = async (body) => {
  return await http.post(`/admin/promotion/add`, body);
};
export const EDIT_PROMOTION_API = async (id, body) => {
  return await http.put(`/admin/promotion/update/${id}`, body);
};
export const GET_PROMOTION_DETAIL_API = async (id) => {
  return await http.get(`/admin/promotion/detail/${id}`);
};

export const GET_PROMOTION_LIST_API = async (page, search, state) => {
  return await http.get(`/admin/promotion/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations.PER_PAGE,
      search: search,
      stateId: state,
    },
  });
};

export const STATE_UPDATE_PROMOTION_API = async (id, stateId) => {
  return await http.put(
    `/admin/promotion/updateState/${id}?stateId=${stateId}`
  );
};

export const SINGLE_PROMOTION_VIEW = async (id) => {
  return await http.get(`/admin/promotion/detail/${id}`);
};

export const DELETE_PROMOTION = async (id) => {
  return await http.delete(`/admin/promotion/delete/${id}`);
};

/****************************BANNER MANAGEMENT MODULE*******************************/
export const ADD_BANNER_API = async (body) => {
  return await http.post(`/admin/banner/add`, body);
};
export const GET_BANNER_API = async (page, search, state) => {
  return await http.get(`/admin/banner/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      search: search,
      stateId: state,
    },
  });
};
export const GET_BANNER_DETAIL = async (id) => {
  return await http.get(`/admin/banner/detail/${id}`);
};
export const EDIT_BANNER_API = async (id, body) => {
  return await http.put(`/admin/banner/update/${id}`, body);
};
export const STATE_UPDATE_BANNER_API = async (id, stateId) => {
  return await http.put(`/admin/banner/updateState/${id}?stateId=${stateId}`);
};
export const DELETE_BANNER_API = async (id) => {
  return await http.delete(`/admin/banner/delete/${id}`);
};

/****************************USER BANNER*******************************/

export const GET_BANNER_USER_API = async () => {
  return await http.get(`/banner/activeBanner`);
};

export const GET_BRANCHES_API = async (page, companyId) => {
  return await http.get(`/users/branch/branchByCompany`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      companyId: companyId,
    },
  });
};

/****************************USER BANNER*******************************/

export const ADD_PRODUCT_API = async (body) => {
  return await http.post(`/admin/product/add`, body);
};

export const EDIT_PRODUCT_API = async (id, body) => {
  return await http.put(`/admin/product/edit/${id}`, body);
};

export const DELETE_PRODUCT_IMAGE = async (id, productImage) => {
  return await http.delete(`/admin/product/deleteImg/${id}?id=${productImage}`);
};

export const GET_ORDER_API = async (
  page,
  search,
  deliveryStatus,
  companyArr,
  startDate,
  endDate
) => {
  return await http.get(`/admin/order/adminOrderList`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      search: search,
      deliveryStatus: deliveryStatus,
      companyArr: companyArr,
      startDate: startDate,
      endDate: endDate,
    },
  });
};

export const GET_ORDER_DETAIL = async (id) => {
  return await http.get(`/admin/order/orderDetails/${id}`);
};

export const ADD_USER_DETAILS_ADDRESS = async (body) => {
  return await http.post(`/users/address/add`, body);
};
export const EDIT_USER_DETAILS_ADDRESS = async (id, body) => {
  return await http.put(`/users/address/edit/${id}`, body);
};
export const USER_ADDRESS_LIST = async (page) => {
  return await http.get(`/users/address/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
    },
  });
};

export const USER_CART = async (orderType = '', page = 1) => {
  return await http.get(
    `/users/cart/list?orderType=${orderType}&pageNo=${page}`
  );
};

export const PROMOCODE_USER_CART = async (
  promoCode = '',
  orderType = '',
  page
) => {
  return await http.get(
    `/users/cart/list?promoId=${promoCode}&orderType=${orderType}&pageNo=${page}`
  );
};

export const USER_CART_WITHOUT_LOGIN = async (
  orderType = '',
  page = 1,
  deviceToken = ''
) => {
  return await http.get(
    `/cart/list?orderType=${orderType}&pageNo=${page}&deviceToken=${deviceToken}`
  );
};

export const PROMOCODE_USER_CART_WITHOUT_LOGIN = async (
  promoCode = '',
  orderType = '',
  page,
  deviceToken = ''
) => {
  return await http.get(
    `/cart/list?promoId=${promoCode}&orderType=${orderType}&pageNo=${page}&deviceToken=${deviceToken}`
  );
};

/************************ORDER LIST**************************/

export const GET_USER_ORDER_LIST = async (page, search) => {
  return await http.get(`/users/order/myOrder`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      search: search,
    },
  });
};

export const createUserOrder = async (body) => {
  return await http.post(`/users/order/createOrder`, body);
};

export const checkVerify = async (body) => {
  return await http.put(`/users/order/verifyAccount`, body);
};

export const GET_USER_PROMOTION_LIST = async (page) => {
  return await http.get(`/users/promotion/activeList`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
    },
  });
};
export const DELETE_ADDRESS = async (id) => {
  return await http.delete(`/users/address/delete/${id}`);
};

export const DEFAULT_ADDRESSS_MARKED = async (id, body) => {
  return await http.put(`/users/address/setDefault/${id}`, body);
};
export const ADDRESS_DETAIL_USER = async (id) => {
  return await http.get(`/users/address/details/${id}`);
};

// Admin Product  branch filter

export const GET_ADMIN_PRODUCT_BRANCH = async (
  page,
  search,
  state,
  companyId
) => {
  return await http.get(`/admin/branch/companyFilter`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      search: search,
      stateId: state,
      companyId: companyId,
    },
  });
};

/************************Testimonials**************************/
export const ADD_TESTIMONIAL_API = async (body) => {
  return await http.post(`/admin/testimonial/add`, body);
};

export const EDIT_TESTIMONIAL_API = async (id, body) => {
  return await http.put(`/admin/testimonial/edit/${id}`, body);
};

export const DELETE_TESTIMONIAL_API = async (id) => {
  return await http.delete(`/admin/testimonial/delete/${id}`);
};

export const GET_TESTIMONIAL_API = async (page, search, state) => {
  return await http.get(`/admin/testimonial/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      search: search,
      stateId: state,
    },
  });
};

export const GET_TESTIMONIAL_DETAIL = async (id) => {
  return await http.get(`/admin/testimonial/details/${id}`);
};

export const STATE_UPDATE_TESTIMONIAL_API = async (id, stateId) => {
  return await http.put(
    `/admin/testimonial/changeState/${id}?stateId=${stateId}`
  );
};
export const GET_USER_TESTIMONIAL = async () => {
  return await http.get(`/testimonial/list?active=${true}`);
};

export const GET_USER_OFFERS = async () => {
  return await http.get(`/offer/activeOfferList`);
};

export const GET_COUNT_DETAIL = async () => {
  return await http.get(`/admin/dashboard/count`);
};

export const GET_DOWNLOAD_SAMPLE = async () => {
  return await http.get(`/admin/product/downloadSample`);
};

export const ADD_IMPORT_CSV = async (body) => {
  return await http.post(`/admin/product/importCsv`, body);
};

export const ADMIN_GRAPH_DATA = async (year) => {
  return await http.get(`/admin/dashboard/graphData/${year}`);
};

/************************Contact Info**************************/
export const ADD_CONTACT_INFO = async (body) => {
  return await http.post(`/admin/contactInfo/add`, body);
};

export const EDIT_CONTACT_INFO = async (id, body) => {
  return await http.put(`/admin/contactInfo/edit/${id}`, body);
};

export const DELETE_CONTACT_INFO = async (id) => {
  return await http.delete(`/admin/contactInfo/delete/${id}`);
};

export const GET_CONTACT_INFO = async (page, search, state) => {
  return await http.get(`/admin/contactInfo/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      // search: search,
      // stateId: state,
    },
  });
};

export const GET_CONTACT_INFO_DETAILS = async (id) => {
  return await http.get(`/admin/contactInfo/details/${id}`);
};

// export const STATE_CONTACT_INFO = async (id, stateId) => {
//   return await http.put(`/admin/testimonial/changeState/${id}?stateId=${stateId}`);
// }

/************************Tansaction List**************************/
export const GET_TRANSACTION_LIST_API = async (page, search, state) => {
  return await http.get(`/admin/payment/transactionList`, {
    params: {
      pageNo: page,
      pageLimit: Paginations.PER_PAGE,
      search: search,
      stateId: state,
    },
  });
};

export const GET_REFUND_LIST_API = async (page, search, state) => {
  return await http.get(`/admin/refundRequest/requestList`, {
    params: {
      pageNo: page,
      pageLimit: Paginations.PER_PAGE,
      search: search,
      stateId: state,
    },
  });
};

export const STATE_UPDATE_REFUND_API = async (id, stateId) => {
  return await http.put(
    `/admin/refundRequest/updateRequest/${id}?stateId=${stateId}`
  );
};

export const GET_TRANSACTION_DETAILS = async (id) => {
  return await http.get(`/admin/payment/transactionView/${id}`);
};
export const GET_PRODUCTLIST_CATEGORY = async (category) => {
  return await http.get(`/product/userProduct`, {
    params: {
      category: category,
    },
  });
};

export const GET_PRODUCTLIST_CATEGORY_AUTH = async (category) => {
  return await http.get(`/users/product/userProduct`, {
    params: {
      category: category,
    },
  });
};

export const GET_PRODUCTLIST_OFFERED = async () => {
  return await http.get(`/company/companyByOffer`);
};
export const GET_PRODUCTLIST_OFFERED_AUTH = async () => {
  return await http.get(`/users/company/companyByOffer`);
};
export const GET_NOTIFICATION_LIST_USERS = async (page) => {
  return await http.get(`/users/notification/myNotification`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
    },
  });
};

export const GET_USER_ORDER_DETAILS = async (id) => {
  return await http.get(`/users/order/orderDetails/${id}`);
};

export const GET_USER_BRANCH_SLOT = async (id, day) => {
  return await http.get(`/users/scheduleOrder/slotList/${id}?day=${day}`);
};

export const ADD_REVIEW = async (body) => {
  return await http.post(`/users/review/add`, body);
};

export const REVIEW_LIST = async (page, productId) => {
  return await http.get(`/users/review/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      productId: productId,
    },
  });
};

export const WITHOUTAUTH_REVIEW_LIST = async (page, productId) => {
  return await http.get(`/review/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      productId: productId,
    },
  });
};

/************************Dynamic QUESTION**************************/
export const ADD_DYNAMIC_QUESTION = async (body) => {
  return await http.post(`/admin/dynamic/add`, body);
};

export const EDIT_DYNAMIC_QUESTION = async (id, body) => {
  return await http.put(`/admin/dynamic/update/${id}`, body);
};

export const GET_DYNAMIC_DETAILS = async (id) => {
  return await http.get(`/admin/dynamic/detail/${id}`);
};

export const GET_DYNAMIC_LIST = async (page) => {
  return await http.get(`/admin/dynamic/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
    },
  });
};

export const GET_ASSIGIN_PRODUCT = async (question_id, productId) => {
  return await http.put(
    `/admin/dynamic/assignQuestion/${question_id}?productId=${productId}`
  );
};

export const REPLY_DYNAMIC_QUESTION_ANSWER = async (body) => {
  return await http.post(`/users/dynamic/submitAnswer`, body);
};

export const DELETE_DYNAMIC_DETAILS = async (id) => {
  return await http.delete(`/admin/dynamic/delete/${id}`);
};

export const GET_BEST_SELLER = async (search, page) => {
  return await http.get(`/product/bestSellerProduct`, {
    params: {
      search: search,
      pageNo: page,
      pageLimit: Paginations?.PRODUCT_PER_PAGE,
    },
  });
};

export const USER_GET_BEST_SELLER = async (search, page) => {
  return await http.get(`/users/product/bestSellerProduct`, {
    params: {
      search: search,
      pageNo: page,
      pageLimit: Paginations?.PRODUCT_PER_PAGE,
    },
  });
};

export const USER_GET_BEST_SELLER_DETAIL = async (id) => {
  return await http.get(`/users/company/companyDetails/${id}`);
};

export const GET_BEST_SELLER_DETAIL = async (id) => {
  return await http.get(`/company/companyDetails/${id}`);
};

/***************************************PROMOTION API**************************************/

export const ADD_CLASSIFICATION_API = async (body) => {
  return await http.post(`/admin/classification/add`, body);
};
export const EDIT_CLASSIFICATION_API = async (id, body) => {
  return await http.put(`/admin/classification/update/${id}`, body);
};
export const GET_CLASSIFICATION_DETAIL_API = async (id) => {
  return await http.get(`/admin/classification/detail/${id}`);
};

export const GET_CLASSIFICATION_LIST_API = async (page, search, state) => {
  return await http.get(`/admin/classification/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations.PER_PAGE,
      search: search,
      stateId: state,
    },
  });
};

export const STATE_UPDATE_CLASSIFICATION_API = async (id, stateId) => {
  return await http.put(
    `/admin/classification/updateState/${id}?stateId=${stateId}`
  );
};

export const GET_SEARCH_CLASSIFICATION_API = async (
  page,
  pageLimit,
  state,
  search
) => {
  return await http.get(
    `/admin/classification/dropDown?pageNo=${page}&pageLimit=${pageLimit}&stateId=${state}&search=${search}`
  );
};

export const GET_USERS_CLASSIFICATION_API = async (id) => {
  return await http.get(`/classification/companyClassification/${id}`);
};

export const GET_CLASSIFICATION_PRODUCTLIST = async (
  classification,
  classificationCompany,
  page,
  pageLimit = 12
) => {
  return await http.get(`/product/userProduct`, {
    params: {
      classification: classification,
      classificationCompany: classificationCompany,
      pageNo: page,
      pageLimit: pageLimit,
    },
  });
};

export const GET_CLASSIFICATION_PRODUCTLIST_AUTH = async (
  classification,
  classificationCompany,
  page,
  pageLimit = 12
) => {
  return await http.get(`/users/product/userProduct`, {
    params: {
      classification: classification,
      classificationCompany: classificationCompany,
      pageNo: page,
      pageLimit: pageLimit,
    },
  });
};

export const GET_USERS_DASHBOARD_COUNT = async () => {
  return await http.get(`/users/dashboard/count`);
};

export const ADD_PERMISSIONS = async (body) => {
  return await http.post(`/admin/permission/add`, body);
};

export const UPDATE_PERMISSIONS = async (id, body) => {
  return await http.post(`/admin/role/update/${id}`, body);
};

export const GET_FILTER_CLASSIFICATION_API = async () => {
  return await http.get(`/classification/activeClassification`);
};

export const GET_REVIEW_API = async (page, productId) => {
  return await http.get(`/admin/review/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      productId: productId,
    },
  });
};

export const STATE_UPDATE_ORDER_API = async (id, stateId) => {
  return await http.put(
    `/admin/order/updateOrderState/${id}?stateId=${stateId}`
  );
};

export const CANCLE_ORDER_API = async (id, body) => {
  return await http.put(`/admin/order/cancelOrder/${id}`, body);
};

export const USER_CANCLE_ORDER_API = async (id, body) => {
  return await http.put(`/users/order/cancelOrder/${id}`, body);
};

export const GET_REPORTS_API = async (page) => {
  return await http.get(`/users/order/invoiceList`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
    },
  });
};
export const DOWNLOAD_REPORTS_API = async (id) => {
  return await http.get(`/users/order/downloadOrderReport/${id}`);
};

export const PAYMENT_CARD_TOKEN = async (body) => {
  return await http.post(`/payment/addCard`, body);
};

export const GET_INVOICELIST_API = async (page, productId) => {
  return await http.get(`/admin/order/invoiceList`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      productId: productId,
    },
  });
};

export const DOWNLOAD_INVOICE = async (id) => {
  return await http.get(`/admin/order/downloadOrderReport/${id}`);
};

export const DOWNLOAD_INVOICE_COMPNAY = async (startDate, endDate, type) => {
  return await http.get(`/admin/company/downloadCompanyReport`, {
    params: {
      startDate: startDate,
      endDate: endDate,
      type: type,
    },
  });
};

export const GET_MANUAL_NOTIFICATIONLIST = async (page) => {
  return await http.get(`/admin/notification/getAdminNotificationList`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
    },
  });
};

export const ADD_MANUAL_NOTIFICATIONS = async (body) => {
  return await http.post(`/admin/notification/sendNotification`, body);
};

export const VIEW_MANUAL_NOTIFICATIONS = async (id) => {
  return await http.get(`/admin/notification/notificationView/${id}`);
};

export const DOWNLOAD_USER_REPORT = async (startDate, endDate, country) => {
  return await http.get(`/admin/user/downloadLoginReport`, {
    params: {
      startDate: startDate,
      endDate: endDate,
      country: country,
    },
  });
};

export const USERS_LIST_DROPDOWN = async (search) => {
  return await http.get(`/auth/activeUser?search=${search}`);
};

export const PRODUCT_ITEM_DOWNLOAD_REPORT = async (startDate, endDate) => {
  return await http.get(`/admin/product/downloadItemReport`, {
    params: {
      startDate: startDate,
      endDate: endDate,
    },
  });
};

export const DOWNLOAD_MONTHLY_REPORT = async (
  startDate,
  endDate,
  company,
  deliveryStatus
) => {
  return await http.get(`/admin/order/downloadMonthlyReport`, {
    params: {
      startDate: startDate,
      endDate: endDate,
      company: company,
      deliveryStatus: deliveryStatus,
    },
  });
};

export const DOWNLOAD_COUPON_REPORT = async (startDate, endDate, isUsed) => {
  return await http.get(`/admin/coupon/downloadCouponReport`, {
    params: {
      startDate: startDate,
      endDate: endDate,
      isUsed: isUsed,
    },
  });
};

export const PAYMENT_PROCESS = async (body) => {
  return await http.post(`/users/payment/charge`, body);
};

export const PAYMENT_PROCESS_STATUS = async (chargeId) => {
  return await http.get(`/users/payment/charge?chargeId=${chargeId}`);
};

export const GET_COMPANIES_LIST = async (search, page) => {
  return await http.get(`/users/company/allCompany`, {
    params: {
      search: search,
      pageNo: page,
      pageLimit: Paginations?.PRODUCT_PER_PAGE,
    },
  });
};

export const ALL_COMPANIES_LIST = async (search, page) => {
  return await http.get(`/company/allCompany`, {
    params: {
      search: search,
      pageNo: page,
      pageLimit: Paginations?.PRODUCT_PER_PAGE,
    },
  });
};

/****************************OFFER MODULE*******************************/
export const ADD_OFFER_API = async (body) => {
  return await http.post(`/admin/offer/add`, body);
};
export const GET_OFFER_API = async (page, search, state) => {
  return await http.get(`/admin/offer/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      search: search,
      stateId: state,
    },
  });
};
export const GET_OFFER_DETAIL = async (id) => {
  return await http.get(`/admin/offer/detail/${id}`);
};
export const EDIT_OFFER_API = async (id, body) => {
  return await http.put(`/admin/offer/update/${id}`, body);
};
export const STATE_UPDATE_OFFER_API = async (id, stateId) => {
  return await http.put(`/admin/offer/updateState/${id}?stateId=${stateId}`);
};
export const DELETE_OFFER_API = async (id) => {
  return await http.delete(`/admin/offer/delete/${id}`);
};
/****************************SOCAIL LINK*******************************/

export const GET_SOCIAL_LINKS = async () => {
  return await http.get(`/contactInfo/list`);
};
export const GET_MY_TRANSACTIONS = async (page) => {
  return await http.get(`/users/payment/myTransaction`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
    },
  });
};

export const ADMIN_REFUND = async (refundId, body) => {
  return await http.post(`/admin/payment/refund/${refundId}`, body);
};
export const DOWNLOAD_REFUND_REPORTS = async (startDate, endDate) => {
  return await http.get(`/admin/payment/downloadRefundReport`, {
    params: {
      startDate: startDate,
      endDate: endDate,
    },
  });
};
export const GET_MY_REFUND = async (page) => {
  return await http.get(`/users/payment/myRefundList`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
    },
  });
};

export const GET_USERS_CARD_LIST = async () => {
  return await http.get(`/users/payment/cardList`);
};

export const GET_USERS_CARD_DELETE = async (cardId) => {
  return await http.delete(`/users/payment/deleteCard/${cardId}`);
};

export const GET_ELECTRONICS_COMPANY_HOME = async (electricCategory, page) => {
  return await http.get(`/company/electricCompany`, {
    params: {
      electricCategory: electricCategory,
      pageNo: page,
      pageLimit: Paginations.PER_PAGE,
    },
  });
};

export const GET_ELECTRONICS_USERS_COMPANY_HOME = async (
  electricCategory,
  page
) => {
  return await http.get(`/users/company/electricCompany`, {
    params: {
      electricCategory: electricCategory,
      pageNo: page,
      pageLimit: Paginations.PER_PAGE,
    },
  });
};

export const GET_COUPON_COMPANY_HOME = async (page) => {
  return await http.get(`/company/couponCompany`, {
    params: {
      pageNo: page,
      pageLimit: Paginations.PER_PAGE,
    },
  });
};

export const GET_USERS_COUPON_COMPANY_HOME = async (page) => {
  return await http.get(`/users/company/couponCompany`, {
    params: {
      pageNo: page,
      pageLimit: Paginations.PER_PAGE,
    },
  });
};

export const GET_TODAY_OFFERS_COMPANY_HOME = async (page) => {
  return await http.get(`/company/popularToday`, {
    params: {
      pageNo: page,
      pageLimit: Paginations.PER_PAGE,
    },
  });
};

export const GET_USERS_TODAY_OFFERS_COMPANY_HOME = async (page) => {
  return await http.get(`/users/company/popularToday`, {
    params: {
      pageNo: page,
      pageLimit: Paginations.PER_PAGE,
    },
  });
};

export const ACCOUNT_ADD = async (body) => {
  return await http.post(`/admin/statementAccount/add`, body);
};

export const GET_ACCOUNT_LIST = async (page, search, stateId) => {
  return await http.get(`/admin/statementAccount/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations.PER_PAGE,
      search: search,
      stateId: stateId,
    },
  });
};

export const DELETE_ACCOUNT_ID = async (id) => {
  return await http.delete(`/admin/statementAccount/delete/${id}`);
};
export const STATE_UPDATE_ACCOUNT = async (id, stateId) => {
  return await http.put(
    `/admin/statementAccount/updateState/${id}?stateId=${stateId}`
  );
};

export const ACCOUNT_INFORMATION_DETAIL = async (id) => {
  return await http.get(`/admin/statementAccount/details/${id}`);
};
export const UPDATE_ACCOUNT = async (id, body) => {
  return await http.put(`/admin/statementAccount/edit/${id}`, body);
};

/****************************OFFER MODULE*******************************/
export const ADD_SPIN_API = async (body) => {
  return await http.post(`/admin/spinner/add`, body);
};
export const GET_SPIN_API = async (page, search, state) => {
  return await http.get(`/admin/spinner/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      search: search,
      stateId: state,
    },
  });
};
export const GET_SPIN_DETAIL = async (id) => {
  return await http.get(`/admin/spinner/detail/${id}`);
};
export const EDIT_SPIN_API = async (id, body) => {
  return await http.put(`/admin/spinner/update/${id}`, body);
};
export const STATE_UPDATE_SPIN_API = async (id, stateId) => {
  return await http.put(`/admin/spinner/updateState/${id}?stateId=${stateId}`);
};
export const DELETE_SPIN_API = async (id) => {
  return await http.delete(`/admin/spinner/delete/${id}`);
};
// Spin Settings
export const ADD_SPIN_SETTINGS_API = async (body) => {
  return await http.post(`/admin/spinner/setting/add`, body);
};
export const GET_SPIN_SETTINGS_API = async (page, search, state) => {
  return await http.get(`/admin/spinner/setting/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      search: search,
      stateId: state,
    },
  });
};
export const GET_SPIN_SETTINGS_DETAIL = async (id) => {
  return await http.get(`/admin/spinner/setting/detail/${id}`);
};
export const EDIT_SPIN_SETTINGS_API = async (id, body) => {
  return await http.put(`/admin/spinner/setting/update/${id}`, body);
};
export const STATE_UPDATE_SETTINGS_SPIN_API = async (id, stateId) => {
  return await http.put(
    `/admin/spinner/setting/updateState/${id}?stateId=${stateId}`
  );
};
export const DELETE_SPIN_SETTINGS_API = async (id) => {
  return await http.delete(`/admin/spinner/setting/delete/${id}`);
};

export const ACCOUNT_STATEMENT_LIST = async (payload, page) => {
  const { company, accountType, startDate, endDate, percentage } = payload;
  return await http.get(`/admin/statementAccount/statementTransaction`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      company,
      accountType,
      startDate,
      endDate,
      percentage,
    },
  });
};
export const UPDATE_ACCOUNT_STATEMENT_LIST = async (id, body) => {
  return await http.put(
    `/admin/statementAccount/updateStatementTransaction/${id}`,
    body
  );
};

export const ADD_ACCOUNT_STATEMENT = async (body) => {
  return await http.post(
    `/admin/statementAccount/statementTransaction/add`,
    body
  );
};

export const VIEW_ACCOUNT_STATEMENT = async (id) => {
  return await http.get(
    `/admin/statementAccount/viewStatementTransaction/${id}`
  );
};

export const GET_WALLET_LIST = async (page) => {
  return await http.get(`/users/cashback/myCashBack`, {
    params: {
      pageNo: page,
      pageLimit: Paginations.PER_PAGE,
    },
  });
};
export const RESEND_EMAIL = async (body) => {
  return await http.post(`/admin/user/resendEmail`, body);
};

export const ADD_DYNAMICLABEL_API = async (body) => {
  return await http.post(`/admin/dynamicLabeling/add`, body);
};

export const GET_DYNAMICLABEL_API = async (page, search, state) => {
  return await http.get(`/admin/dynamicLabeling/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      search: search,
      stateId: state,
    },
  });
};
export const GET_DYNAMICLABEL_DETAIL = async (id) => {
  return await http.get(`/admin/dynamicLabeling/detail/${id}`);
};
export const EDIT_DYNAMICLABEL_API = async (id, body) => {
  return await http.put(`/admin/dynamicLabeling/update/${id}`, body);
};
export const STATE_UPDATE_DYNAMICLABEL_API = async (id, stateId) => {
  return await http.put(
    `/admin/dynamicLabeling/updateState/${id}?stateId=${stateId}`
  );
};
export const DELETE_DYNAMICLABEL_API = async (id) => {
  return await http.delete(`/admin/dynamicLabeling/delete/${id}`);
};
export const GET_DYNAMICLABEL = async () => {
  return await http.get(`/dynamicLabeling/activeLabeling`);
};
export const GET_USERS_DYNAMICLABEL = async () => {
  return await http.get(`/users/dynamicLabeling/activeLabeling`);
};

export const GET_ALL_DYNAMICLABEL = async (title) => {
  return await http.get(`/dynamicLabeling/allLabeling?title=${title}`);
};
export const GET_USERS_ALL_DYNAMICLABEL = async (title) => {
  return await http.get(`/users/dynamicLabeling/allLabeling?title=${title}`);
};

export const GET_SMTP_API = async (page, search, state) => {
  return await http.get(`/admin/smtp/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      search: search,
      stateId: state,
    },
  });
};

export const ADD_SMTP = async (body) => {
  return await http.post(`/admin/smtp/add`, body);
};
export const EDIT_SMTP = async (id, body) => {
  return await http.put(`/admin/smtp/update/${id}`, body);
};

export const GET_DETAILS_SMTP = async (id) => {
  return await http.get(`/admin/smtp/view/${id}`);
};

export const DELETE_SMTP = async (id) => {
  return await http.delete(`/admin/smtp/delete/${id}`);
};

// Twilio
export const GET_TWILLIO_API = async (page, search, state) => {
  return await http.get(`/admin/twillio/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      search: search,
      stateId: state,
    },
  });
};
export const ADD_TWILLIO = async (body) => {
  return await http.post(`/admin/twillio/add`, body);
};
export const EDIT_TWILLIO = async (id, body) => {
  return await http.put(`/admin/twillio/update/${id}`, body);
};
export const GET_DETAILS_TWILLIO = async (id) => {
  return await http.get(`/admin/twillio/view/${id}`);
};
export const DELETE_TWILLIO = async (id) => {
  return await http.delete(`/admin/twillio/delete/${id}`);
};

export const REFUND_TRANSACTION_AMOUNT = async (id) => {
  return await http.post(`/admin/payment/transaction/refund/${id}`);
};

export const ADMIN_GET_SEARCH_SUBCATEGORY_API = async (
  page,
  pageLimit,
  state,
  search,
  categoryId
) => {
  return await http.get(
    `/admin/subcategory/list?pageNo=${page}&pageLimit=${pageLimit}&stateId=${state}&search=${search}&categoryId=${categoryId}`
  );
};

export const GET_FAQ_API = async (page) => {
  return await http.get(`/faq/faqList`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
    },
  });
};

export const LINK_EXPIRE = async (body) => {
  return await http.post(`/auth/expireLink`, body);
};

export const DEFAULT_IMAGE_ADMIN_PRODUCT = async (id, body) => {
  return await http.put(`/admin/product/setDefaultImage/${id}`, body);
};

export const SPIN_DOWNLOAD_REPORT = async (startDate, endDate) => {
  return await http.get(`/admin/spinner/downloadSpinnerReport`, {
    params: {
      startDate: startDate,
      endDate: endDate,
    },
  });
};

export const ACCOUNT_STATEMENT_DOWNLOAD_REPORT = async (payload, page) => {
  const { company, accountType, startDate, endDate, percentage } = payload;
  return await http.get(`/admin/statementAccount/downloadStatementReport`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
      company,
      accountType,
      startDate,
      endDate,
      percentage,
    },
  });
};

export const checkVerifyRegister = async (body) => {
  return await http.put(`/order/verifyAccount`, body);
};

export const resendOTPByOrderRegister = async (body) => {
  return await http.put(`/order/resendOtpForOrder`, body);
};

export const verifyOTPByLoginRegister = async (body) => {
  return await http.put(`/order/verifyOtpForOrder`, body);
};
export const deleteAccount = async () => {
  return await http.delete(`/auth/deleteAccount`);
};
export const refundGeneratePerProduct = async (body) => {
  return await http.post(`/admin/payment/itemRefund`, body);
};
export const DELETE_ADMIN_PRODUCT = async (body) => {
  return await http.post(`/admin/product/deleteProduct/`, body);
};

/****************************SMS LOGS MODULE*******************************/

export const adminGetAllSMS = async (pageNo, search = '') => {
  return await http.get(
    `/admin/smsLogs/list?pageNo=${pageNo}&search=${search}`
  );
};

export const adminGetSingleSMS = async (id) => {
  return await http.get(`/admin/smsLogs/details/${id}`);
};

export const deleteAllSMS = async () => {
  return await http.delete(`/admin/smsLogs/deleteAll`);
};

export const deleteSingleSMS = async (id) => {
  return await http.delete(`/admin/smsLogs/delete/${id}`);
};

// App version
export const GET_APPVERSION_API = async (page) => {
  return await http.get(`/admin/appversion/list`, {
    params: {
      pageNo: page,
      pageLimit: Paginations?.PER_PAGE,
    },
  });
};
export const ADD_VERSION = async (body) => {
  return await http.post(`/admin/appversion/add`, body);
};
export const GET_DETAILS_APPVERSION = async (id) => {
  return await http.get(`/admin/appversion/details/${id}`);
};

export const EDIT_VERSION = async (id, body) => {
  return await http.put(`/admin/appversion/update/${id}`, body);
};

export const DELETE_VERSION = async (id) => {
  return await http.delete(`/admin/appversion/delete/${id}`);
};

export const USER_COUNTRY_EXIST = async (body) => {
  return await http.post(`/auth/userExist`, body);
};

export const USER_ROLES_PRIVILIGES = async () => {
  return await http.get(`/admin/permission/permissionDetails`);
};
