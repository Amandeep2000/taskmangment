const {Router}  = require("express");
const {createtask,listTasks,updateTask, getTaskid, deletedTask}= require("../controller/taskController");

const app = Router();

app.post("/task/create",createtask);
app.get("/task/list",listTasks);
app.get("/task/get/:id",getTaskid);
app.put("/task/update/:id",updateTask);
app.delete("/task/delete/:id",deletedTask);
module.exports = app;



