import { Ok, Err, Some, None } from '../result.js';
import { getAll, save, getAllMember } from '../repositories/mainRepository.js';
import { toMemberDto } from '../dtos/mainDto.js';

const validateInput = ({ title, body }) => {
  if (!title || !body) return Err({ status: 400, message: 'title and body are required' });
  return Ok({ title, body });
};

export const get_member = async () => {
  const members = await getAllMember();
  return members.map(toMemberDto);
};

const findUserByID = (entries, id) => {
  const entry = entries[id];
  return entry ? Some(entry) : None;
};

export const createUser = async (data) => {
  const result = validateInput(data);
  if (!result.ok) return result;

  const user = await getAll();
  user.push(result.value);
  await save(user);
  return Ok(toUserDto(result.value));
};

export const updateUser = async (id, data) => {
  const user = await getAll();
  const found = findUserByID(user, id);
  if (!found.some) return Err({ status: 404, message: 'Entry not found' });

  const result = validateInput(data);
  if (!result.ok) return result;

  user[id] = result.value;
  await save(user);
  return Ok(toUserDto(result.value));
};

export const deleteUser = async (id) => {
  const Users = await getAll();
  const found = findUserByID(user, id);
  if (!found.some) return Err({ status: 404, message: 'User not found' });

  user.splice(id, 1);
  await save(user);
  return Ok(null);
};
