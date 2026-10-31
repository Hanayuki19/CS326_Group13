import * as mainService from "../services/mainService.js";
import { join } from "path";
import { create, deleteMember } from "../repositories/mainRepository.js";

export const main = async (req, res) => {
  res.sendFile(join(import.meta.dirname, "../public", "about.html"));
};

export const get_login = async (req, res) => {
  res.render("login", { title: "Login" });
};

export const get_register = async (req, res) => {
  res.render("register", { title: "Register" });
};

export const login = async (req, res) => {
  const result = await mainService.get_login(req.body);
  if (!result.ok) {
    res.status(result.error.status).json({ error: result.error.message });
    return;
  }
  req.session.user = result.value;
  res.json({ redirect: `/students/student/${result.value.id}` });
};

export const register = async (req, res) => {
  const result = await mainService.get_register(req.body);
  if (!result.ok) {
    res.status(result.error.status).json({ error: result.error.message });
    return;
  }
  req.session.user = result.value;
  res.json({ redirect: `/students/student/${result.value.id}` });
};

export const members = async (req, res) => {
  const Members = await mainService.get_member();
  res.render("members", { title: "Members", Members });
};

export const add_member = async (req, res) => {
  if (!req.body.name?.trim() || !req.body.Username?.trim()) {
    return res.status(400).json({
      error: "Name and username are required.",
    });
  }
  const result = await mainService.create_member({
    name: req.body.name.trim(),
    Username: req.body.Username.trim(),
  });

  if (!result.ok) {
    return res.status(result.error.status).json({
      error: result.error.message,
    });
  }

  return res.status(201).json({ message: "Member added successfully." });
};

export const delete_member = async (req, res) => {
  const name = req.params.name?.trim();
  if (!name) {
    return res.status(400).json({ error: "Name is required." });
  }
  const deleted = await deleteMember(name);

  if (!deleted) {
    return res.status(404).json({ error: "Member not found." });
  }

  return res.status(204).send();
};
