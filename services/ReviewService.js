import { Ok, Err } from "../result.js";
import { getAll, save } from "../repositories/ReviewRepository.js";

const validateInput = ({ course, rating, comment }) => {
  if (!course || !rating || !comment)
    return Err({ status: 400, message: "course, rating and comment are required" });
  const r = Number(rating);
  if (!Number.isInteger(r) || r < 1 || r > 5)
    return Err({ status: 400, message: "rating must be a whole number from 1 to 5" });
  return Ok({ course: course.trim().toUpperCase(), rating: r, comment: comment.trim() });
};

export const getReviews = () => getAll();

export const createReview = async (data) => {
  const result = validateInput(data);
  if (!result.ok) return result;
  const reviews = await getAll();
  const id = reviews.length ? Math.max(...reviews.map((r) => r.id)) + 1 : 1;
  const review = { id, ...result.value };
  reviews.push(review);
  await save(reviews);
  return Ok(review);
};