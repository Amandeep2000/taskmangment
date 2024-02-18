const { check, validationResult } = require("express-validator");
const { Op } = require("sequelize");
const db = require("../../db/models");

const userValidationRules = [
  check("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .bail()
    .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),

  check("password")
  .notEmpty().withMessage("Password is required")
  .bail()
  .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
  .bail()
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
  .withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),


  check("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .bail()
    .isEmail().withMessage("Invalid email format")
    .bail()
    .custom(async (value) => {
      const existingUser = await db.User.findOne({
        where: {
          email: value,
        },
      });
      if (existingUser) {
        throw new Error("Email is already in use");
      }
      return true;
    }),

  check("mobileNo")
    .trim()
    .notEmpty().withMessage("Mobile number is required")
    .bail()
    .isMobilePhone().withMessage("Invalid mobile number format")
    .custom(async (value) => {
      const existingUser = await db.User.findOne({
        where: {
          mobileNo: value,
        },
      });
      if (existingUser) {
        throw new Error("Mobile number is already in use");
      }
      return true;
    }),

  check("zipcode")
    .trim()
    .notEmpty().withMessage("Zip code is required")
    .bail()
    .isNumeric().withMessage("Zip code must be numeric")
    .bail()
    .isLength({ min: 5 }).withMessage("Zip code must be between 5 and 10 characters"),
];



module.exports = {
  userValidationRules
};
