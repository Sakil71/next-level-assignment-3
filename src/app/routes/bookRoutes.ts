import express from "express";
import { createBook, deleteBook, getAllBooks, getBookById, updateBook } from "../controllers/bookController";
// import { createBook, deleteBook, getAllBooks, getBookById, updateBook } from "../controllers/bookController";

const bookRoutes = express.Router();

bookRoutes.get("/", getAllBooks);
bookRoutes.post("/", createBook);
bookRoutes.get("/:bookId", getBookById);
bookRoutes.put("/:bookId", updateBook);
bookRoutes.delete("/:bookId", deleteBook);

export default bookRoutes;
