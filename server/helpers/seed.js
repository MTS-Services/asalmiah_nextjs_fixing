const { USER } = require("../app/userService/model/userModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { CONST } = require("./constant");
const logger = require("winston");
const dotenv = require("dotenv");
const { CATEGORY_MODEL } = require("../app/category/model/category.model");

dotenv.config();

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// const createAdmin = async () => {
//   const payload = {
//     name: "Admin",
//     email: process.env.ADMIN_EMAIL,
//     password: await bcrypt.hash(
//       process.env.ADMIN_EMAIL_PWD,
//       parseInt(process.env.SALT_ROUNDS)
//     ),
//     roleId: CONST.ADMIN,
//     stateId: CONST.ACTIVE,
//     isVerified: true,
//   };

//   const isEXists = await USER.findOne({ email: payload.email });
//   if (isEXists) {
//     logger.info(`Admin already created`);
//   } else {
//     const createAdmin = await USER.create(payload);
//     logger.info(createAdmin ? "Admin created successfully" : "Admin not created");
//   }
// };

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

// const createCategory = async () => {
//   const categoryArr = [
//     { category: "Coupon", arabicCategory: "قسيمة" },
//     { category: "Health", arabicCategory: "صحة" },
//     { category: "Grocery", arabicCategory: "خضروات" },
//     { category: "Cars", arabicCategory: "سيارات" },
//     { category: "Electric", arabicCategory: "كهربائي" },
//     { category: "Entertainment", arabicCategory: "ترفيه" },
//     { category: "Cosmetology", arabicCategory: "التجميل" },
//   ];

//   const findAdmin = await USER.findOne({ roleId: CONST.ADMIN });

//   for (const element of categoryArr) {
//     const payload = {
//       category: element.category,
//       arabicCategory: element.arabicCategory,
//       createdBy: findAdmin._id,
//     };

//     const isExist = await CATEGORY_MODEL.findOne({ category: payload.category });
//     if (isExist) {
//       logger.info(`Category already created`);
//     } else {
//       await CATEGORY_MODEL(payload).save();
//       logger.info(`Category "${payload.category}" created`);
//     }
//   }
// };


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

const seed = async () => {
  // await createAdmin(); // Uncomment when you want to create admin
  await createUser();
  // await createCategory(); // Uncomment when you want to create categories
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
