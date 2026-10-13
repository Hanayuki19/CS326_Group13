import express from "express";
import morgan from 'morgan';
//import entriesRouter from './routes/entries.js'; not needed just yet
import { join } from "path";
import { readFile, writeFile } from 'fs/promises';

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = "member.json";

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(join(import.meta.dirname, "public", "about.html"));
});
app.get("/members", async (req, res) => {
  const data = await readFile(DATA_FILE, 'utf-8');
  const Members = JSON.parse(data);
  res.set('X-Total-Count', Members.length); //only for curl, remove if needed
  res.render("members", { title: "Members", Members });
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

// Test change first before moving onto routing
