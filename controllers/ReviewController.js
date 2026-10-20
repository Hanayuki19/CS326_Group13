import * as reviewService from "../services/ReviewService.js";

export const list = async (req, res) => {
  const Reviews = await reviewService.getReviews();
  if (!result.ok) {
    res.status(result.error.status).json({ error: result.error.message });
    return;
  }
  res.render("reviews", { title: "Course Reviews", Reviews });
};

export const create = async (req, res) => {
  const result = await reviewService.createReview(req.body);
  if (!result.ok)
    return res.status(result.error.status).json({ error: result.error.message });
  res.status(201).json(result.value);
};