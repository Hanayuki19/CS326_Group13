import { afterEach, expect, jest, test } from "@jest/globals";
//start of jest.mockUnstable (test on mock database)
jest.unstable_mockModule("../repositories/StudentRepository.js", () => ({
  isValidId: jest.fn(() => true),
  getAll: jest.fn(() => []),
  findById: jest.fn(),
  create: jest.fn((data) => ({ _id: "fake-id", ...data })),
  updateById: jest.fn(),
  removeById: jest.fn()
}));

const repo = await import("../repositories/StudentRepository.js");
const { get_student, createStudent, updateStudent, deleteStudent, get_student_by_id } = await import("../services/StudentService.js");

afterEach(() => {
  repo.getAll.mockReset();
  repo.getAll.mockReturnValue([]);
  repo.findById.mockReset();
  repo.updateById.mockReset();
});

// //start of test validateInput
// test('validateInput accepts those with name and major', async () => {
//   const result = await validateInput({ name: 'A', major: 'something' });
//   expect(result.ok).toBe(true);
//   //expect(result.error.status).toBe(400);
// });

// test('validateInput rejects those with only major', async () => {
//   const result = await validateInput({ name: '', major: 'something' });
//   expect(result.error.status).toBe(400);
// });

// test('validateInput rejects those with only name', async () => {
//   const result = await validateInput({ name: 'B', major: '' });
//   expect(result.error.status).toBe(400);
// });

// test('validateInput rejects those with no input name and major', async () => {
//   const result = await validateInput({ name: '', major: '' });
//   expect(result.error.status).toBe(400);
// });

// //end of test ValidateInput

// //start of test checkPermission
// test('checkPermission accepts all admins', async () => {
//   const result = await checkPermission({ id: 10, role: 'admin' }, 10);
//   const result_2 = await checkPermission({ id: 11, role: 'admin' }, 11);
//   const result_3 = await checkPermission({ id: 12, role: 'admin' }, 12);
//   const result_4 = await checkPermission({ id: "abc123", role: 'admin' }, "cde456");

//   expect(result.ok).toBe(true);
//   expect(result_2.ok).toBe(true);
//   expect(result_3.ok).toBe(true);
//   expect(result_4.ok).toBe(true);
// });

// test('checkPermission only accepts students with valid id', async () => {
//   const res = await checkPermission({ id: 10, role: 'student' }, 10);
//   const res_2 = await checkPermission({ id: 1000000, role: 'student' }, 1000000);
//   const res_3 = await checkPermission({ id: "abc456", role: 'student' }, "abc456");
//   const res_4 = await checkPermission({ id: "cde.456_", role: 'student' }, "cde.456_");

//   expect(res.ok).toBe(true);
//   expect(res_2.ok).toBe(true);
//   expect(res_3.ok).toBe(true);
//   expect(res_4.ok).toBe(true);
// });

// test('checkPermission rejects students without valid id', async () => {
//   const res = await checkPermission({ id: 10, role: 'student' }, "10");
//   const res_2 = await checkPermission({ id: 1000000, role: 'student' }, 100000);
//   const res_3 = await checkPermission({ id: "abc456", role: 'student' }, "abc456 ");
//   const res_4 = await checkPermission({ id: "cde__456", role: 'student' }, "cde.456_");
//   const res_5 = await checkPermission({ id: "cde__456", role: 'a' }, "cde__456");

//   expect(res.ok).toBe(false);
//   expect(res_2.ok).toBe(false);
//   expect(res_3.ok).toBe(false);
//   expect(res_4.ok).toBe(false);
//   expect(res_5.ok).toBe(false);
// });

//end of check Permission

//start of get_student test
test('get_student should be available for those with admin', async () => {
  const result = await get_student({ id: "abc", role: 'admin' }, "abc");
  const result_2 = await get_student({ id: "abcd", role: 'admin' }, "abcd");

  expect(result.ok).toBe(true);
  expect(result_2.ok).toBe(true);
});

