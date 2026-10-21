import { Ok, Err, Some, None } from "../result.js";
import { getAll, save } from "../repositories/StudentRepository.js";
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
    message: "You do not have permission to access this profile."
  });
};

export const get_student = async (currUser) => {
  if (!currUser || currUser.role !== "admin") {
    return Err({ status: 403, message: "Only admins can view all students."})
  }
  const students = await getAll();
  return Ok(students.map(toStudentDto));
};

const findStudentByID = async (id) => {
  const students = await getAll();
  const entry = students.find((s) => s.id === id);
  return entry ? Some(entry) : None;
};

export const createStudent = async (data) => {
  const result = validateInput(data);
  if (!result.ok) return result;

  const students = await getAll();
  if (students.some((s) => s.name === result.value.name)) {
    return Err({ status: 409, message: "Student already exists" });
  }
  const id =
    students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1;
  result.value.id = id;
  students.push(result.value);
  await save(students);
  return Ok(toStudentDto(result.value));
};

export const updateStudent = async (id, data, currUser) => {
  const permission = checkPermission(currUser, id);
  if (!permission.ok) return permission;

  const students = await getAll();
  const found = await findStudentByID(id);
  if (!found.some) return Err({ status: 404, message: "Student ID not found" });

  const result = validateInput(data);
  if (!result.ok) return result;

  const index = students.findIndex((s) => s.id === id);

  students[index].name = result.value.name;
  students[index].major = result.value.major;

  await save(students);
  return Ok(toStudentDto(result.value));
};

export const deleteStudent = async (id, currUser) => {
  if (!currUser || currUser.role !== "admin") {
    return Err({ status: 403, message: "Only admins can delete student records."})
  }
  
  const students = await getAll();
  const found = await findStudentByID(id);
  if (!found.some) return Err({ status: 404, message: "Student not found" });

  const index = students.findIndex((s) => s.id === id);
  students.splice(index, 1);
  await save(students);
  return Ok(null);
};

export const get_student_by_id = async (id, currUser) => {
  const permission = checkPermission(currUser, id);
  if (!permission.ok) return permission;

  const cur = await findStudentByID(id);
  if (!cur.some) return Err({ status: 404, message: "Student not found" });
  return Ok(toStudentDto(cur.value));
};
