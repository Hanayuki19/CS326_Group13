import Credentials from "../models/credentialModel.js";

export const findByUsername = async (Username) =>
  Credentials.findOne({ Username }).lean();

export const findById = async (id) => Credentials.findById(id).lean();

export const create = async (data) =>
  (await Credentials.create(data)).toObject();

export const updateById = async (id, data) =>
  Credentials.findByIdAndUpdate(id, data, { new: true }).lean();
