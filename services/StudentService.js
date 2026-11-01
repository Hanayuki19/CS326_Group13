import { Ok, Err, Some, None } from "../result.js";
import {
  getAll,
  create,
  findById,
  updateById,
  removeById,
} from "../repositories/StudentRepository.js";
import { toStudentDto } from "../dtos/mainDto.js";

const validateInput = ({ name, major }) => {
  if (!name || !major)
    return Err({ status: 400, message: "name and major are required" });
  return Ok({ name, major });
};

export const checkPermission = (currUser, targetStudentId) => {
  if (currUser && currUser.role === "admin") {
    return Ok(true);
  }
  if (currUser && currUser.id === targetStudentId) {
    return Ok(true);
  }

  return Err({
    status: 403,
    message: "You do not have permission to access this profile.",
  });
};

export const get_student = async (currUser) => {
  if (!currUser || currUser.role !== "admin") {
    return Err({ status: 403, message: "Only admins can view all students." });
  }
  const students = (await getAll()).map(toStudentDto);
  return Ok(students);
};
/*
const findStudentByID = async (id) => {
  const students = await getAll();
  const entry = students.find((s) => s.id === id);
  return entry ? Some(entry) : None;
};
*/
export const createStudent = async (data) => {
  const result = validateInput(data);
  if (!result.ok) return result;

  const students = (await getAll()).map(toStudentDto);
  if (students.some((s) => s.name === result.value.name)) {
    return Err({ status: 404, message: "Student already exists" });
  }
  const result2 = await create(data);
  return Ok(result2);
};

export const updateStudent = async (id, data, currUser) => {
  const permission = checkPermission(currUser, id);
  if (!permission.ok) return permission;

  const found = await findById(id);
  if (!found) return Err({ status: 404, message: "Student ID not found" });

  const result = validateInput(data);
  if (!result.ok) return result;
  const students = (await getAll()).map(toStudentDto);

  if (students.some((s) => s.name === result.value.name && s._id !== id)) {
    return Err({ status: 404, message: "Student already exists" });
  }
  const result2 = await updateById(id, data);
  return Ok(result2);
};

export const deleteStudent = async (id, currUser) => {
  if (!currUser || currUser.role !== "admin") {
    return Err({
      status: 403,
      message: "Only admins can delete student records.",
    });
  }

  const students = await getAll();
  const found = await findById(id);
  if (!found) return Err({ status: 404, message: "Student not found" });

  const result2 = await removeById(id);
  return Ok(result2);
};

export const get_student_by_id = async (id, currUser) => {
  const permission = checkPermission(currUser, id);
  if (!permission.ok) return permission;

  const cur = await findById(id);
  if (!cur) return Err({ status: 404, message: "Student not found" });
  return Ok(cur);
};
