const { Router } = require("express");
// const cors = require("cors");

const express = require("express");
const { userRegister,login } = require("../controller/authController");

const app = Router();

app.post("/regiter", userRegister);
app.get("/login", login);

module.exports = app;
