const db = require("../db/models");
const { userValidationRules } = require("../validation/userValidation/user");
const { Op } = require("sequelize");
const { validationResult } = require("express-validator");

const userCreate = async (req, res) => {
  try {
    const { name, password, email, mobileNo, zipcode, role } = req.body;

    await Promise.all(
      userValidationRules.map((validation) => validation.run(req))
    );

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await db.User.create({
      name,
      password,
      email,
      mobileNo,
      zipcode,
      role,
    });
    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const userlist = async (req, res) => {
  try {
    // Extract query parameters from the request
    const { name, email } = req.query;

    // Construct a filter object based on the provided query parameters
    const filter = {};

    if (name) {
      // Use Sequelize's ILIKE operator for case-insensitive partial matching
      filter.name = { [Op.iLike]: `%${name}%` };
    }

    if (email) {
      // Use Sequelize's ILIKE operator for case-insensitive partial matching
      filter.email = { [Op.iLike]: `%${email}%` };
    }

    // Use the filter object in the findAll query
    const users = await db.User.findAll({ where: filter });

    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserid = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await db.User.findByPk(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updataUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, password, email, mobileNo, zipcode } = req.body;

    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.password = password;
    user.email = email;
    user.mobileNo = mobileNo;
    user.zipcode = zipcode;
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await db.User.findByPk(userId);

    if (user) {
      await user.destroy();
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserprofile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await db.User.findByPk(userId);

    if (user) {
      res.json({
        name: user.name,
        email: user.email,
        mobileNo: user.mobileNo,
        zipcode: user.zipcode,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  userCreate,
  userlist,
  getUserid,
  updataUser,
  deleteUser,
  getUserprofile,
};
