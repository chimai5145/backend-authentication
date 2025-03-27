import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { configs } from "./config";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler";
import catchError from "./utils/catchError";
import { OK } from "./config/http";
import authRoutes from "./routers/auth.router";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: configs.frontend_url,
        credentials: true
    })
);
app.use(cookieParser());

app.get("/", catchError(async (_req: Request, res: Response, next: NextFunction) => {
    // throw new Error("This is a test error");
    res.status(OK).json({
        status: "healthy"
    });
}));

// Auth
app.use("/auth", authRoutes);

app.use(errorHandler)

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
});

