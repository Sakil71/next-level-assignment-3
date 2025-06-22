"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookRoutes_1 = __importDefault(require("./app/routes/bookRoutes"));
const borrowRoutes_1 = __importDefault(require("./app/routes/borrowRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/books", bookRoutes_1.default);
app.use("/api/borrow", borrowRoutes_1.default);
app.get("/", (req, res) => {
    res.send("Welcome to Libraey management server");
});
exports.default = app;
