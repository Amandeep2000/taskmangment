// const db = require("../db/models");
const db = require("../db/models");
const { validationResult } = require("express-validator");
const UserRegisterRules = require("../validation/AuthValidation/UserRegister");
const loginvalidationRules = require("../validation/AuthValidation/loginvalidation");
const jwt = require("jsonwebtoken");

const userRegister = async (req, res) => {
  try {
    const { name, password, email, mobileNo, zipcode } = req.body;

    await Promise.all(
      UserRegisterRules.map((validation) => validation.run(req))
    );

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const data = await db.User.create({
      name,
      password,
      email,
      mobileNo,
      zipcode,
    });

    return res
      .status(201)
      .json({ message: "User registered successfully", data: data });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    await Promise.all(
      loginvalidationRules.map((validation) => validation.run(req))
    );

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const data = await db.User.findOne({
      where: { email, password },
    });

    const token = jwt.sign({ user_id: data.id }, process.env.TOKENKEY);

    const user_data = {
      Acesstoken: token,
      userinfo: data,
    };

    return res
      .status(201)
      .json({ message: "User Login successfully", data: user_data });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

module.exports = { userRegister, login };
