import { Ok, Err } from "../result.js";
import bcrypt from 'bcrypt';
import * as mainRepository from "../repositories/mainRepository.js";
import { createStudent } from "./StudentService.js";
import { toMemberDto, NewUser, toLoginDto } from "../dtos/mainDto.js";

const validateInput_login = ({ Username, Password }) => {
  if (!Username || !Password)
    return Err({ status: 400, message: "Username or Password is missing." });
  return Ok({ Username, Password });
};

const validateInput_register = ({ Username, Password, FullName, Major }) => {
  if (!Username || !Password || !FullName || !Major)
    return Err({
      status: 400,
      message: "Username, Password, FullName, or Major is missing.",
    });
  return Ok({ Username, Password, FullName, Major });
};

export const get_login = async (data) => {
  if (!data) return Err({ status: 400, message: "Invalid Object" });
  const result = validateInput_login(data);
  if (!result.ok) return result;

  const { Username, Password } = result.value;
  const user = await mainRepository.findByUsername((Username || '').trim());
  if (!user) return Err({ status: 401, message: 'incorrect Username or password' });
  const matches = await bcrypt.compare(Password || '', user.passwordHash);
  if (!matches) return Err({ status: 401, message: 'incorrect Username or password' });

  return Ok(toLoginDto(user));
};

export const get_register = async (data) => {
  if (!data) return Err({ status: 400, message: "Invalid Object" });
  const result = validateInput_register(data);
  if (!result.ok) return result;
  const { Username, Password, FullName, Major } = result.value;

  const all_users = (await mainRepository.getAllCredential()).map(NewUser);
  if (all_users.some((ele) => ele.Username === Username)) {
    return Err({ status: 409, message: "Username already exists." });
  }

  const new_student = await createStudent({
    name: FullName,
    major: Major,
  });
  if (!new_student.ok) return new_student;
  const passwordHash = await bcrypt.hash(Password, 10);

  const full_results = {
    Username,
    passwordHash,
    FullName,
    Major,
    role: "student",
    _id: new_student.value.id,
  };
  const Newuser = NewUser(await mainRepository.createCredential(full_results));
  return Ok(Newuser);
};

export const get_member = async () =>
  (await mainRepository.getAll()).map(toMemberDto);

export const create_member = async (data) => {
  if (!data || !data.name || !data.username) {
    return Err({ status: 400, message: "Invalid object" });
  }
  const Member = await mainRepository.findMember(data.name);
  if (Member) {
    return Err({ status: 400, message: "The name already existed" });
  }
  await mainRepository.create(data);
  return Ok();
};
