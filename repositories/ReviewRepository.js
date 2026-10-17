import { readFile, writeFile } from "fs/promises";
const DATA_FILE = "reviews.json";

export const getAll = async () => JSON.parse(await readFile(DATA_FILE, "utf-8"));
export const save = async (reviews) =>
  writeFile(DATA_FILE, JSON.stringify(reviews, null, 2));