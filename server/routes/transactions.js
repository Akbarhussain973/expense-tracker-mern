const router = require("express").Router();
const protect = require("../middleware/protect");
const asyncWrapper = require("../middleware/asyncWrapper");
const validate = require("../middleware/validate");
const { transactionSchema } = require("../schemas/transactionSchemas");
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

router.use(protect);

router.get("/", asyncWrapper(getTransactions));

router.post(
  "/",
  validate(transactionSchema),
  asyncWrapper(createTransaction),
);

router.put(
  "/:id",
  validate(transactionSchema),
  asyncWrapper(updateTransaction),
);

router.delete("/:id", asyncWrapper(deleteTransaction));

module.exports = router;
