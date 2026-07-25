const express = require("express");
const router = express.Router();

const { getBudget, saveBudget } = require("../controllers/budgetController");

const protect = require("../middleware/protect");

router.get("/", protect, getBudget);

router.post("/", protect, saveBudget);

module.exports = router;
