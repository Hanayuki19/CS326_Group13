import * as mainService from "../services/mainService.js";
import { join } from "path";

export const main = async (req, res) => {
  res.sendFile(join(import.meta.dirname, "../public", "about.html"));
};

export const members = async (req, res) => {
  const Members = await mainService.get_member();
  res.render("members", { title: "Members", Members });
};
