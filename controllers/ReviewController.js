import * as reviewService from "../services/ReviewService.js";

export const list = async (req, res) => {
  const Reviews = await reviewService.getReviews();
  res.render("reviews", { title: "Course Reviews", Reviews });
};

export const create = async (req, res) => {
  const result = await reviewService.createReview(req.body);
  if (!result.ok) {
    // htmx routes 4xx bodies into #status (see partials/head.ejs).
    return res.status(result.error.status).send(result.error.message);
  }

  res.render("partials/review_row", {
    entry: result.value,
    status: "Review added.",
  });
};