test('get_student should not be available for those without admin', async () => {
  const result = await get_student({ id: 10, role: 'student' }, 10);
  const result_2 = await get_student({ id: "cde12_", role: 'student' }, "cde12_");
  const result_3 = await get_student(null);
  const result_4 = await get_student({ id: "cde", role: 'student' }, "cde");
  const result_5 = await get_student({ id: "abc", role: 'admi' }, "abc");

  expect(result.ok).toBe(false);
  expect(result_2.ok).toBe(false);
  expect(result_3.ok).toBe(false);
  expect(result_4.ok).toBe(false);
  expect(result_5.ok).toBe(false);
});
//end of get_student
//start of createStudent test

test('createStudent should reject if the input is invalid', async () => {
  const result_1 = await createStudent({ name: '', major: 'something' });
  const result_2 = await createStudent({ name: 'B', major: '' });
  const result_3 = await createStudent({ name: '', major: '' });

  expect(result_1.ok).toBe(false);
  expect(result_2.ok).toBe(false);
  expect(result_3.ok).toBe(false);
});

test('createStudent should reject if there is a duplicate name', async () => {
  //should not have duplicate name
  repo.getAll.mockReturnValueOnce([{
    _id: "fake-id",
    name: "abc",
    major: "CS",
  }]);
  const test_a = await createStudent({ name: 'abc', major: 'CS' });

  expect(test_a.ok).toBe(false);
});

test('createStudent should accept if the input is valid', async () => {
  const result_1 = await createStudent({ name: 'PCA', major: 'CS' });
  const result_2 = await createStudent({ name: 'BCA', major: 'Math' });
  const result_3 = await createStudent({ name: 'Isomap', major: 'CS' });

  expect(result_1.ok).toBe(true);
  expect(result_1.value).toEqual({ id: 'fake-id', name: 'PCA', major: 'CS' });
  expect(result_2.ok).toBe(true);
  expect(result_2.value).toEqual({ id: 'fake-id', name: 'BCA', major: 'Math' });
  expect(result_3.ok).toBe(true);
  expect(result_3.value).toEqual({ id: 'fake-id', name: 'Isomap', major: 'CS' });
});

test('createStudent should accept if there is no duplicate', async () => {
  repo.getAll.mockReturnValueOnce([{
    _id: "fake-id",
    name: "abc",
    major: "CS",
  }]);
  const test_a = await createStudent({ name: 'bca', major: 'CS' });

  expect(test_a.ok).toBe(true);
  expect(test_a.value).toEqual({ id: 'fake-id', name: 'bca', major: 'CS' });
});

//end of createStudent

//test for updateStudent

test('updateStudent should accept changes if admin is doing it', async () => {
  repo.getAll.mockReturnValueOnce([{
    _id: "fake-id2",
    name: "abc",
    major: "CS",
  }]);
  repo.findById.mockReturnValueOnce({
    _id: "fake-id2",
    name: "abc",
    major: "CS",
  });
  repo.updateById.mockResolvedValueOnce({
    _id: "fake-id2",
    name: "abc",
    major: "Math",
  });

  const test_user = { id: "fake-id", role: "admin" };
  const res = await updateStudent("fake-id2", { name: "abc", major: "Math" }, test_user);

  expect(res.ok).toBe(true);
  expect(res.value).toEqual({
    id: "fake-id2",
    name: "abc",
    major: "Math",
  });
});

test('updateStudent if admin make no changes', async () => {
  repo.getAll.mockReturnValueOnce([{
    _id: "fake-id2",
    name: "abc",
    major: "CS",
  }]);
  repo.findById.mockReturnValueOnce({
    _id: "fake-id2",
    name: "abc",
    major: "CS",
  });
  repo.updateById.mockResolvedValueOnce({
    _id: "fake-id2",
    name: "abc",
    major: "CS",
  });

  const test_user = { id: "fake-id", role: "admin" };
  const res = await updateStudent("fake-id2", { name: "abc", major: "CS" }, test_user);

  expect(res.ok).toBe(true);
  expect(res.value).toEqual({
    id: "fake-id2",
    name: "abc",
    major: "CS",
  });
});

