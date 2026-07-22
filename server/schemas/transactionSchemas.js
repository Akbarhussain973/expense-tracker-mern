const Joi = require("joi");

const transactionSchema = Joi.object({
  category: Joi.string().required(),
  amount: Joi.number().positive().required(),
  type: Joi.string().valid("expense", "income").required(),
  description: Joi.string().allow("").optional(),
  date: Joi.date().optional(),
});

module.exports = { transactionSchema };
