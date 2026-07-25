const Budget = require("../models/Budget");

exports.getBudget = async (req, res) => {
  try {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const budget = await Budget.findOne({
      user: req.userId,
      month,
      year,
    });

    res.json(budget || {});
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.saveBudget = async (req, res) => {
  try {
    const { amount } = req.body;

    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const budget = await Budget.findOneAndUpdate(
      {
        user: req.userId,
        month,
        year,
      },
      {
        amount,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    res.json(budget);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
