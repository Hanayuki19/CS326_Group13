export const toUserDto = (user) => ({
  id: user._id.toString(),
  Username: user.Username,
  name: user.FullName,
  major: user.Major,
  role: user.role || "student",
});
