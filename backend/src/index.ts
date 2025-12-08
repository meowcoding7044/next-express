import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRouter from "./routes/auth.route";
import usersRouter from "./routes/users.route";
import productsRouter from "./routes/products.route";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const FRONTEND = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(helmet());
app.use(morgan("dev"));
app.use(
	rateLimit({
		windowMs: 15 * 60 * 1000,
		max: Number(process.env.RATE_LIMIT_MAX || 100),
	})
);

app.use(cors({ origin: FRONTEND, credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);

app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Backend running on", PORT));
