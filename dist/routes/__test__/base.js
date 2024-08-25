"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNigerianPhoneNumber = generateNigerianPhoneNumber;
const faker_1 = require("@faker-js/faker");
function generateNigerianPhoneNumber() {
    const prefixes = ["70", "80", "81", "90", "91"];
    const prefix = faker_1.faker.helpers.arrayElement(prefixes);
    const number = faker_1.faker.string.numeric(8);
    return `+234${prefix}${number}`;
}
