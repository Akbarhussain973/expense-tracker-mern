const router = require("express").Router();
const mongoose = require("mongoose");
const protect = require("../middleware/protect");
const asyncWrapper = require("../middleware/asyncWrapper");
const Transaction = require("../models/Transaction");

router.use(protect);

router.get(
  "/stats",
  asyncWrapper(async (req, res) => {
    const stats = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.userId),
        },
      },
      {
        $group: {
          _id: "$type",
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    let income = 0;
    let expense = 0;

    for (const stat of stats) {
      if (stat._id === "income") {
        income = stat.total;
      } else if (stat._id === "expense") {
        expense = stat.total;
      }
    }

    const balance = income - expense;

    res.json({
      income,
      expense,
      balance,
    });
  }),
);

module.exports = router;
