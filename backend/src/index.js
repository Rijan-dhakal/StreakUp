import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { connectDB } from "./database/mongodb.js";
import { authRouter } from "./routes/auth.route.js";
import { validateRouter } from "./routes/validate.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/auth", authRouter);
app.use("/api/validate", validateRouter);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
