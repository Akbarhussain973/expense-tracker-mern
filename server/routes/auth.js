const router = require("express").Router();
const validate = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../schemas/authSchemas");
const rateLimit = require("express-rate-limit");
const asyncWrapper = require("../middleware/asyncWrapper");
const { register, login, logout } = require("../controllers/authController");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message: "Too many authentication attempts. Please try again later.",
  },
});

router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  asyncWrapper(register),
);

router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  asyncWrapper(login),
);

router.post("/logout", logout);

module.exports = router;
