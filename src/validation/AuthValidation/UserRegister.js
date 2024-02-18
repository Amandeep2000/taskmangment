const { check } = require("express-validator");
const db = require("../../db/models");

const emailExists = async (value) => {
  const existinguser = await db.User.findOne({
    where: {
      email: value,
    },
  });
  if (existinguser) {
    throw new Error("Email is already in use");
  }
};

const mobileNumberExists = async (value) => {
  const existinguser = await db.User.findOne({
    where: {
      mobileNo: value,
    },
  });
  if (existinguser) {
    throw new Error("Mobile Number is already in use");
  }
};

const passwordRegex = /[!@#$%^&*(),.?":{}|<>]/;
const UserRegisterRules = [
  check("name")
    .notEmpty()
    .withMessage("Name field is required")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

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

  check("mobileNo")
    .notEmpty()
    .withMessage("Mobile number field is required")
    .bail()
    .isLength({ min: 10, max: 10 })
    .withMessage("Mobile number must be 10 characters")
    .bail()
    .matches(/^\d+$/)
    .withMessage("Mobile number must contain only digits")
    .bail()
    .custom(mobileNumberExists),
  check("zipcode")
    .notEmpty()
    .withMessage("Zip code is required")
    .bail()
    .isNumeric()
    .withMessage("Zip code must be numeric")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Zip code must be at least 6 characters"),
];


const taskvalidationRules = [
  check("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Title must be between 2 and 100 characters")
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage("Title can only contain letters, numbers, and spaces"),

  check("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 2, max: 255 })
    .withMessage("Description must be between 2 and 255 characters")
    .matches(/^[a-zA-Z0-9\s.,?!'-]+$/)
    .withMessage(
      "Description can only contain letters, numbers, spaces, and common punctuation"
    ),
  async (req, res, next) => {
    // Check if title or description already exists in the databas
     const { title, description } = req.body;
    try {
      const existingTask = await db.Task.findOne({
        where: {
          [Op.or]: [{ title: title }, { description: description }],
        },
      });

      if (existingTask) {
        return res.status(400).json({
          errors: [
            { msg: "Task with the same title or description already exists" },
          ],
        });
      }
      next();
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ errors: [{ msg: "Internal Server Error" }] });
    }
  },
];

module.exports = UserRegisterRules;
