import { readFile, writeFile } from "fs/promises";

const DATA_FILE = "member.json";
const CREDENTIAL = "credentials.json";

export const getAll = async () => {
  const data = await readFile(DATA_FILE, "utf-8");
  return JSON.parse(data);
};

export const getAllCredential = async () => {
  const data = await readFile(CREDENTIAL, "utf-8");
  return JSON.parse(data);
};

export const saveCredential = async (data) => {
  await writeFile(CREDENTIAL, JSON.stringify(data, null, 2));
};
