"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookController_1 = require("../controllers/bookController");
const bookRoutes = express_1.default.Router();
bookRoutes.post("/", bookController_1.createBook);
bookRoutes.get("/", bookController_1.getAllBooks);
bookRoutes.get("/:bookId", bookController_1.getBookById);
bookRoutes.put("/:bookId", bookController_1.updateBook);
bookRoutes.delete("/:bookId", bookController_1.deleteBook);
exports.default = bookRoutes;
