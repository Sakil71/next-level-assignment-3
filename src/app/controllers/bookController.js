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
exports.deleteBook = exports.updateBook = exports.getBookById = exports.createBook = exports.getAllBooks = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const book_interface_1 = require("../interfaces/book.interface");
const book_model_1 = require("../models/book.model");
const errorValidation_1 = require("../error/errorValidation");
// Get all book
const getAllBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sortBy = "createdAt", sort = "desc", limit = "10", } = req.query;
        const query = {};
        if (filter) {
            const genreFilter = filter.toUpperCase();
            if (!Object.values(book_interface_1.Genre).includes(genreFilter)) {
                res.status(400).json({
                    success: false,
                    message: "Invalid genre filter",
                    error: {
                        validGenres: Object.values(book_interface_1.Genre),
                    },
                });
            }
            query.genre = genreFilter;
        }
        const limitNumber = parseInt(limit);
        if (isNaN(limitNumber) || limitNumber < 1) {
            res.status(400).json({
                success: false,
                message: "Copies must be a positive number",
                error: {
                    received: limit,
                    expected: "Positive integer",
                },
            });
        }
        const books = yield book_model_1.Book.find(query)
            .sort({ [sortBy]: sort === "asc" ? 1 : -1 })
            .limit(limitNumber);
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: books,
        });
    }
    catch (error) {
        if (error.name === "ValidationError") {
            res.status(400).json((0, errorValidation_1.handleValidationError)(error));
        }
        else {
            res.status(500).json({
                success: false,
                message: "Failed to retrieve books",
                error: error.message,
            });
        }
    }
});
exports.getAllBooks = getAllBooks;
// Create book
const createBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookData = req.body;
        const book = yield book_model_1.Book.create(bookData);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book,
        });
    }
    catch (error) {
        if (error.name === "ValidationError") {
            res.status(400).json((0, errorValidation_1.handleValidationError)(error));
        }
        else {
            res.status(400).json({
                message: "Failed to create book",
                success: false,
                error: error.message,
            });
        }
    }
});
exports.createBook = createBook;
const getBookById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(bookId)) {
            res.status(400).json({
                message: "Invalid book ID",
                success: false,
            });
        }
        const book = yield book_model_1.Book.findById(bookId);
        if (!book) {
            res.status(404).json({
                message: "Book not found",
                success: false,
            });
        }
        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data: book,
        });
    }
    catch (error) {
        if (error.name === "ValidationError") {
            res.status(400).json((0, errorValidation_1.handleValidationError)(error));
        }
        else {
            res.status(500).json({
                message: "Failed to retrieve book",
                success: false,
                error: error.message,
            });
        }
    }
});
exports.getBookById = getBookById;
// update a book
const updateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = req.params;
        const updateData = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(bookId)) {
            res.status(400).json({
                message: "Invalid book ID",
                success: false,
            });
        }
        const book = yield book_model_1.Book.findByIdAndUpdate(bookId, updateData, {
            new: true,
            runValidators: true,
        });
        if (!book) {
            res.status(404).json({
                message: "Book not found",
                success: false,
            });
        }
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: book,
        });
    }
    catch (error) {
        if (error.name === "ValidationError") {
            res.status(400).json((0, errorValidation_1.handleValidationError)(error));
        }
        else {
            res.status(400).json({
                message: "Failed to update book",
                success: false,
                error: error.message,
            });
        }
    }
});
exports.updateBook = updateBook;
// Delete a book
const deleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(bookId)) {
            res.status(400).json({
                message: "Invalid book ID",
                success: false,
            });
        }
        const book = yield book_model_1.Book.findByIdAndDelete(bookId);
        if (!book) {
            res.status(404).json({
                message: "Book not found",
                success: false,
            });
        }
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null,
        });
    }
    catch (error) {
        if (error.name === "ValidationError") {
            res.status(400).json((0, errorValidation_1.handleValidationError)(error));
        }
        else {
            res.status(500).json({
                message: "Failed to delete book",
                success: false,
                error: error.message,
            });
        }
    }
});
exports.deleteBook = deleteBook;
