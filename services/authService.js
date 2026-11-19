import bcrypt from "bcrypt";
import { Ok, Err } from "../result.js";
import { createStudent } from "./StudentService.js";
import { toUserDto } from "../dtos/userDto.js";
import * as authRepository from "../repositories/authRepository.js";

const SALT_ROUNDS = 10;

export const register = async (data) => {
  if (!data) {
    return Err({
      status: 400,
      message: "All fields are required.",
    });
  }

  const Username = (data.Username || "").trim();
  const Password = data.Password || "";
  const FullName = (data.FullName || "").trim();
  const Major = (data.Major || "").trim();

  if (!Username || !Password || !FullName || !Major) {
    return Err({
      status: 400,
      message: "All fields are required.",
    });
  }

  const existing = await authRepository.findByUsername(Username);
  if (existing) {
    return Err({
      status: 409,
      message: "Username is already registered.",
    });
  }

  const newStudent = await createStudent({ name: FullName, major: Major });
  if (!newStudent.ok) return newStudent;

  const passwordHash = await bcrypt.hash(Password, SALT_ROUNDS);
  const created = await authRepository.create({
    _id: newStudent.value.id,
    Username,
    passwordHash,
    FullName,
    Major,
    role: "student",
  });

  return Ok(toUserDto(created));
};

export const login = async (data) => {
  if (!data) {
    return Err({ status: 400, message: "Username and password are required." });
  }

  const Username = (data.Username || "").trim();
  const Password = data.Password || "";

  if (!Username || !Password) {
    return Err({ status: 400, message: "Username and password are required." });
  }

  const user = await authRepository.findByUsername(Username);
  if (!user) {
    return Err({ status: 401, message: "Incorrect username or password." });
  }

  const matches = await bcrypt.compare(Password, user.passwordHash);
  if (!matches) {
    return Err({ status: 401, message: "Incorrect username or password." });
  }

  return Ok(toUserDto(user));
};

export const getUserById = async (id) => {
  const user = await authRepository.findById(id);
  if (!user) {
    return Err({ status: 404, message: "User not found." });
  }
  return Ok(toUserDto(user));
};
