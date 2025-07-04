import express, { Application, Request, Response } from "express";
import bookRoutes from "./app/routes/bookRoutes";
import borrowRoutes from "./app/routes/borrowRoutes";
import cors from "cors";

const app: Application = express();
app.use(express.json());
app.use(cors());

app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Libraey management server");
});

export default app;
