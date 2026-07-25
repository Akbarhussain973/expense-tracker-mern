const Category = require("../models/Category");
const Transaction = require("../models/Transaction");

exports.getCategories = async (req, res) => {
  const categories = await Category.find({ user: req.userId });
  res.json(categories);
};

exports.createCategory = async (req, res) => {
  const category = await Category.create({
    name: req.body.name,
    user: req.userId,
  });

  res.status(201).json(category);
};

exports.updateCategory = async (req, res) => {
  const category = await Category.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.userId,
    },
    {
      name: req.body.name,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!category) {
    return res.status(404).json({
      message: "Category not found",
    });
  }

  res.json(category);
};

exports.deleteCategory = async (req, res) => {
  const transactionsUsingCategory = await Transaction.countDocuments({
    category: req.params.id,
  });

  if (transactionsUsingCategory > 0) {
    return res.status(400).json({
      message:
        "This category is being used by existing transactions. Delete or move those transactions first.",
    });
  }
  const category = await Category.findOneAndDelete({
    _id: req.params.id,
    user: req.userId,
  });

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  res.json({ message: "Deleted" });
};
