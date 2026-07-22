const router = require("express").Router();
const protect = require("../middleware/protect");
const Category = require("../models/Category");

router.use(protect);

router.get("/", async (req, res) => {
  const categories = await Category.find({ user: req.userId });
  res.json(categories);
});

router.post("/", async (req, res) => {
  try {
    const category = await Category.create({
      name: req.body.name,
      user: req.userId,
    });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const category = await Category.findOneAndDelete({
    _id: req.params.id,
    user: req.userId,
  });
  if (!category) return res.status(404).json({ message: "Category not found" });
  res.json({ message: "Deleted" });
});

module.exports = router;
