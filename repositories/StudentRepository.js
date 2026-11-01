import { readFile, writeFile } from "fs/promises";
import mongoose from "mongoose";
/* from "mongoose";
const DATA_FILE = "student.json";
*/
const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    major: { type: String, required: true },
  },
  { timestamps: true },
);
const Student = mongoose.model("Student", StudentSchema);
export const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
export const getAll = async () => Student.find().lean();
export const create = async (data) => (await Student.create(data)).toObject();
export const findById = async (id) => Student.findById(id).lean();
export const updateById = async (id, data) =>
  Student.findByIdAndUpdate(id, data, { new: true }).lean();
export const removeById = async (id) => {
  await Student.findByIdAndDelete(id);
};

