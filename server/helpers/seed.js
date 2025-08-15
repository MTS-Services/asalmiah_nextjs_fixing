const { USER } = require("../app/userService/model/userModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { CONST } = require("./constant");
const winston = require("winston");
const dotenv = require("dotenv");
const { CATEGORY_MODEL } = require("../app/category/model/category.model");
const { CLASS_MODEL } = require("../app/class/model/class.model");
const { CALSSIFICATION } = require("../app/classification/model/model");
const { COMPANY_MODEL } = require("../app/company/model/model");
const { PRODUCT_MODEL } = require("../app/product/model/product.model");

// Configure winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'seed.log' })
  ]
});

dotenv.config();

mongoose.connect(process.env.DB_URL);

const createAdmin = async () => {
  const payload = {
    name: "Admin",
    email: process.env.ADMIN_EMAIL,
    password: await bcrypt.hash(
      process.env.ADMIN_EMAIL_PWD,
      parseInt(process.env.SALT_ROUNDS)
    ),
    roleId: CONST.ADMIN,
    stateId: CONST.ACTIVE,
    isVerified: true,
  };

  const isEXists = await USER.findOne({ email: payload.email });
  if (isEXists) {
    logger.info(`Admin already created`);
  } else {
    const createAdmin = await USER.create(payload);
    logger.info(createAdmin ? "Admin created successfully" : "Admin not created");
  }
};

const createUser = async () => {
  const payload = {
    fullName: "Test User",
    firstName: "Test",
    lastName: "User",
    email: process.env.USER_EMAIL || "testuser@example.com",
    password: await bcrypt.hash(
      process.env.USER_PASSWORD || "password123",
      parseInt(process.env.SALT_ROUNDS)
    ),
    countryCode: "+1",
    mobile: 1234567890,
    roleId: CONST.USER,
    stateId: CONST.ACTIVE,
    isVerified: true,
    isTermsCondition: true,
    gender: CONST.MALE,
  };

  const isExists = await USER.findOne({ email: payload.email });
  if (isExists) {
    logger.info(`User already created`);
  } else {
    const createUser = await USER.create(payload);
    logger.info(createUser ? "User created successfully" : "User not created");
  }
};

const createCategory = async () => {
  const categoryArr = [
    { category: "Coupon", arabicCategory: "قسيمة" },
    { category: "Health", arabicCategory: "صحة" },
    { category: "Grocery", arabicCategory: "خضروات" },
    { category: "Cars", arabicCategory: "سيارات" },
    { category: "Electric", arabicCategory: "كهربائي" },
    { category: "Entertainment", arabicCategory: "ترفيه" },
    { category: "Cosmetology", arabicCategory: "التجميل" },
  ];

  const findAdmin = await USER.findOne({ roleId: CONST.ADMIN });

  for (const element of categoryArr) {
    const payload = {
      category: element.category,
      arabicCategory: element.arabicCategory,
      createdBy: findAdmin._id,
    };

    const isExist = await CATEGORY_MODEL.findOne({ category: payload.category });
    if (isExist) {
      logger.info(`Category already created`);
    } else {
      await CATEGORY_MODEL(payload).save();
      logger.info(`Category "${payload.category}" created`);
    }
  }
};


const createClass = async () => {
  const classArr = [
    { name: "Electronics", arabicName: "إلكترونيات", order: 1 },
    { name: "Clothing", arabicName: "ملابس", order: 2 },
    { name: "Home & Garden", arabicName: "المنزل والحديقة", order: 3 },
    { name: "Sports", arabicName: "رياضة", order: 4 },
    { name: "Books", arabicName: "كتب", order: 5 },
    { name: "Toys", arabicName: "ألعاب", order: 6 },
    { name: "Beauty", arabicName: "جمال", order: 7 },
  ];

  const findAdmin = await USER.findOne({ roleId: CONST.ADMIN });
  const categories = await CATEGORY_MODEL.find({ stateId: CONST.ACTIVE });

  for (const element of classArr) {
    // Assign to first available category or create without category
    const categoryId = categories.length > 0 ? categories[0]._id : null;
    
    const payload = {
      name: element.name,
      arbicName: element.arabicName,
      categoryId: categoryId,
      order: element.order,
      createdBy: findAdmin._id,
      stateId: CONST.ACTIVE,
    };

    const isExist = await CLASS_MODEL.findOne({ name: payload.name });
    if (isExist) {
      logger.info(`Class "${payload.name}" already exists`);
    } else {
      await CLASS_MODEL(payload).save();
      logger.info(`Class "${payload.name}" created successfully`);
    }
  }
};

