const { check } = require("express-validator");
const { Op } = require("sequelize");
const db = require("../../db/models");

const taskValidationRules = [
  check("title")
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

const customValidation = async (req, res) => {
  // Check if title or description already exists in the database
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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
  }
};

module.exports =
{
  taskValidationRules,
  customValidation,
};
