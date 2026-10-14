export const toMemberDto = (user) => ({
  name: user.name,
  Username: user.Username,
});

export const toStudentDto = (user) => ({
  name: user.name,
  major: user.major,
  id: user.id,
});
