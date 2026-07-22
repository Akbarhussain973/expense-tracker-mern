const router = require("express").Router();
const protect = require("../middleware/protect");
const Expense = require("../models/Expense");
const Category = require("../models/Category");

router.use(protect);

router.get("/", async (req, res) => {
  const expenses = await Expense.find({ user: req.userId }).populate(
    "category",
  );
  res.json(expenses);
});

router.post("/", async (req, res) => {
  try {
    const { category, amount, type, description, date } = req.body;

    const validCategory = await Category.findOne({
      _id: category,
      user: req.userId,
    });
    if (!validCategory) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const expense = await Expense.create({
      user: req.userId,
      category,
      amount,
      type,
      description,
      date,
    });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", async (req, res) => {
  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    req.body,
    { new: true },
  );
  if (!expense) return res.status(404).json({ message: "Expense not found" });
  res.json(expense);
});

router.delete("/:id", async (req, res) => {
  const expense = await Expense.findOneAndDelete({
    _id: req.params.id,
    user: req.userId,
  });
  if (!expense) return res.status(404).json({ message: "Expense not found" });
  res.json({ message: "Deleted" });
});

module.exports = router;
