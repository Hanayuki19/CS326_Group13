import * as mainService from "../services/StudentService.js";
import { isValidId } from "../repositories/StudentRepository.js";
import { join } from "path";

export const students = async (req, res) => {
  const result = await mainService.get_student(req.user);
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
  const result = await mainService.get_student_by_id(id, req.user);
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
  res.render("partials/student_row", {
    entry: result.value,
    status: "Student added.",
  });
};

export const update = async (req, res) => {
  const id = req.params.id;
  if (!isValidId(id)) {
    return res.status(400).send("Invalid ID");
  }
  const result = await mainService.updateStudent(id, req.body, req.user);
  if (!result.ok) {
    return res.status(result.error.status).send(result.error.message);
  }
  res.render("partials/student_row", {
    entry: result.value,
    status: "Student saved.",
  });
};

// The edit form for one row. Edit swaps it in where the row was.
export const editForm = async (req, res) => {
  const id = req.params.id;
  if (!isValidId(id)) {
    return res.status(400).send("Invalid ID");
  }
  const result = await mainService.get_student_by_id(id, req.user);
  if (!result.ok) {
    return res.status(result.error.status).send(result.error.message);
  }
  res.render("partials/student_edit", { entry: result.value });
};

// The plain row again. Cancel swaps it back in where the edit form was.
export const row = async (req, res) => {
  const id = req.params.id;
  if (!isValidId(id)) {
    return res.status(400).send("Invalid ID");
  }
  const result = await mainService.get_student_by_id(id, req.user);
  if (!result.ok) {
    return res.status(result.error.status).send(result.error.message);
  }
  res.render("partials/student_row", {
    entry: result.value,
    status: "Edit cancelled.",
  });
};

export const deleteStudent = async (req, res) => {
  const id = req.params.id;
  if (!isValidId(id)) {
    return res.status(400).send("Invalid ID");
  }
  const result = await mainService.deleteStudent(id, req.user);
  if (!result.ok) {
    return res.status(result.error.status).send(result.error.message);
  }
  // Nothing replaces the row; the body is only the out-of-band status text.
  res.render("partials/status_oob", { status: "Student deleted." });
};
