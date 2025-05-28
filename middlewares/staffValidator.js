const  { body, validationResult } = require('express-validator');

const staffValidation = [
  body('first_name')
    .notEmpty().withMessage('First name is required')
    .trim().escape(), // sanitize by trimming whitespace and escaping HTML

  body('last_name')
    .notEmpty().withMessage('Last name is required')
    .trim().escape(), // sanitize by trimming whitespace and escaping HTML

  body('role')
    .notEmpty().withMessage('Role is required')
    .trim().escape(),

  body('email')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(), // normalize the email to a consistent format

  body('phone')
    .notEmpty().withMessage('Phone is required')
    .trim().escape(), // sanitize by trimming whitespace and escaping HTML

  body('nin')
    .notEmpty().withMessage('NIN is required')
    .trim().escape(), // sanitize by trimming whitespace and escaping HTML

  body('address')
    .notEmpty().withMessage('Address is required')
    .trim().escape(), // sanitize by trimming whitespace and escaping HTML

  body('is_driver')
    .isBoolean().withMessage('is_driver must be a boolean'),

  body('license_number')
    .optional({ nullable: true })
    .trim().escape(), // sanitize

  body('has_pts')
    .isBoolean().withMessage('has_pts must be a boolean'),

  body('pts_number')
    .optional({ nullable: true })
    .trim().escape(), // sanitize

  body('ticket_coss').isBoolean(),
  body('ticket_es').isBoolean(),
  body('ticket_mc').isBoolean(),

  body('available_monday').isBoolean(),
  body('available_tuesday').isBoolean(),
  body('available_wednesday').isBoolean(),
  body('available_thursday').isBoolean(),
  body('available_friday').isBoolean(),
  body('available_saturday').isBoolean(),
  body('available_sunday').isBoolean(),

  body('jobtype_civils').isBoolean(),
  body('jobtype_surveying').isBoolean(),
  body('jobtype_hbe').isBoolean(),
  body('jobtype_management').isBoolean(),

  body('employment_type')
    .isIn(['full-time', 'part-time', 'contractor'])
    .withMessage('employment_type must be one of: full-time, part-time, contractor'),

  body('is_activated')
    .optional()
    .isBoolean()
];

  (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {staffValidation}