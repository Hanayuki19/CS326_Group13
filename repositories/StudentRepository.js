import { readFile, writeFile } from "fs/promises";
const DATA_FILE = "student.json";

export const getAll = async () => {
  try {
    const data = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

export const save = async (entries) => {
  await writeFile(DATA_FILE, JSON.stringify(entries, null, 2));
};
