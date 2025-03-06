"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValid = void 0;
const isValid = (schema) => {
    return (req, res, next) => {
        let data = Object.assign(Object.assign(Object.assign({}, req.body), req.params), req.query);
        let { error } = schema.validate(data, { abortEarly: false });
        if (error) {
            const errMSG = error.details.map((err) => err.message);
            return next(new AppError(errMSG.join(", "), 400));
        }
        next();
    };
};
exports.isValid = isValid;
