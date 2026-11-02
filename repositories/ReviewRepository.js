// import { readFile, writeFile } from "fs/promises";
// const DATA_FILE = "reviews.json";
import mongoose from "mongoose";

// export const getAll = async () => {
//   try {
//     const data = await readFile(DATA_FILE, "utf-8");
//     return JSON.parse(data);
//   } catch (error) {
//     return [];
//   }
// };

// export const save = async (reviews) =>
//   writeFile(DATA_FILE, JSON.stringify(reviews, null, 2));

const ReviewSchema = new mongoose.Schema(
  {
    course: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true },
);

const Reviews = mongoose.model("Review", ReviewSchema);

export const getAll = async () => Reviews.find().lean();
export const save = async (data) => (await Reviews.create(data)).toObject();
