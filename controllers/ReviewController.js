import * as reviewService from "../services/ReviewService.js";

export const list = async (req, res) => {
  const Reviews = await reviewService.getReviews();
  res.render("reviews", { title: "Course Reviews", Reviews });
};

export const create = async (req, res) => {
  const result = await reviewService.createReview(req.body);
  if (!result.ok) {
    return res.status(result.error.status).send(`
      <p id="form-error" hx-swap-oob="true" class="mb-4 min-h-5 text-sm text-red-600" role="alert">
        ${result.error.message}
      </p>
    `);
  }

  res.render("partials/review_row", { entry: result.value });
};
