import express from "express";

import {
  createExpense,
  fetchExpense,
  prefillExpense,
  updateExpense,
  upload,
  viewExpense
} from "../controllers/expense.controller.js";

const expenseRouter = express.Router();
expenseRouter.post("/create", upload.single("ExpenseImage"), createExpense);
expenseRouter.put("/update", upload.single("ExpenseImage"), updateExpense);
expenseRouter.get("/fetchExpenses/:group_id", fetchExpense);
expenseRouter.get("/viewExpenses/:group_id", viewExpense);
expenseRouter.get("/prefillExpenses/:expense_id", prefillExpense);

export default expenseRouter;