const createClassification = async () => {
  const classificationArr = [
    { name: "Premium", arabicName: "مميز", order: 1 },
    { name: "Standard", arabicName: "عادي", order: 2 },
    { name: "Budget", arabicName: "اقتصادي", order: 3 },
    { name: "Luxury", arabicName: "فاخر", order: 4 },
    { name: "Essential", arabicName: "أساسي", order: 5 },
  ];

  const findAdmin = await USER.findOne({ roleId: CONST.ADMIN });
  const classes = await CLASS_MODEL.find({ stateId: CONST.ACTIVE });

  for (const element of classificationArr) {
    // Assign to first available class or create without class
    const classId = classes.length > 0 ? classes[0]._id : null;
    
    const payload = {
      name: element.name,
      arbicName: element.arabicName,
      classId: classId,
      order: element.order,
      createdBy: findAdmin._id,
      stateId: CONST.ACTIVE,
    };

    const isExist = await CALSSIFICATION.findOne({ name: payload.name });
    if (isExist) {
      logger.info(`Classification "${payload.name}" already exists`);
    } else {
      await CALSSIFICATION(payload).save();
      logger.info(`Classification "${payload.name}" created successfully`);
    }
  }
};

const createCompany = async () => {
  const companyArr = [
    {
      company: "TechMart",
      actualCompanyName: "TechMart Electronics LLC",
      arabicCompany: "تك مارت",
      arabicActualCompanyName: "تك مارت للإلكترونيات ذ.م.م",
      description: "Leading electronics retailer in Kuwait",
      arabicDescription: "بائع تجزئة رائد للإلكترونيات في الكويت",
      perCommission: 5,
      commissionType: CONST.PERCENTAGE,
      couponService: true,
      deliveryEligible: true,
      pickupService: true,
      costDelivery: 2,
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop",
      coverImg: "https://images.unsplash.com/photo-1560472355-536de3962603?w=800&h=400&fit=crop",
      email: "info@techmart.com",
      countryCode: "+965",
      mobile: "99887766",
      order: 1,
      paymentPeriod: 30,
      deliveryService: true,
      deliveryCompanyChecked: "yes",
      country: "Kuwait",
    },
    {
      company: "FashionHub",
      actualCompanyName: "Fashion Hub Trading Co.",
      arabicCompany: "مركز الموضة",
      arabicActualCompanyName: "شركة مركز الموضة التجارية",
      description: "Trendy fashion and clothing store",
      arabicDescription: "متجر أزياء وملابس عصرية",
      perCommission: 8,
      commissionType: CONST.PERCENTAGE,
      couponService: true,
      deliveryEligible: true,
      pickupService: false,
      costDelivery: 1.5,
      logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop",
      coverImg: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=400&fit=crop",
      email: "contact@fashionhub.com",
      countryCode: "+965",
      mobile: "98765432",
      order: 2,
      paymentPeriod: 15,
      deliveryService: true,
      deliveryCompanyChecked: "no",
      country: "Kuwait",
    },
    {
      company: "HealthPlus",
      actualCompanyName: "HealthPlus Pharmacy Chain",
      arabicCompany: "هيلث بلس",
      arabicActualCompanyName: "سلسلة صيدليات هيلث بلس",
      description: "Your trusted pharmacy and health store",
      arabicDescription: "صيدليتك الموثوقة ومتجر الصحة",
      perCommission: 3,
      commissionType: CONST.PERCENTAGE,
      couponService: false,
      deliveryEligible: true,
      pickupService: true,
      costDelivery: 1,
      logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200&h=200&fit=crop",
      coverImg: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop",
      email: "support@healthplus.com",
      countryCode: "+965",
      mobile: "97654321",
      order: 3,
      paymentPeriod: 7,
      deliveryService: true,
      deliveryCompanyChecked: "yes",
      country: "Kuwait",
    },
    {
      company: "AutoWorld",
      actualCompanyName: "AutoWorld Car Services",
      arabicCompany: "عالم السيارات",
      arabicActualCompanyName: "خدمات عالم السيارات",
      description: "Complete automotive solutions and services",
      arabicDescription: "حلول وخدمات السيارات الشاملة",
      perCommission: 100,
      commissionType: CONST.FIX_AMOUNT,
      couponService: true,
      deliveryEligible: false,
      pickupService: true,
      costDelivery: 0,
      logo: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=200&h=200&fit=crop",
      coverImg: "https://images.unsplash.com/photo-1549317336-206569e8475c?w=800&h=400&fit=crop",
      email: "info@autoworld.com",
      countryCode: "+965",
      mobile: "96543210",
      order: 4,
      paymentPeriod: 45,
      deliveryService: false,
      deliveryCompanyChecked: "no",
      country: "Kuwait",
    },
  ];

  const findAdmin = await USER.findOne({ roleId: CONST.ADMIN });
  const categories = await CATEGORY_MODEL.find({ stateId: CONST.ACTIVE });

  for (let i = 0; i < companyArr.length; i++) {
    const element = companyArr[i];
    // Assign to different categories if available
    const categoryId = categories.length > i ? categories[i]._id : (categories.length > 0 ? categories[0]._id : null);
    
    const payload = {
      company: element.company,
      actualCompanyName: element.actualCompanyName,
      arabicCompany: element.arabicCompany,
      arabicActualCompanyName: element.arabicActualCompanyName,
      description: element.description,
      arabicDescription: element.arabicDescription,
      perCommission: element.perCommission,
      commissionType: element.commissionType,
      couponService: element.couponService,
      deliveryEligible: element.deliveryEligible,
      pickupService: element.pickupService,
      costDelivery: element.costDelivery,
      logo: element.logo,
      coverImg: element.coverImg,
      email: element.email,
      countryCode: element.countryCode,
      mobile: element.mobile,
      order: element.order,
      paymentPeriod: element.paymentPeriod,
      deliveryService: element.deliveryService,
      deliveryCompanyChecked: element.deliveryCompanyChecked,
      country: element.country,
      categoryId: categoryId,
      subcategoryId: categoryId, // Using same as category for now
      deliveryCompany: categoryId, // Using category ID as placeholder
      refNumber: Math.floor(Math.random() * 900000) + 100000,
      createdBy: findAdmin._id,
      stateId: CONST.ACTIVE,
      totalAverageRating: 4.5,
    };

    const isExist = await COMPANY_MODEL.findOne({ company: payload.company });
    if (isExist) {
      logger.info(`Company "${payload.company}" already exists`);
    } else {
      await COMPANY_MODEL(payload).save();
      logger.info(`Company "${payload.company}" created successfully`);
    }
  }
};

