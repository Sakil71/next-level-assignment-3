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
exports.getBorrowedBooksSummary = exports.borrowBook = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const book_model_1 = require("../models/book.model");
const borrow_model_1 = require("../models/borrow.model");
const errorValidation_1 = require("../error/errorValidation");
// Borrow Book
const borrowBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { book, quantity, dueDate } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(book)) {
            res.status(400).json({
                message: "Invalid book ID",
                success: false,
            });
        }
        const bookToBorrow = yield book_model_1.Book.findById(book);
        if (!bookToBorrow) {
            res.status(404).json({
                message: "Book not found",
                success: false,
            });
            return;
        }
        if (bookToBorrow.copies < quantity) {
            res.status(400).json({
                message: "Not enough copies available",
                success: false,
                availableCopies: bookToBorrow.copies,
            });
        }
        const borrow = yield borrow_model_1.Borrow.create({
            book,
            quantity,
            dueDate: new Date(dueDate),
        });
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: borrow,
        });
    }
    catch (error) {
        if (error.name === "ValidationError") {
            res.status(400).json((0, errorValidation_1.handleValidationError)(error));
        }
        else {
            res.status(400).json({
                message: "Failed to borrowed book",
                success: false,
                error,
            });
        }
    }
});
exports.borrowBook = borrowBook;
// Borrowed books summary
const getBorrowedBooksSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summary = yield borrow_model_1.Borrow.aggregate([
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" },
                },
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "book",
                },
            },
            {
                $unwind: "$book",
            },
            {
                $project: {
                    _id: 0,
                    "book.title": 1,
                    "book.isbn": 1,
                    totalQuantity: 1,
                },
            },
        ]);
        res.status(200).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            summary,
        });
    }
    catch (error) {
        if (error.name === "ValidationError") {
            res.status(400).json((0, errorValidation_1.handleValidationError)(error));
        }
        else {
            res.status(500).json({
                message: "Failed to retrieve borrowed books summary",
                success: false,
                error: error.message,
            });
        }
    }
});
exports.getBorrowedBooksSummary = getBorrowedBooksSummary;