test('updateStudent should accept changes if that student is changing it', async () => {
  repo.getAll.mockReturnValueOnce([{
    _id: "fake-id2",
    name: "abc",
    major: "CS",
  }]);
  repo.findById.mockReturnValueOnce({
    _id: "fake-id2",
    name: "abc",
    major: "CS",
  });
  repo.updateById.mockResolvedValueOnce({
    _id: "fake-id2",
    name: "abc",
    major: "Math",
  });

  const test_user = { id: "fake-id2", role: "student" };
  const res = await updateStudent("fake-id2", { name: "abc", major: "Math" }, test_user);

  expect(res.ok).toBe(true);
  expect(res.value).toEqual({
    id: "fake-id2",
    name: "abc",
    major: "Math",
  });
});

test('updateStudent should accept changes if that student make no changes', async () => {
  repo.getAll.mockReturnValueOnce([{
    _id: "fake-id2",
    name: "abc",
    major: "CS",
  }]);
  repo.findById.mockReturnValueOnce({
    _id: "fake-id2",
    name: "abc",
    major: "CS",
  });
  repo.updateById.mockResolvedValueOnce({
    _id: "fake-id2",
    name: "abc",
    major: "CS",
  });

  const test_user = { id: "fake-id2", role: "student" };
  const res = await updateStudent("fake-id2", { name: "abc", major: "CS" }, test_user);

  expect(res.ok).toBe(true);
  expect(res.value).toEqual({
    id: "fake-id2",
    name: "abc",
    major: "CS",
  });
});

test('updateStudent should not accept changes if that student is changing it', async () => {
  repo.getAll.mockReturnValueOnce([{
    _id: "fake-id2",
    name: "abc",
    major: "CS",
  }]);
  repo.findById.mockReturnValueOnce({
    _id: "fake-id2",
    name: "abc",
    major: "CS",
  });
  repo.updateById.mockResolvedValueOnce({
    _id: "fake-id2",
    name: "abc",
    major: "Math",
  });

  const test_user = { id: "fake-id1", role: "student" };
  const res = await updateStudent("fake-id2", { name: "abc", major: "Math" }, test_user);

  expect(res.ok).toBe(false);
});

test('updateStudent should reject if invalid ID is entered even with admin changing it', async () => {
  repo.getAll.mockReturnValueOnce(null);
  repo.findById.mockResolvedValueOnce(null);

  const test_user = { id: "fake-id", role: "admin" };
  const res = await updateStudent("fake-id2", { name: "abc", major: "CS" }, test_user);
  expect(res.ok).toBe(false);
  expect(res.error.message).toBe("Student ID not found");
});

test('updateStudent should not work with missing field', async () => {
  repo.getAll.mockReturnValueOnce([{
    _id: "fake-id2",
    name: "abc",
    major: "CS",
  }]);
  repo.findById.mockReturnValue({
    _id: "fake-id2",
    name: "abc",
    major: "CS",
  });
  repo.updateById.mockResolvedValue({
    _id: "fake-id2",
    name: "abc",
    major: "Math",
  });

  const test_user = { id: "fake-id", role: "admin" };
  const res = await updateStudent("fake-id2", { name: "abc" }, test_user);
  const res_2 = await updateStudent("fake-id2", { major: "Math" }, test_user);

  expect(res.ok).toBe(false);
  expect(res_2.ok).toBe(false);
});

test('updateStudent should reject duplicate name', async () => {
  repo.getAll.mockReturnValueOnce([{
    _id: "fake-id",
    name: "abc",
    major: "CS",
  },
  {
    _id: "fake-id2",
    name: "def",
    major: "CS",
  }
  ]);
  repo.findById.mockReturnValueOnce({
    _id: "fake-id",
    name: "abc",
    major: "CS",
  });

  const test_user = { id: "fake-id", role: "admin" };
  const res = await updateStudent("fake-id", { name: "def", major: "Math" }, test_user);
  expect(res.ok).toBe(false);
});

