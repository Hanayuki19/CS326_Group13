import "dotenv/config";
import express from "express";
import process from "node:process";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import morgan from "morgan";
import authRouter from "./routes/auth.js";
import mainRouter from "./routes/main.js";
import studentRouter from "./routes/StudentRoute.js";
import reviewRouter from "./routes/ReviewRoute.js";
import { attachUser } from "./middleware/attachUser.js";

const app = express();
const PORT = process.env.PORT || 3000;

const CONNECT_MONGO = process.env.MONGODB_URI;
if (!CONNECT_MONGO) {
  console.log("MONGO_URI is missing.");
}

await mongoose.connect(CONNECT_MONGO);

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || "local-dev-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl:
        CONNECT_MONGO
    }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // Set to true if using HTTPS in production
      maxAge: 1000 * 60 * 60 * 24, // Session expires in 1 day
    },
  })
);

app.use(attachUser);

app.use(morgan("dev"));

app.use("/", authRouter);

app.use("/", mainRouter);

app.use("/students", studentRouter);

app.use("/reviews", reviewRouter);

// htmx puts the body of a failed request into the #status live region, so
// htmx requests get the message as plain text instead of JSON.
const sendError = (req, res, status, message) => {
  if (req.get("HX-Request")) {
    return res.status(status).type("text/plain").send(message);
  }
  res.status(status).json({ error: message });
};

app.use((req, res) => {
  sendError(req, res, 404, `No route for ${req.method} ${req.originalUrl}`);
});

app.use((err, req, res, next) => {
  console.error(err);
  if (err.type === "entity.parse.failed") {
    return sendError(req, res, 400, "Request body is not valid JSON");
  }
  const status = err.status || err.statusCode || 500;
  const message =
    status < 500 ? err.message : "Something went wrong on the server";
  sendError(req, res, status, message);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
