"use strict";
/**
 * Returns response object
 * @param {string} message Response message
 * @param {*} data Data to be returned
 * @param {boolean} success Status of the request
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMessage = void 0;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const response = (message, data, success) => {
    return {
        message: (0, exports.formatMessage)(message),
        data: data || null,
        success: success == null ? true : success,
    };
};
const formatMessage = (str) => {
    if (!str)
        return "";
    // Make first letter capital
    return str.charAt(0).toUpperCase() + str.slice(1);
};
exports.formatMessage = formatMessage;
exports.default = response;
