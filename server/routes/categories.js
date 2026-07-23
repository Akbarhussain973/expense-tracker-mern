const router = require("express").Router();
const protect = require("../middleware/protect");
const asyncWrapper = require("../middleware/asyncWrapper");
const Category = require("../models/Category");

router.use(protect);

router.get(
  "/",
  asyncWrapper(async (req, res) => {
    const categories = await Category.find({ user: req.userId });
    res.json(categories);
  }),
);

router.post(
  "/",
  asyncWrapper(async (req, res) => {
    const category = await Category.create({
      name: req.body.name,
      user: req.userId,
    });

    res.status(201).json(category);
  }),
);

router.put(
  "/:id",
  asyncWrapper(async (req, res) => {
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
  }),
);

router.delete(
  "/:id",
  asyncWrapper(async (req, res) => {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Deleted" });
  }),
);

module.exports = router;
