import { afterEach, expect, jest, test } from "@jest/globals";

jest.unstable_mockModule("../repositories/authRepository.js", () => ({
  isValidId: jest.fn(() => true),
  getAll: jest.fn(() => [
    {
      _id: "1",
      Username: "A",
      passwordHash: "randomA",
      FullName: "FullA",
      Major: "CS",
      role: "student",
    },
    {
      _id: "1",
      Username: "B",
      passwordHash: "randomB",
      FullName: "FullB",
      Major: "CS",
      role: "admin",
    },
  ]),
  findByUsername: jest.fn(),
  findById: jest.fn((data) => ({ _id: "fake-id", ...data })),
  create: jest.fn((data) => ({ _id: "fake-id", ...data })),
  updateById: jest.fn(),
}));
jest.unstable_mockModule("../services/StudentService.js", () => ({
  createStudent: jest.fn((data) => ({ ok: true, value: { id: 2 } })),
}));
jest.unstable_mockModule("bcrypt", () => ({
  default: {
    compare: jest.fn((a, b) => a === b),
    hash: jest.fn(() => "abc"),
  },
  compare: jest.fn((a, b) => a === b),
}));

const repo = await import("../repositories/authRepository.js");
const { register, login, getUserById } =
  await import("../services/authService.js");

afterEach(() => {
  //repo.findMember.mockReset();
  //repo.findMember.mockReturnValue(null);
  repo.findByUsername.mockReset();
  repo.findByUsername.mockReturnValue(null);
  repo.findById.mockReset();
  repo.findById.mockReturnValue(null);
});

test("register rejects data with lack of field", async () => {
  const result1 = await register({
    Password: "abc",
    FullName: "FullName",
    Major: "CS",
  });
  const result2 = await register({
    Username: "abc",
    FullName: "FullName",
    Major: "CS",
  });
  const result3 = await register({
    Password: "abc",
    Username: "FullName",
    Major: "CS",
  });
  const result4 = await register({
    Password: "abc",
    FullName: "FullName",
    Username: "CS",
  });
  const result5 = await register({
    FullName: "",
    Password: "abc",
    Username: "FullName",
    Major: "CS",
  });
  expect(result1.ok).toBe(false);
  expect(result1.error.status).toBe(400);
  expect(result2.ok).toBe(false);
  expect(result2.error.status).toBe(400);
  expect(result3.ok).toBe(false);
  expect(result3.error.status).toBe(400);
  expect(result4.ok).toBe(false);
  expect(result4.error.status).toBe(400);
  expect(result5.ok).toBe(false);
  expect(result5.error.status).toBe(400);
});

test("register rejects data with the Username that was already registered the list", async () => {
  repo.findByUsername.mockReturnValueOnce({
    FullName: "xyz",
    Password: "abc",
    Username: "FullName",
    Major: "CS",
  });
  const result = await register({
    FullName: "pol",
    Password: "abc",
    Username: "FullName",
    Major: "CS",
  });
  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(409);
});

test("login rejects data with lack of field", async () => {
  const result1 = await login({
    Username: "FullName",
    Major: "CS",
  });
  const result2 = await login({
    Password: "",
    FullName: "FullName",
    Major: "CS",
  });
  expect(result1.ok).toBe(false);
  expect(result1.error.status).toBe(400);
  expect(result2.ok).toBe(false);
  expect(result2.error.status).toBe(400);
});

test("login rejects data with incorrect username", async () => {
  repo.findByUsername.mockReturnValueOnce(null);
  const result = await login({ Username: "Lol", Password: "pl" });
  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(401);
});

test("login rejects data with incorrect password", async () => {
  repo.findByUsername.mockReturnValueOnce({
    _id: "2",
    Username: "Lol",
    passwordHash: "l",
  });
  const result = await login({ Username: "Lol", Password: "pl" });
  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(401);
});

test("getUserById rejects user that is not in the list", async () => {
  const result = await getUserById("abc");
  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(404);
});

test("3 functions work normally", async () => {
  const user = {
    FullName: "lp",
    Password: "abc",
    Username: "FullName",
    Major: "CS",
    role: "admin",
  };
  const resultRegister = await register(user);
  expect(resultRegister.ok).toBe(true);

  repo.findByUsername.mockReturnValueOnce({
    _id: "xyz",
    FullName: "lp",
    passwordHash: "abc",
    Username: "FullName",
    Major: "CS",
    role: "admin",
  });
  const resultLogin = await login({ Username: "Fullname", Password: "abc" });
  expect(resultLogin.ok).toBe(true);

  repo.findById.mockReturnValueOnce({ _id: "xyz", ...user });
  const resultUser = await getUserById("xyz");
  expect(resultUser.ok).toBe(true);
  expect(resultUser.value).toEqual({
    id: "xyz",
    Username: "FullName",
    name: "lp",
    major: "CS",
    role: "admin",
  });
});
