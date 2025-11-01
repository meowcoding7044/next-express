import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRouter from "./routes/auth.route";
import usersRouter from "./routes/users.route";
import productsRouter from "./routes/products.route";

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json());

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);

app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Backend running on", PORT));
