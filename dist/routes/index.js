"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const v1_1 = __importDefault(require("./v1"));
const redis_1 = __importDefault(require("../config/database/redis"));
const database_1 = __importDefault(require("../config/database"));
const router = (0, express_1.Router)();
router.use("/v1", v1_1.default);
router.get("/health", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ques = yield database_1.default.$executeRaw `SELECT * FROM User`;
    const redis = yield redis_1.default.ping();
    if (redis && ques) {
        return res.status(200).send("All system online");
    }
    return res.status(400).end();
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json({
        status: true,
        message: "You probably shouldn't be here, but...",
        data: {
            service: "p2vest-api",
            class: "public",
            version: "1.0",
        },
    });
}));
exports.default = router;
