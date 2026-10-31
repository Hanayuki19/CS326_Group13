import { readFile, writeFile } from "fs/promises";
import mongoose from "mongoose";
/*
const DATA_FILE = "member.json";
const CREDENTIAL = "credentials.json";
*/
const member_schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    Username: { type: String, required: true },
  },
  { timestamps: true },
);
const Member = mongoose.model("Member", member_schema);
const credential_schema = new mongoose.Schema(
  {
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    Fullname: { type: String, required: true },
    Major: { type: String, required: true },
    role: { type: String, required: true },
    id: { type: Number, required: true },
  },
  { timestamps: true },
);
const Credentials = mongoose.model("Credentials", credential_schema);

export const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getAll = async () =>
  /*
  try {
    const data = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
  */
  Member.find().lean();

export const create = async (data) => (await Member.create(data)).toObject();

export const deleteMember = async (name) =>
  await Member.findOneAndDelete({ name: name });

export const findMember = async (name) => {
  console.log("mainRepo");
  return await Member.findOne({ name: name });
};

export const getAllCredential = async () =>
  /*
  try {
    const data = await readFile(CREDENTIAL, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
  */
  Credentials.find().lean();

export const findCredentialById = async (id) => {
  Credentials.findById(id).lean();
};
export const createCredential = async (data) =>
  (await Credentials.create(data)).toObject();
export const updateCredentialById = async (id, data) =>
  Credentials.findByIdAndUpdate(id, data, { new: true }).lean();
export const removeCredentialById = async (id) => {
  await Credentials.findByIdAndDelete(id);
};
/*
export const saveCredential = async (data) => {
  await writeFile(CREDENTIAL, JSON.stringify(data, null, 2));
};
*/
