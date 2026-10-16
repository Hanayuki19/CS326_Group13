export const toMemberDto = (user) => ({
  name: user.name,
  Username: user.Username,
});

export const toStudentDto = (user) => ({
  name: user.name,
  major: user.major,
  id: user.id,
});

export const NewUser = (user) => ({
  name: user.FullName,
  Username: user.Username,
  Password: user.Password,
  major: user.Major,
  id: user.id,
});
