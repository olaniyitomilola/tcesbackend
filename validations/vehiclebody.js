const { body } = require('express-validator');

// Validation rules for a Vehicle POST
const vehicleValidationRules = [
    body('name').notEmpty().withMessage('Name is required'),
    body('fuelType').isIn(['Petrol', 'Diesel', 'Electric', 'Hybrid']).withMessage('Invalid fuel type'),
    body('registration').notEmpty().withMessage('Registration is required'),
    body('motTest').isBoolean().withMessage('motTest must be true or false'),
    body('tax').notEmpty().withMessage('Tax info is required'),
    body('taxExpiry').isISO8601().withMessage('taxExpiry must be a valid date'),
    body('motExpiry').isISO8601().withMessage('motExpiry must be a valid date'),
    body('recall').isBoolean().withMessage('recall must be true or false')
];

module.exports = {vehicleValidationRules}