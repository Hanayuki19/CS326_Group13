import * as mainService from "../services/StudentService.js";
import { isValidId } from "../repositories/StudentRepository.js";
import { join } from "path";

export const students = async (req, res) => {
  const result = await mainService.get_student(req.session?.user);
  if (!result.ok) {
    return res.status(result.error.status).send(result.error.message);
  }
  res.render("students", { title: "Students", Students: result.value });
};

export const student = async (req, res) => {
  const id = req.params.id;

  if (!isValidId(id)) {
    return res.status(400).send("Invalid ID");
  }
  const result = await mainService.get_student_by_id(id, req.session?.user);
  if (!result.ok) {
    return res.status(result.error.status).send(result.error.message);
  }
  res.render("student", { title: "Student", student: result.value });
};

export const create = async (req, res) => {
  const result = await mainService.createStudent(req.body);
  if (!result.ok) {
    return res.status(result.error.status).send(result.error.message);
  }
  res.render("partials/student_row", { entry: result.value });
};

export const update = async (req, res) => {
  const id = req.params.id;
  if (!isValidId(id)) {
    return res.status(400).send("Invalid ID");
  }
  const result = await mainService.updateStudent(
    id,
    req.body,
    req.session?.user
  );
  if (!result.ok) {
    return res.status(result.error.status).send(result.error.message);
  }
  res.render("partials/student_row", { entry: result.value });
};

export const deleteStudent = async (req, res) => {
  const id = req.params.id;
  if (!isValidId(id)) {
    return res.status(400).send("Invalid ID");
  }
  const result = await mainService.deleteStudent(id, req.session?.user);
  if (!result.ok) {
    return res.status(result.error.status).send(result.error.message);
  }
  res.status(200).send("");
};
