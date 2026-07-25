const router = require("express").Router();
const protect = require("../middleware/protect");
const asyncWrapper = require("../middleware/asyncWrapper");
const { getStats } = require("../controllers/dashboardController");

router.use(protect);

router.get("/stats", asyncWrapper(getStats));

module.exports = router;
