import { readFile, writeFile } from "fs/promises";

const DATA_FILE = "member.json";

export const getAll = async () => {
  const data = await readFile(DATA_FILE, "utf-8");
  return JSON.parse(data);
};
