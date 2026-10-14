import { Ok, Err } from "../result.js";
import { getAll } from "../repositories/mainRepository.js";
import { toMemberDto } from "../dtos/mainDto.js";

const validateInput = ({ title, body }) => {
  if (!title || !body)
    return Err({ status: 400, message: "title and body are required" });
  return Ok({ title, body });
};

export const get_member = async () => {
  const members = await getAll();
  return members.map(toMemberDto);
};
