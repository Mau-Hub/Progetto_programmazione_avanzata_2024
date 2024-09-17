"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidISODate = void 0;
const isValidISODate = (dateStr) => {
    // Controlla se la stringa corrisponde al formato ISO 8601
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
    return isoDateRegex.test(dateStr) && !isNaN(Date.parse(dateStr));
};
exports.isValidISODate = isValidISODate;
