import { readFile, writeFile } from "fs/promises";

const DATA_FILE = "member.json";
const CREDENTIAL = "credentials.json";

export const getAll = async () => {
  try {
    const data = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

export const getAllCredential = async () => {
  try {
    const data = await readFile(CREDENTIAL, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return[]
  }
};

export const saveCredential = async (data) => {
  await writeFile(CREDENTIAL, JSON.stringify(data, null, 2));
};
