"use strict";
class AppError extends Error {
    constructor(message, statusCode) {
        const formattedMessage = Array.isArray(message) ? message.join(", ") : message;
        super(formattedMessage);
        this.statusCode = statusCode;
    }
}
