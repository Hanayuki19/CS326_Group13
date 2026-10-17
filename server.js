import express from "express";
import morgan from "morgan";
import mainRouter from "./routes/main.js";
import studentRouter from "./routes/StudentRoute.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(morgan("dev"));

app.use("/", mainRouter);

app.use("/students", studentRouter);

app.use((req, res) => {
  res.status(404).json({ error: `No route for ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  console.error(err);
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Request body is not valid JSON" });
  }
  const status = err.status || err.statusCode || 500;
  const message = status < 500 ? err.message : "Something went wrong on the server";
  res.status(status).json({ error: message });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
