const router = require("express").Router();
const protect = require("../middleware/protect");
const asyncWrapper = require("../middleware/asyncWrapper");
const Transaction = require("../models/Transaction");
const Category = require("../models/Category");
const validate = require("../middleware/validate");
const { transactionSchema } = require("../schemas/transactionSchemas");

router.use(protect);

router.get(
  "/",
  asyncWrapper(async (req, res) => {
    const transactions = await Transaction.find({
      user: req.userId,
    }).populate("category");

    res.json(transactions);
  }),
);

router.post(
  "/",
  validate(transactionSchema),
  asyncWrapper(async (req, res) => {
    const { category, amount, type, description, date } = req.body;

    const validCategory = await Category.findOne({
      _id: category,
      user: req.userId,
    });

    if (!validCategory) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const transaction = await Transaction.create({
      user: req.userId,
      category,
      amount,
      type,
      description,
      date,
    });

    res.status(201).json(transaction);
  }),
);

router.put(
  "/:id",
  validate(transactionSchema),
  asyncWrapper(async (req, res) => {
    const transaction = await Transaction.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId,
      },
      req.body,
      {
        new: true,
      },
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(transaction);
  }),
);

router.delete(
  "/:id",
  asyncWrapper(async (req, res) => {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Deleted" });
  }),
);

module.exports = router;
