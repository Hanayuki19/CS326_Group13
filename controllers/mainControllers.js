import * as mainService from "../services/mainService.js";
import { join } from "path";
import { create, deleteMember } from "../repositories/mainRepository.js";

export const main = async (req, res) => {
  res.render("about", { title: "Home" });
};

export const members = async (req, res) => {
  const Members = await mainService.get_member();
  res.render("members", { title: "Members", Members });
};

export const add_member = async (req, res) => {
  if (!req.body.name?.trim() || !req.body.Username?.trim()) {
    return res.status(400).send("Name and username are required.");
  }
  const result = await mainService.create_member({
    name: req.body.name.trim(),
    Username: req.body.Username.trim(),
  });

  if (!result.ok) {
    return res.status(result.error.status).send(result.error.message);
  }

  const newMember = result.value || {
    name: req.body.name.trim(),
    Username: req.body.Username.trim(),
  };

  res.render("partials/members_row", {
    entry: newMember,
    status: "Member added.",
  });
};

export const delete_member = async (req, res) => {
  const name = req.params.name?.trim();
  if (!name) {
    return res.status(400).send("Name is required.");
  }
  const deleted = await deleteMember(name);

  if (!deleted) {
    return res.status(404).send("Member not found.");
  }

  return res.status(200).send("");
};
