const express = require("express");
require("dotenv").config();
require("./alias");
const port = 3000;
const serverurl = `http://localhost:${port}`;
const app = express();
const authroute = require("./src/router/route");
const taskroute = require("./src/router/task");
const userroute=require("./src/router/user")
app.use(express.json());
app.use(authroute);
app.use(taskroute);
app.use(userroute)
app.listen(port, () => {
  console.log(`server is running at ${serverurl}`);
});
