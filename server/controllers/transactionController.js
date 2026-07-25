const Transaction = require("../models/Transaction");
const Category = require("../models/Category");

exports.getTransactions = async (req, res) => {
  const transactions = await Transaction.find({
    user: req.userId,
  }).populate("category");

  res.json(transactions);
};

exports.createTransaction = async (req, res) => {
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
};

exports.updateTransaction = async (req, res) => {
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
};

exports.deleteTransaction = async (req, res) => {
  const transaction = await Transaction.findOneAndDelete({
    _id: req.params.id,
    user: req.userId,
  });

  if (!transaction) {
    return res.status(404).json({ message: "Transaction not found" });
  }

  res.json({ message: "Deleted" });
};
