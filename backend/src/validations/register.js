const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

const validateRegisterInput = [
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Email already exists'),
  check('username')
    .exists({ checkFalsy: true })
    .withMessage('Username already exists'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be longer than 6 characters'),
  handleValidationErrors
];

module.exports = validateRegisterInput;