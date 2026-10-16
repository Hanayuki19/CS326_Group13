import * as mainService from "../services/mainService.js";
import { join } from "path";

export const main = async (req, res) => {
  res.sendFile(join(import.meta.dirname, "../public", "about.html"));
};

export const get_login = async (req, res) => {
  res.render("login", {title: "Login" });
}

export const get_register = async (req, res) => {
  res.render("register", {title: "Register" });
}

export const login = async (req, res) => {
  const result = await mainService.get_login(req.body);
  if (!result.ok) {
    res.status(result.error.status).json({error: result.error.message });
    return;
  }
  res.json({ redirect: "/students" });
};

export const register = async (req, res) => {
  const result = await mainService.get_register(req.body);
  if (!result.ok) {
    res.status(result.error.status).json({error: result.error.message });
    return;
  }
  res.json({ redirect: "/students" });
};

export const members = async (req, res) => {
  const Members = await mainService.get_member();
  res.render("members", { title: "Members", Members });
};
