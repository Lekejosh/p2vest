"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const trimObjectStrings = (obj) => {
    if (typeof obj === "string") {
        return obj.trim();
    }
    else if (typeof obj === "object") {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                obj[key] = trimObjectStrings(obj[key]);
            }
        }
        return obj;
    }
    else {
        return obj;
    }
};
exports.default = trimObjectStrings;
