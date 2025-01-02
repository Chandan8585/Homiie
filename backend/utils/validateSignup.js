const validator = require('validator');

const validateSignup = (req) => {
    const { firstName, lastName, email, password } = req.body;

    // Validate first name and last name
    if (!firstName || !lastName) {
        throw new Error("Enter a valid name");
    }

    // Validate email
    if (!validator.isEmail(email)) {
        throw new Error("Enter a valid email");
    }

};

module.exports = validateSignup;
