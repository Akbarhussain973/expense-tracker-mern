const router = require("express").Router();
const protect = require("../middleware/protect");
const asyncWrapper = require("../middleware/asyncWrapper");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

router.use(protect);

router.get("/", asyncWrapper(getCategories));

router.post("/", asyncWrapper(createCategory));

router.put("/:id", asyncWrapper(updateCategory));

router.delete("/:id", asyncWrapper(deleteCategory));

module.exports = router;