// const createSubcategory = async () => {
//     const subCategoryArr = [
//       {
//         category: "Food",
//         arabicCategory: "طعام",
//         categoryImg:
//           "https://cdn.pixabay.com/photo/2022/06/27/05/38/spices-7286739_1280.jpg",
//       },
//       {
//         category: "Health",
//         arabicCategory: "صحة",
//         categoryImg:
//           "https://cdn.pixabay.com/photo/2015/07/30/14/36/hypertension-867855_1280.jpg",
//       },
//       {
//         category: "Grocery",
//         arabicCategory: "خضروات",
//         categoryImg:
//           "https://cdn.pixabay.com/photo/2022/08/01/07/59/vegetables-7357585_1280.png",
//       },
//       {
//         category: "Cars",
//         arabicCategory: "سيارات",
//         categoryImg:
//           "https://cdn.pixabay.com/photo/2022/11/10/20/04/street-7583585_1280.jpg",
//       },
//       {
//         category: "Electric",
//         arabicCategory: "كهربائي",
//         categoryImg:
//           "https://cdn.pixabay.com/photo/2018/07/30/10/13/screws-3572190_1280.jpg",
//       },
//       {
//         category: "Entertainment",
//         arabicCategory: "ترفيه",
//         categoryImg:
//           "https://cdn.pixabay.com/photo/2019/11/02/01/15/headphones-4595492_1280.jpg",
//       },
//       {
//         category: "Cosmetology",
//         arabicCategory: "التجميل",
//         categoryImg:
//           "https://cdn.pixabay.com/photo/2024/10/01/17/45/ai-generated-9089095_1280.png",
//       },
//     ];

//     const findAdmin = await USER.findOne({ roleId: CONST.ADMIN });

