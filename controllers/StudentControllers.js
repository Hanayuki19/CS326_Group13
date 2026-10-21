import * as mainService from "../services/StudentService.js";
import { join } from "path";

export const students = async (req, res) => {
  const result = await mainService.get_student(req.session?.user);
  if (!result.ok) {
    res.status(result.error.status).json({ error: result.error.message });
    return
  }
  res.render("students", { title: "Students", Students: result.value });
};
export const student = async (req, res) => {
  const id = parseInt(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "id must be a number" });
    return;
  }
  const result = await mainService.get_student_by_id(id, req.session?.user);
  if (!result.ok) {
    res.status(result.error.status).json({ error: result.error.message });
    return;
  }
  res.render("student", { title: "Student", student: result.value });
};

export const create = async (req, res) => {
  const result = await mainService.createStudent(req.body);
  if (!result.ok) {
    res.status(result.error.status).json({ error: result.error.message });
    return;
  }
  res.status(201).json(result.value);
};

export const update = async (req, res) => {
  const id = parseInt(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "id must be a number" });
    return;
  }
  const result = await mainService.updateStudent(id, req.body, req.session?.user);
  if (!result.ok) {
    res.status(result.error.status).json({ error: result.error.message });
    return;
  }
  res.json(result.value);
};

export const deleteStudent = async (req, res) => {
  const id = parseInt(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "id must be a number" });
    return;
  }
  const result = await mainService.deleteStudent(id, req.session?.user);
  if (!result.ok) {
    res.status(result.error.status).json({ error: result.error.message });
    return;
  }
  res.status(204).send();
};
