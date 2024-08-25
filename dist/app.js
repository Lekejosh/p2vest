"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
require("./config/database/redis");
exports.app = (0, express_1.default)();
exports.app.use((0, express_session_1.default)({
    secret: "348d1911e5741ff7d5a20bb384d1adb2c0fb255ecf4263ba25435f17d47e4e18",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 + 60 * 60 * 24 * 7,
    },
}));
exports.app.use((0, cookie_parser_1.default)());
const pre_route_middleware_1 = __importDefault(require("./middlewares/pre-route.middleware"));
(0, pre_route_middleware_1.default)(exports.app);
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
exports.app.use(routes_1.default);
(0, error_middleware_1.default)(exports.app);
