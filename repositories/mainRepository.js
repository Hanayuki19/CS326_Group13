import mongoose from "mongoose";

const member_schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    Username: { type: String, required: true },
  },
  { timestamps: true }
);
export const Member = mongoose.model("Member", member_schema);

export const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getAll = async () => Member.find().lean();

export const create = async (data) => (await Member.create(data)).toObject();

export const deleteMember = async (name) =>
  await Member.findOneAndDelete({ name: name });

export const findMember = async (name) => {
  console.log("mainRepo");
  return await Member.findOne({ name: name });
};
