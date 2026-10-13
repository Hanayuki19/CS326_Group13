import { readFile, writeFile } from 'fs/promises';

const DATA_FILE = 'user.json';
const MEMBER_DATA = 'member.json';

export const getAllMember = async() => {
  const data = await readFile(MEMBER_DATA, 'utf-8');
  return JSON.parse(data);
};

export const getAll = async () => {
  const data = await readFile(DATA_FILE, 'utf-8');
  return JSON.parse(data);
};

export const save = async (entries) => {
  await writeFile(DATA_FILE, JSON.stringify(entries, null, 2));
};
