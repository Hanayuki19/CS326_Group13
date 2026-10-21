import { readFile, writeFile } from "fs/promises";
const DATA_FILE = "reviews.json";

export const getAll = async () => {
  try {
    const data = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

export const save = async (reviews) =>
  writeFile(DATA_FILE, JSON.stringify(reviews, null, 2));