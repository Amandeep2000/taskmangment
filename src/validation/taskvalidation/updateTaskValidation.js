const { check } = require("express-validator");
const { Op } = require("sequelize");
const db = require("../../db/models");

const updateTaskValidation = [
  check("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage("Title must be between 2 and 100 characters")
    .bail()
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage("Title can only contain letters, numbers, and spaces"),

  check("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .bail()
    .isLength({ min: 2, max: 255 })
    .withMessage("Description must be between 2 and 255 characters")
    .bail()
    .matches(/^[a-zA-Z0-9\s.,?!'-]+$/)
    .withMessage(
      "Description can only contain letters, numbers, spaces, and common punctuation"
    ),
];



module.exports = {
  updateTaskValidation,
  // customUpdateValidation,
};
