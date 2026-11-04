import { afterEach, expect, jest, test } from "@jest/globals";

jest.unstable_mockModule("../repositories/ReviewRepository.js", () => ({
  getAll: jest.fn(() => []),
  save: jest.fn((data) => ({ _id: "fake-id", ...data })),
}));

const repo = await import("../repositories/ReviewRepository.js");
const { getReviews, createReview } = await import("../services/ReviewService.js");

afterEach(() => {
  repo.getAll.mockReset();
  repo.getAll.mockReturnValue([]);
});

//start of getReviews test

test('getReviews should return all data', async () => {
  repo.getAll.mockReturnValueOnce([{
    course: "CS326",
    rating: 4,
    comment: "good",
  },
  {
    course: "CS320",
    rating: 3,
    comment: "kinda ok",
  },
  {
    course: "CS311",
    rating: 4,
    comment: "about right"
  }
  ]);

  const res = await getReviews();
  const gold_label = [{
    course: "CS326",
    rating: 4,
    comment: "good",
  },
  {
    course: "CS320",
    rating: 3,
    comment: "kinda ok",
  },
  {
    course: "CS311",
    rating: 4,
    comment: "about right"
  }
  ]
  expect(res).toEqual(gold_label);
});

test('getReviews should return all data when it is empty', async () => {
  repo.getAll.mockReturnValueOnce([]);

  const res = await getReviews();
  const gold_label = [];
  expect(res).toEqual(gold_label);
});

test('getReviews should work with data reference to the same course', async () => {
  repo.getAll.mockReturnValueOnce([{
    course: "CS326",
    rating: 4,
    comment: "good",
  },
  {
    course: "CS326",
    rating: 3,
    comment: "kinda ok",
  },
  {
    course: "CS326",
    rating: 5,
    comment: "amazing"
  }
  ]);

  const res = await getReviews();
  const gold_label = [{
    course: "CS326",
    rating: 4,
    comment: "good",
  },
  {
    course: "CS326",
    rating: 3,
    comment: "kinda ok",
  },
  {
    course: "CS326",
    rating: 5,
    comment: "amazing"
  }
  ]
  expect(res).toEqual(gold_label);
});

test('getReviews should not reject review on the same course', async () => {
  repo.getAll.mockReturnValueOnce([{
    course: "CS326",
    rating: 4,
    comment: "good",
  },
  {
    course: "CS326",
    rating: 3,
    comment: "kinda ok",
  },
  {
    course: "CS326",
    rating: 5,
    comment: "amazing"
  }
  ]);

  const res = await getReviews();
  const gold_label = [{
    course: "CS326",
    rating: 4,
    comment: "good",
  }]
  expect(res).not.toEqual(gold_label);
});
//end of getReviews test

//start of createReviews test

test('createReviews should reject if course, rating, or comment is missing or invalid', async () => {
  const res = await createReview({ course: "CS326", rating: 4, comment: "" });
  const res_2 = await createReview({ course: "", rating: 4, comment: "good" });
  const res_3 = await createReview({ course: "CS326", rating: "", comment: "good" });
  const res_4 = await createReview({ course: "CS326", rating: "four", comment: "good" });
  const res_5 = await createReview({ course: "", rating: "", comment: "good" });
  const res_6 = await createReview({ course: "CS326", rating: "", comment: "" });
  const res_7 = await createReview({ course: "", rating: 4, comment: "" });

  expect(res.ok).toBe(false);
  expect(res_2.ok).toBe(false);
  expect(res_3.ok).toBe(false);
  expect(res_4.ok).toBe(false);
  expect(res_5.ok).toBe(false);
  expect(res_6.ok).toBe(false);
  expect(res_7.ok).toBe(false);
});

test("createReviews should works even with whitespace", async () => {
  repo.getAll.mockReturnValueOnce([]);
  const res = await createReview({ course: "  cS326 ", rating: 4, comment: "  ok" });
  const res_2 = await createReview({ course: "  cS326 ", rating: 5, comment: "  Ok.    " });

  expect(res.ok).toBe(true);
  expect(res_2.ok).toBe(true);

  expect(res.value).toEqual({ _id: "fake-id", course: "CS326", rating: 4, comment: "ok" });
  expect(res_2.value).toEqual({ _id: "fake-id", course: "CS326", rating: 5, comment: "Ok." });
});

//end of createReviews test
