import { Ok, Err } from "../result.js";
import * as mainRepository from "../repositories/mainRepository.js";
import { toMemberDto } from "../dtos/mainDto.js";

export const get_member = async () =>
  (await mainRepository.getAll()).map(toMemberDto);

export const create_member = async (data) => {
  const username = data?.Username || data?.username;

  if (!data || !data.name || !username) {
    return Err({ status: 400, message: "Invalid object" });
  }

  const Member = await mainRepository.findMember(data.name);

  if (Member) {
    return Err({ status: 400, message: "The name already existed" });
  }

  await mainRepository.create({ name: data.name, Username: username });
  return Ok();
};
