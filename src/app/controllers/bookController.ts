import { Request, Response } from "express";
import mongoose from "mongoose";
import { Genre, IBook } from "../interfaces/book.interface";
import { Book } from "../models/book.model";
import { handleValidationError } from "../error/errorValidation";

// Get all book
export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const {
      filter,
      sortBy = "createdAt",
      sort = "desc",
      limit = "10",
      page = "1", 
    } = req.query;

    const query: any = {};

    if (filter) {
      const genreFilter = (filter as string).toUpperCase();

      if (!Object.values(Genre).includes(genreFilter as Genre)) {
        return res.status(400).json({
          success: false,
          message: "Invalid genre filter",
          error: {
            validGenres: Object.values(Genre),
          },
        });
      }

      query.genre = genreFilter;
    }

    const limitNumber = parseInt(limit as string);
    const pageNumber = parseInt(page as string);
    const skip = (pageNumber - 1) * limitNumber;

    if (
      isNaN(limitNumber) ||
      limitNumber < 1 ||
      isNaN(pageNumber) ||
      pageNumber < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Limit and page must be positive numbers",
        error: {
          received: { limit, page },
          expected: "Positive integers",
        },
      });
    }

    const books = await Book.find(query)
      .sort({ [sortBy as string]: sort === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limitNumber);

    const totalBooks = await Book.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
      meta: {
        total: totalBooks,
        page: pageNumber,
        limit: limitNumber,
      },
    });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      res.status(400).json(handleValidationError(error));
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to retrieve books",
        error: error.message,
      });
    }
  }
};

// Create book
export const createBook = async (req: Request, res: Response) => {
  try {
    const bookData: IBook = req.body;
    const book = await Book.create(bookData);

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      res.status(400).json(handleValidationError(error));
    } else {
      res.status(400).json({
        message: "Failed to create book",
        success: false,
        error: error.message,
      });
    }
  }
};


// Get book by id
export const getBookById = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      res.status(400).json({
        message: "Invalid book ID",
        success: false,
      });
    }

    const book = await Book.findById(bookId);

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
  } catch (error: any) {
    if (error.name === "ValidationError") {
      res.status(400).json(handleValidationError(error));
    } else {
      res.status(500).json({
        message: "Failed to retrieve book",
        success: false,
        error: error.message,
      });
    }
  }
};

// update a book
export const updateBook = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      res.status(400).json({
        message: "Invalid book ID",
        success: false,
      });
    }

    const book = await Book.findByIdAndUpdate(bookId, updateData, {
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
  } catch (error: any) {
    if (error.name === "ValidationError") {
      res.status(400).json(handleValidationError(error));
    } else {
      res.status(400).json({
        message: "Failed to update book",
        success: false,
        error: error.message,
      });
    }
  }
};

// Delete a book
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      res.status(400).json({
        message: "Invalid book ID",
        success: false,
      });
    }

    const book = await Book.findByIdAndDelete(bookId);

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
  } catch (error: any) {
    if (error.name === "ValidationError") {
      res.status(400).json(handleValidationError(error));
    } else {
      res.status(500).json({
        message: "Failed to delete book",
        success: false,
        error: error.message,
      });
    }
  }
};
