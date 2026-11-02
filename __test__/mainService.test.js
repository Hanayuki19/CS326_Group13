import { afterEach, expect, jest, test } from "@jest/globals";
import { createCredential, findMember } from "../repositories/mainRepository";

jest.unstable_mockModule("../repositories/mainRepository.js", () => ({
  isValidId: jest.fn(() => true),
  getAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn((data) => ({ _id: "fake-id", ...data })),
  updateById: jest.fn(),
  removeById: jest.fn(),
  findMember: jest.fn((name) => null),
  getAllCredential: jest.fn(() => [
    {
      _id: "fake-id",
      Username: "abc",
      Password: "xyz",
      FullName: "lol",
      Major: "CS",
      role: "student",
    },
  ]),
  createCredential: jest.fn(() => true),
}));

jest.unstable_mockModule("../services/StudentService.js", () => ({
  createStudent: jest.fn((data) => ({
    ok: true,
    value: { _id: "fake-id", name: data.name, username: data.username },
  })),
}));

const repo = await import("../repositories/mainRepository.js");
const { create_member, get_login, get_register } =
  await import("../services/mainService");

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
});

test("create_member rejects missing info-object", async () => {
  const result1 = await create_member({ name: "abc" });
  const result2 = await create_member({ username: "xyz" });
  const result3 = await create_member(null);
  expect(result1.ok).toBe(false);
  expect(result2.ok).toBe(false);
  expect(result3.ok).toBe(false);
});

test("get_register accepts normal info-object", async () => {
  const result = await get_register({
    Username: "cba",
    Password: "xyz",
    FullName: "lol",
    Major: "CS",
  });
  expect(result.ok).toBe(true);
});

test("get_register rejects info-object with similar username", async () => {
  const result = await get_register({
    Username: "abc",
    Password: "xyz",
    FullName: "lol",
    Major: "CS",
  });

  expect(result.ok).toBe(false);
});

test("get_register rejects missing type info-object", async () => {
  const result1 = await get_register({
    Password: "xyz",
    FullName: "lol",
    Major: "CS",
  });
  const result2 = await get_register({
    Username: "abc",
    FullName: "lol",
    Major: "CS",
  });
  const result3 = await get_register({
    Username: "abc",
    Password: "xyz",
    Major: "CS",
  });
  const result4 = await get_register({
    Username: "abc",
    Password: "xyz",
    FullName: "lol",
  });
  const result5 = await get_register(null);
  expect(result1.ok).toBe(false);
  expect(result2.ok).toBe(false);
  expect(result3.ok).toBe(false);
  expect(result4.ok).toBe(false);
  expect(result5.ok).toBe(false);
});

test("get_login accepts its client", async () => {
  const result = await get_login({ Username: "abc", Password: "xyz" });
  expect(result.ok).toBe(true);
  expect(result.value.id).toBe("fake-id");
  expect(result.value.Username).toBe("abc");
  expect(result.value.role).toBe("student");
});

test("get_login rejects the wrong username or wrong password", async () => {
  const result1 = await get_login({ Username: "cba", Password: "xyz" });
  const result2 = await get_login({ Username: "abc", Password: "zy" });
  expect(result1.ok).toBe(false);
  expect(result2.ok).toBe(false);
});

test("get_login rejects missing info-object", async () => {
  const result1 = await get_login({ Username: "abc" });
  const result2 = await get_login({ Password: "xyz" });
  expect(result1.ok).toBe(false);
  expect(result2.ok).toBe(false);
});

/*
import {
  get_login,
  get_register,
  create_member,
} from "../services/mainService";

test;
*/