test('updateStudent should reject when role is neither admin nor student', async () => {
  repo.getAll.mockReturnValueOnce([{
    _id: "fake-id",
    name: "abc",
    major: "CS",
  }]);
  repo.findById.mockReturnValueOnce({
    _id: "fake-id",
    name: "abc",
    major: "CS",
  });

  const test_user = { id: "fake-id2", role: "other" };
  const res = await updateStudent("fake-id", { name: "def", major: "Math" }, test_user);
  expect(res.ok).toBe(false);
});

//end of test for updateStudent

//start of deleteStudent test

test('deleteStudent accept delete from admin', async () => {
  repo.getAll.mockReturnValueOnce([{
    _id: "fake-id1",
    name: "abc",
    major: "CS",
  }]);
  repo.findById.mockReturnValueOnce({
    _id: "fake-id1",
    name: "abc",
    major: "CS",
  });

  const test_user = { id: "fake-id", role: "admin" };
  const res = await deleteStudent("fake-id1", test_user);

  expect(res.ok).toBe(true);
});

test('deleteStudent accept delete from the same student', async () => {
  repo.getAll.mockReturnValueOnce([{
    _id: "fake-id1",
    name: "abc",
    major: "CS",
  }]);
  repo.findById.mockReturnValueOnce({
    _id: "fake-id1",
    name: "abc",
    major: "CS",
  });

  const test_user = { id: "fake-id1", role: "student" };
  const res = await deleteStudent("fake-id1", test_user);
  const res_1 = await deleteStudent("fake-id2", test_user);

  expect(res.ok).toBe(false);
  expect(res_1.ok).toBe(false);
});

test('deleteStudent should reject if invalid student id is input', async () => {
  repo.getAll.mockReturnValueOnce([{
    _id: "fake-id1",
    name: "abc",
    major: "CS",
  }]);
  repo.findById.mockReturnValueOnce(null);

  const test_user = { id: "fake-id1", role: "admin" };
  const res = await deleteStudent("fake-id1", test_user);

  expect(res.ok).toBe(false);
});

//end of deleteStudent test

//start of get_student_by_id test

test('get_student_by_id should return true if id exists (only the student assigned to it can see)', async () => {
  repo.getAll.mockReturnValueOnce([{
    _id: "fake-id1",
    name: "abc",
    major: "CS",
  }]);
  repo.findById.mockReturnValueOnce([{
    _id: "fake-id1",
    name: "abc",
    major: "CS",
  }]);
  const test_user = { id: "fake-id1", role: "student" };
  const res = await get_student_by_id("fake-id1", test_user);
  expect(res.ok).toBe(true);
});

test('get_student_by_id should return false even if id exists when logged as a different user', async () => {
  repo.getAll.mockReturnValueOnce([{
    _id: "fake-id1",
    name: "abc",
    major: "CS",
  }]);
  repo.findById.mockReturnValueOnce([{
    _id: "fake-id1",
    name: "abc",
    major: "CS",
  }]);
  const test_user = { id: "fake-id2", role: "student" };
  const res = await get_student_by_id("fake-id1", test_user);
  expect(res.ok).toBe(false);
});

test('get_student_by_id should return true if they existed & being an admin', async () => {
  repo.getAll.mockReturnValueOnce([{
    _id: "fake-id1",
    name: "abc",
    major: "CS",
  }]);
  repo.findById.mockReturnValueOnce([{
    _id: "fake-id1",
    name: "abc",
    major: "CS",
  }]);
  const test_user = { id: "fake-id", role: "admin" };
  const res = await get_student_by_id("fake-id1", test_user);
  expect(res.ok).toBe(true);
});

test('get_student_by_id should return false if they do not exist & being an admin', async () => {
  repo.getAll.mockReturnValueOnce([{
    _id: "fake-id1",
    name: "abc",
    major: "CS",
  }]);
  repo.findById.mockReturnValueOnce(null);
  const test_user = { id: "fake-id", role: "admin" };
  const res = await get_student_by_id("fake-id2", test_user);
  expect(res.ok).toBe(false);
});

//end of get_student_by_id test
