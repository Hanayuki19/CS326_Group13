import express from "express";
import { join } from "path";

const app = express();
const PORT = 3000;
const Members = [
  { name: "Minh Le", Username: "Hanayuki19" },
  { name: "Long Tran Duy", Username: "ltranduy-boop" },
  { name: "Mahish Mistry", Username: "mahishmistry" },
  { name: "Chloe Le", Username: "its-cle" },
];
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "views");

app.get("/", (req, res) => {
  res.sendFile(join(import.meta.dirname, "public", "about.html"));
});
app.get("/members", (req, res) => {
  res.render("members", { title: "Members", Members });
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
