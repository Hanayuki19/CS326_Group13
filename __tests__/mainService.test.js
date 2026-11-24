import { afterEach, expect, jest, test } from "@jest/globals";

jest.unstable_mockModule("../repositories/mainRepository.js", () => ({
  isValidId: jest.fn(() => true),
  getAll: jest.fn(() => [
    { _id: "1", name: "A", Username: "B" },
    { _id: "2", Username: "B" },
    { _id: "3", name: "A" },
  ]),
  findById: jest.fn(),
  create: jest.fn((data) => ({ _id: "fake-id", ...data })),
  updateById: jest.fn(),
  removeById: jest.fn(),
  findMember: jest.fn(() => undefined),
}));

const repo = await import("../repositories/mainRepository.js");
const { create_member, get_member } = await import("../services/mainService");

afterEach(() => {
  repo.findMember.mockReset();
  repo.findMember.mockReturnValue(null);
});

test("create_member accecpts a normal object", async () => {
  const result = await create_member({ name: "abc", username: "xyz" });
  expect(result.ok).toBe(true);
});

test("create_member rejects the already existed name", async () => {
  repo.findMember.mockReturnValueOnce({
    _id: "fake-id",
    name: "abc",
    username: "xxx",
  });
  const result = await create_member({ name: "abc", username: "xyz" });
  expect(result.ok).toBe(false);
  expect(result.error).toEqual({
    status: 400,
    message: "The name already existed",
  });
});

test("create_member rejects missing info-object", async () => {
  const result1 = await create_member({ name: "abc" });
  const result2 = await create_member({ username: "xyz" });
  const result3 = await create_member(null);
  expect(result1.ok).toBe(false);
  expect(result1.error).toEqual({ status: 400, message: "Invalid object" });
  expect(result2.ok).toBe(false);
  expect(result2.error).toEqual({ status: 400, message: "Invalid object" });
  expect(result3.ok).toBe(false);
  expect(result3.error).toEqual({ status: 400, message: "Invalid object" });
});

test("get_nember returns exactly list of members", async () => {
  const result = await get_member();
  expect(result.length).toBe(3);
  const equal = (data, result) => {
    if (data.name !== result.name) return false;
    if (data.Username !== result.Username) return false;
    return true;
  };
  expect(equal(result[0], { name: "A", Username: "B" })).toBe(true);
  expect(equal(result[1], { name: undefined, Username: "B" })).toBe(true);
  expect(equal(result[2], { Username: undefined, name: "A" })).toBe(true);
});
