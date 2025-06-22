"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationError = void 0;
const handleValidationError = (error) => {
    const formattedErrors = Object.values(error.errors).reduce((acc, err) => {
        acc[err.path] = {
            message: err.message,
            name: err.name,
            properties: err.properties,
            kind: err.kind,
            path: err.path,
            value: err.value,
        };
        return acc;
    }, {});
    return {
        message: "Validation failed",
        success: false,
        error: {
            name: error.name,
            errors: formattedErrors,
        },
    };
};
exports.handleValidationError = handleValidationError;
