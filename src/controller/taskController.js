const db = require("../db/models");
const { Op } = require("sequelize");
const { validationResult } = require("express-validator");

const {
  taskValidationRules,
  customValidation,
} = require("../validation/taskvalidation/taskcreatevalidaton");

const {
  updateTaskValidation,
  customUpdateValidation,
} = require("../validation/taskvalidation/updateTaskValidation");

const createtask = async (req, res) => {
  try {
    const { title, description, du_date } = req.body;

    // Run validation middleware
    await Promise.all(
      taskValidationRules.map((validation) => validation.run(req))
    );

    // Run custom validation
    await customValidation(req, res);

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = await db.Task.create({ title, description, du_date });

    return res
      .status(200)
      .json({ success: true, message: "Task created successfully", task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const listTasks = async (req, res) => {
  try {
    const { title } = req.query;

    // // Build the filter object based on the provided query parameters
    // const filter = {};
    // if (title) {
    //   filter.title = {
    //     [Op.iLike]: `%${title}%`, // Case-insensitive search for title
    //   };
    // }

    // // Use Sequelize findAll with the filter
    // const task = await db.Task.findAll({
    //   where: filter,
    // });

    // Build the filter object based on the provided query parameters

    const task = await db.Task.findOne({
      where: {
        title: {
          [Op.iLike]: `%${title}%`,
        },
      },
    });

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const getTaskid = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await db.Task.findByPk(taskId);

    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    // Your code logic here...
    const id = req.params.id;
    const { title, description, du_date } = req.body;

    await Promise.all(
      updateTaskValidation.map((validation) => validation.run(req))
    );

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Find the task by ID
    const task = await db.Task.findByPk(id);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // Update task details
    task.title = title;
    task.description = description;
    task.du_date = du_date;

    // Save the updated task
    await task.save();

    // Return success response with updated task
    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    // Return error response
    return res.status(500).json({ success: false, error: error.message });
  }
};

const deletedTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await db.Task.findByPk(taskId);
    if (task) {
      await task.destroy();
      res.json({ message: "Task deleted successfully" });
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createtask, listTasks, updateTask, getTaskid, deletedTask };