//     for (const element of subCategoryArr) {
//       const payload = {
//         category: element.category,
//         arabicCategory: element.arabicCategory,
//         categoryImg: element.categoryImg,
//         createdBy: findAdmin._id,
//       };

//       const isExist = await CATEGORY_MODEL.findOne({
//         category: payload.category,
//       });

//       if (isExist) {
//         logger.info(`Category already created`);
//       } else {
//         await CATEGORY_MODEL(payload).save();
//         logger.info(`Category created successfully`);
//       }
//     }
//   };

// const deleteAllProducts = async () => {
//   try {
//     const deletedCount = await PRODUCT_MODEL.deleteMany({});
//     logger.info(`🗑️ Deleted ${deletedCount.deletedCount} existing products`);
//   } catch (error) {
//     logger.error(`❌ Error deleting products: ${error.message}`);
//   }
// };

const createProduct = async () => {
  const productArr = [
    // 9 Products from Kuwait
    {
      productName: "Samsung Galaxy S24 Ultra",
      productArabicName: "سامسونج جالاكسي إس 24 ألترا",
      description: "Latest flagship smartphone with advanced AI features and exceptional camera quality",
      arabicDescription: "أحدث هاتف ذكي رائد مع ميزات الذكاء الاصطناعي المتقدمة وجودة كاميرا استثنائية",
      productImg: [
        { url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop", type: "image" }
      ],
      price: 350,
      mrpPrice: 400,
      pickupCost: 2,
      discount: 12.5,
      color: ["Black", "Purple", "Yellow"],
      weight: "232g",
      brand: "Samsung",
      madeIn: "Kuwait",
      warranty: "2 years",
      deliveryCost: 3,
      prepareTime: "1-2 days",
      quantity: 50,
      averageRating: 4.8
    },
    {
      productName: "Apple MacBook Pro 16-inch",
      productArabicName: "أبل ماك بوك برو 16 بوصة",
      description: "Professional laptop with M3 Pro chip for creative professionals",
      arabicDescription: "لابتوب احترافي مع معالج M3 Pro للمحترفين المبدعين",
      productImg: [
        { url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop", type: "image" }
      ],
      price: 850,
      mrpPrice: 900,
      pickupCost: 5,
      discount: 5.6,
      color: ["Space Gray", "Silver"],
      weight: "2.1kg",
      brand: "Apple",
      madeIn: "Kuwait",
      warranty: "1 year",
      deliveryCost: 5,
      prepareTime: "2-3 days",
      quantity: 25,
      averageRating: 4.9
    },
    {
      productName: "Nike Air Jordan 1 Retro",
      productArabicName: "نايك اير جوردان 1 ريترو",
      description: "Classic basketball sneakers with premium leather construction",
      arabicDescription: "أحذية كرة السلة الكلاسيكية مع تصميم من الجلد الفاخر",
      productImg: [
        { url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop", type: "image" }
      ],
      price: 120,
      mrpPrice: 150,
      pickupCost: 1,
      discount: 20,
      size: [
        { sizes: "US 8", price: 120, mrp: 150, discount: 20 },
        { sizes: "US 9", price: 120, mrp: 150, discount: 20 },
        { sizes: "US 10", price: 120, mrp: 150, discount: 20 }
      ],
      color: ["Red/Black", "White/Black"],
      brand: "Nike",
      madeIn: "Kuwait",
      warranty: "6 months",
      deliveryCost: 2,
      prepareTime: "1 day",
      quantity: 100,
      averageRating: 4.7
    },
    {
      productName: "L'Oréal Paris Revitalift Cream",
      productArabicName: "كريم لوريال باريس ريفيتاليفت",
      description: "Anti-aging moisturizer with Pro-Retinol and Centella Asiatica",
      arabicDescription: "مرطب مكافح الشيخوخة مع البرو-ريتينول وسنتيلا آسياتيكا",
      productImg: [
        { url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop", type: "image" }
      ],
      price: 25,
      mrpPrice: 30,
      pickupCost: 0.5,
      discount: 16.7,
      color: ["White"],
      weight: "50ml",
      brand: "L'Oréal",
      madeIn: "Kuwait",
      warranty: "N/A",
      deliveryCost: 1,
      prepareTime: "Same day",
      quantity: 200,
      averageRating: 4.3
    },
    {
      productName: "Toyota Camry 2024 Spare Parts Kit",
      productArabicName: "طقم قطع غيار تويوتا كامري 2024",
      description: "Complete maintenance kit including filters, oils, and essential parts",
      arabicDescription: "طقم صيانة كامل يشمل الفلاتر والزيوت والقطع الأساسية",
      productImg: [
        { url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500&h=500&fit=crop", type: "image" }
      ],
      price: 180,
      mrpPrice: 200,
      pickupCost: 3,
      discount: 10,
      weight: "5kg",
      brand: "Toyota",
      model: "Camry 2024",
      modelNumber: "TMK-2024-001",
      madeIn: "Kuwait",
      warranty: "1 year",
      deliveryCost: 4,
      prepareTime: "2-3 days",
      quantity: 30,
      averageRating: 4.6
    },
    {
      productName: "Organic Kuwaiti Dates Premium",
      productArabicName: "تمر كويتي عضوي فاخر",
      description: "Premium quality organic dates harvested from Kuwait's finest farms",
      arabicDescription: "تمر عضوي عالي الجودة محصود من أفضل المزارع الكويتية",
      productImg: [
        { url: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=500&h=500&fit=crop", type: "image" }
      ],
      price: 15,
      mrpPrice: 18,
      pickupCost: 0.5,
      discount: 16.7,
      weight: "500g",
      brand: "Kuwait Farms",
      madeIn: "Kuwait",
      warranty: "N/A",
      deliveryCost: 1,
      prepareTime: "Same day",
      quantity: 500,
      averageRating: 4.9
    },
    {
      productName: "Philips Air Fryer XXL",
      productArabicName: "مقلاة هوائية فيليبس XXL",
      description: "Large capacity air fryer with smart sensing technology for healthy cooking",
      arabicDescription: "مقلاة هوائية كبيرة السعة مع تقنية الاستشعار الذكي للطبخ الصحي",
      productImg: [
        { url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop", type: "image" }
      ],
      price: 95,
      mrpPrice: 110,
      pickupCost: 2,
      discount: 13.6,
      color: ["Black"],
      weight: "7kg",
      power: "1400W",
      brand: "Philips",
      model: "HD9650",
      madeIn: "Kuwait",
      warranty: "2 years",
      deliveryCost: 3,
      prepareTime: "1-2 days",
      quantity: 40,
      averageRating: 4.5
    },
    {
      productName: "Sony PlayStation 5 Slim",
      productArabicName: "سوني بلايستيشن 5 سليم",
      description: "Next-generation gaming console with ultra-high-speed SSD and ray tracing",
      arabicDescription: "وحدة تحكم ألعاب الجيل القادم مع SSD فائق السرعة وتتبع الأشعة",
      productImg: [
        { url: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&h=500&fit=crop", type: "image" }
      ],
      price: 450,
      mrpPrice: 500,
      pickupCost: 5,
      discount: 10,
      color: ["White"],
      weight: "3.2kg",
      power: "220W",
      brand: "Sony",
      model: "CFI-2000",
      madeIn: "Kuwait",
      warranty: "1 year",
      deliveryCost: 5,
      prepareTime: "2-3 days",
      quantity: 20,
      averageRating: 4.8
    },
    {
      productName: "Zara Evening Dress Collection",
      productArabicName: "مجموعة فساتين زارا المسائية",
      description: "Elegant evening dress perfect for special occasions and formal events",
      arabicDescription: "فستان مسائي أنيق مثالي للمناسبات الخاصة والفعاليات الرسمية",
      productImg: [
        { url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=500&fit=crop", type: "image" }
      ],
      price: 80,
      mrpPrice: 100,
      pickupCost: 1,
      discount: 20,
      size: [
        { sizes: "S", price: 80, mrp: 100, discount: 20 },
        { sizes: "M", price: 80, mrp: 100, discount: 20 },
        { sizes: "L", price: 80, mrp: 100, discount: 20 }
      ],
      color: ["Black", "Navy Blue", "Burgundy"],
      material: "Polyester blend",
      brand: "Zara",
      madeIn: "Kuwait",
      warranty: "N/A",
      deliveryCost: 2,
      prepareTime: "1 day",
      quantity: 75,
      averageRating: 4.4
    },
    // 1 Product from another country (UAE)
    {
      productName: "Emirates Gold Jewelry Set",
      productArabicName: "طقم مجوهرات الإمارات الذهبية",
      description: "Exquisite 18k gold jewelry set crafted by skilled artisans in Dubai",
      arabicDescription: "طقم مجوهرات ذهبية عيار 18 مصنوع بمهارة من قبل حرفيين في دبي",
      productImg: [
        { url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop", type: "image" }
      ],
      price: 1200,
      mrpPrice: 1350,
      pickupCost: 10,
      discount: 11.1,
      color: ["Gold"],
      weight: "25g",
      material: "18k Gold",
      brand: "Emirates Gold",
      madeIn: "UAE",
      warranty: "Lifetime",
      deliveryCost: 15,
      prepareTime: "5-7 days",
      quantity: 10,
      averageRating: 4.9
    }
  ];

  const findAdmin = await USER.findOne({ roleId: CONST.ADMIN });
  const categories = await CATEGORY_MODEL.find({ stateId: CONST.ACTIVE });
  const companies = await COMPANY_MODEL.find({ stateId: CONST.ACTIVE });
  const classifications = await CALSSIFICATION.find({ stateId: CONST.ACTIVE });

  for (let i = 0; i < productArr.length; i++) {
    const element = productArr[i];
    
    // Assign different categories, companies, and classifications cyclically
    const categoryId = categories.length > 0 ? categories[i % categories.length]._id : null;
    const companyId = companies.length > 0 ? companies[i % companies.length]._id : null;
    const classificationId = classifications.length > 0 ? classifications[i % classifications.length]._id : null;
    
    const payload = {
      productName: element.productName,
      productArabicName: element.productArabicName,
      description: element.description,
      arabicDescription: element.arabicDescription,
      productImg: element.productImg,
      price: element.price,
      mrpPrice: element.mrpPrice,
      pickupCost: element.pickupCost,
      discount: element.discount,
      size: element.size || [],
      color: element.color,
      weight: element.weight,
      material: element.material || null,
      model: element.model || null,
      modelNumber: element.modelNumber || null,
      productCode: `PRD-${Date.now()}-${i}`,
      serialCode: `SER-${Math.floor(Math.random() * 1000000)}`,
      power: element.power || null,
      madeIn: element.madeIn,
      warranty: element.warranty,
      deliveryCost: element.deliveryCost,
      prepareTime: element.prepareTime,
      brand: element.brand,
      categoryId: categoryId,
      classification: classificationId,
      company: companyId,
      createdBy: findAdmin._id,
      location: {
        type: "Point",
        coordinates: element.madeIn === "Kuwait" ? [47.9774, 29.3759] : [55.2708, 25.2048] // Kuwait or UAE coordinates
      },
      address: element.madeIn === "Kuwait" ? "Kuwait City, Kuwait" : "Dubai, UAE",
      quantity: element.quantity,
      stateId: CONST.ACTIVE,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      termsCondition: "Standard warranty and return policy applies",
      arabicTermsCondition: "تطبق شروط الضمان وسياسة الإرجاع القياسية",
      offerContent: element.discount > 0 ? `${element.discount}% OFF - Limited Time Offer!` : null,
      arabicOfferContent: element.discount > 0 ? `خصم ${element.discount}% - عرض لفترة محدودة!` : null,
      order: i + 1,
      returnPolicy: "30 days return policy",
      arabicReturnPolicy: "سياسة إرجاع لمدة 30 يوماً",
      isDelivered: true,
      averageRating: element.averageRating
    };

    const isExist = await PRODUCT_MODEL.findOne({ productName: payload.productName });
    if (isExist) {
      logger.info(`Product "${payload.productName}" already exists`);
    } else {
      await PRODUCT_MODEL(payload).save();
      logger.info(`Product "${payload.productName}" created successfully`);
    }
  }
};

const seed = async () => {
  //await createAdmin(); // Uncomment when you want to create admin
  //await createUser();
  //await createCategory(); // Uncomment when you want to create categories
  //await createClass(); // Uncomment when you want to create classes
  //await createClassification(); // Uncomment when you want to create classifications
  // await createCompany(); // Uncomment when you want to create companies
  
  // Delete all existing products first, then create new ones
  //await deleteAllProducts();
  await createProduct();
  
  logger.info("🌱 Seeding completed successfully");
};

seed()
  .then(() => {
    logger.info("🌱 Seed process finished.");
    mongoose.connection.close();
  })
  .catch((err) => {
    logger.error("❌ Seeding failed:", err);
    mongoose.connection.close();
  });
