const { body, validationResult } = require('express-validator');

const validateVehicle = [
    body('name')
        .notEmpty().withMessage('Name is required'),

    body('fuelType')
        .trim()
        .toLowerCase()  
        .isIn(['petrol', 'diesel', 'electric', 'hybrid'])
        .withMessage('Invalid fuel type'),

    body('registration')
        .notEmpty().withMessage('Registration is required'),

    body('motTest')
        .notEmpty().withMessage('motTest is required'),

    body('tax')
        .notEmpty().withMessage('Tax info is required'),

    body('taxExpiry')
        .isISO8601().withMessage('taxExpiry must be a valid date'),

    body('motExpiry')
        .isISO8601().withMessage('motExpiry must be a valid date'),

    body('recall')
        .notEmpty().withMessage('recall is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors)
            console.log(body)
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {validateVehicle};
