import { Ok, Err } from "../result.js";
import * as mainRepository from "../repositories/mainRepository.js";
import { createStudent, updateStudent } from "./StudentService.js";
import { toMemberDto, NewUser } from "../dtos/mainDto.js";

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
  const result = validateInput_login(data);
  if (!result.ok) return result;

  const all_credentials = (await mainRepository.getAllCredential()).map(
    NewUser,
  );
  const { Username, Password } = result.value;

  const cur = all_credentials.find(
    (ele) => ele.Username === Username && ele.Password === Password,
  );
  if (!cur) {
    return Err({
      status: 401,
      message:
        "Incorrect username or password. Please register if you don't have an account.",
    });
  }

  return Ok({
    Username: cur.Username,
    id: cur.id,
    role: cur.role || "student",
  });
};

export const get_register = async (data) => {
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
  console.log(new_student.value._id);

  const full_results = {
    Username,
    Password,
    FullName,
    Major,
    role: "admin",
    _id: new_student.value._id,
  };
  /*
  all_users.push(full_results);
  await saveCredential(all_users);
  */
  const Newuser = NewUser(await mainRepository.createCredential(full_results));
  console.log(Newuser._id);
  return Ok(Newuser);
};

export const get_member = async () =>
  (await mainRepository.getAll()).map(toMemberDto);

export const create_member = async (data) => {
  console.log("MainService");
  const Member = await mainRepository.findMember(data.name);
  if (Member) {
    return Err({ status: 400, message: "The name already existed" });
  }
  await create(data);
  return Ok();
};
