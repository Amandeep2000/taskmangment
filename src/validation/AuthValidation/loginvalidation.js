const { check } = require("express-validator");

const db = require("../../db/models");

const emailExists = async (value) => {
  const existinguser = await db.User.findOne({
    where: {
      email: value,
    },
  });
  if (!existinguser) {
    throw new Error("Email is  not  in exsites");
  }
};

const passwordRegex = /[!@#$%^&*(),.?":{}|<>]/;
const loginvalidetionRules = [
  check("email")
    .notEmpty()
    .withMessage("Email field is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email address")
    .bail()
    .custom(emailExists),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .bail()
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .bail()
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .bail()
    .matches(/\d/)
    .withMessage("Password must contain at least one digit")
    .bail()
    .matches(passwordRegex)
    .withMessage("Password must contain at least one special character"),
];

module.exports = loginvalidetionRules;
