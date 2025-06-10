"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
function validate(schema) {
    return async (req, res, next) => {
        try {
            await schema.parseAsync(req.body);
            next();
        }
        catch (error) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: error.errors
            });
        }
    };
}
//# sourceMappingURL=validate.js.map