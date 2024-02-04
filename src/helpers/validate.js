const validator = require("validator");

const validate = (params) => {
    let name = !validator.isEmpty(params.name) &&
        validator.isLength(params.name, { min: 3, max: undefined }) &&
        validator.isAlpha(params.name);
    let lastname = !validator.isEmpty(params.lastname) &&
        validator.isLength(params.lastname, { min: 3, max: undefined }) &&
        validator.isAlpha(params.lastname);
    let username = !validator.isEmpty(params.username) &&
        validator.isLength(params.username, { min: 2, max: undefined });
    let email = !validator.isEmpty(params.email) &&
        validator.isEmail(params.email);
    let password = !validator.isEmpty(params.password);
    let bio = validator.isLength(params.bio, { min: undefined, max: 255 });

    if (!name || !lastname || !username || !email || !password || !bio) {
        throw new Error("Validation failed");
    }
}

module.exports = validate
