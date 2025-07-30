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

const seed = async () => {
  await createAdmin();
  await createCategory();
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
