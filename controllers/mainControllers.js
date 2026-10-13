import * as mainService from '../services/mainService.js';
import { join } from "path";

export const main = async (req, res) => {
  res.sendFile(join(import.meta.dirname, "../public", "about.html"));
};

export const members = async (req, res) => {
  const Members = await mainService.get_member();
  res.set('X-Total-Count', Members.length); //only for curl, remove if needed
  res.render("members", { title: "Members", Members });
};

export const user = async (req, res) => {
  res.send("No user yet (not implemented).");
};

export const create = async (req, res) => {
  const result = await mainService.createEntry(req.body);
  if (!result.ok) {
    res.status(result.error.status).json({ error: result.error.message });
    return;
  }
  res.status(201).json(result.value);
};

export const update = async (req, res) => {
  const id = parseInt(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'id must be a number' });
    return;
  }
  const result = await mainService.updateEntry(id, req.body);
  if (!result.ok) {
    res.status(result.error.status).json({ error: result.error.message });
    return;
  }
  res.json(result.value);
};

export const destroy = async (req, res) => {
  const id = parseInt(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: 'id must be a number' });
    return;
  }
  const result = await mainService.deleteEntry(id);
  if (!result.ok) {
    res.status(result.error.status).json({ error: result.error.message });
    return;
  }
  res.status(204).send();
};
