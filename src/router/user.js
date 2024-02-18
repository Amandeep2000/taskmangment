const { Router } = require("express");
const {
  userCreate,
  userlist,
  getUserid,
  updataUser,
  deleteUser,
  getUserprofile,
} = require("../controller/userController");

const app = Router();

app.post("/user/create/profile",userCreate);
app.get("/user/list",userlist);
app.get("/task/get/:id", getUserid);
app.put("/task/update/:id", deleteUser);
app.delete("/task/delete/:id", deleteUser);
module.exports = app;
