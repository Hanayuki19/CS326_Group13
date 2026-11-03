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
const { validateInput, checkPermission, get_student, createStudent, updateStudent, deleteStudent, get_student_by_id } = await import("../services/StudentService.js");

afterEach(() => {
  repo.getAll.mockReset();
  repo.getAll.mockReturnValue([]);
  repo.findById.mockReset();
});

//start of test validateInput
test('validateInput accepts those with name and major', async () => {
  const result = await validateInput({ name: 'A', major: 'something' });
  expect(result.ok).toBe(true);
  //expect(result.error.status).toBe(400);
});

test('validateInput rejects those with only major', async () => {
  const result = await validateInput({ name: '', major: 'something' });
  expect(result.error.status).toBe(400);
});

test('validateInput rejects those with only name', async () => {
  const result = await validateInput({ name: 'B', major: '' });
  expect(result.error.status).toBe(400);
});

test('validateInput rejects those with no input name and major', async () => {
  const result = await validateInput({ name: '', major: '' });
  expect(result.error.status).toBe(400);
});

//end of test ValidateInput

//start of test checkPermission
test('checkPermission accepts all admins', async () => {
  const result = await checkPermission({ id: 10, role: 'admin' }, 10);
  const result_2 = await checkPermission({ id: 11, role: 'admin' }, 11);
  const result_3 = await checkPermission({ id: 12, role: 'admin' }, 12);
  const result_4 = await checkPermission({ id: "abc123", role: 'admin' }, "cde456");

  expect(result.ok).toBe(true);
  expect(result_2.ok).toBe(true);
  expect(result_3.ok).toBe(true);
  expect(result_4.ok).toBe(true);
});

test('checkPermission only accepts students with valid id', async () => {
  const res = await checkPermission({ id: 10, role: 'student' }, 10);
  const res_2 = await checkPermission({ id: 1000000, role: 'student' }, 1000000);
  const res_3 = await checkPermission({ id: "abc456", role: 'student' }, "abc456");
  const res_4 = await checkPermission({ id: "cde.456_", role: 'student' }, "cde.456_");

  expect(res.ok).toBe(true);
  expect(res_2.ok).toBe(true);
  expect(res_3.ok).toBe(true);
  expect(res_4.ok).toBe(true);
});

test('checkPermission rejects students without valid id', async () => {
  const res = await checkPermission({ id: 10, role: 'student' }, "10");
  const res_2 = await checkPermission({ id: 1000000, role: 'student' }, 100000);
  const res_3 = await checkPermission({ id: "abc456", role: 'student' }, "abc456 ");
  const res_4 = await checkPermission({ id: "cde__456", role: 'student' }, "cde.456_");
  const res_5 = await checkPermission({ id: "cde__456", role: 'a' }, "cde__456");

  expect(res.ok).toBe(false);
  expect(res_2.ok).toBe(false);
  expect(res_3.ok).toBe(false);
  expect(res_4.ok).toBe(false);
  expect(res_5.ok).toBe(false);
});

//end of check Permission

//start of get_student test
test('get_student should be available for those with admin', async () => {
  const result = await get_student({ id: 10, role: 'admin' }, 10);
  const result_2 = await get_student({ id: 11, role: 'admin' }, 11);

  expect(result.ok).toBe(true);
  expect(result_2.ok).toBe(true);
});

test('get_student should not be available for those without admin', async () => {
  const result = await get_student({ id: 10, role: 'student' }, 10);
  const result_2 = await get_student({ id: 11, role: 'student' }, 12);
  const result_3 = await get_student(null);
  const result_4 = await get_student({ id: 11, role: 'student' }, 11);
  const result_5 = await get_student({ id: 11, role: 'admi' }, 11);

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
  expect(result_2.ok).toBe(true);
  expect(result_3.ok).toBe(true);
});

test('createStudent should accept if there is no duplicate', async () => {
  repo.getAll.mockReturnValueOnce([{
    _id: "fake-id",
    name: "abc",
    major: "CS",
  }]);
  const test_a = await createStudent({ name: 'bca', major: 'CS' });

  expect(test_a.ok).toBe(true);
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

  const test_user = { id: "fake-id", role: "admin" };
  const res = await updateStudent("fake-id2", { name: "abc", major: "Math" }, test_user);

  expect(res.ok).toBe(true);
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

  const test_user = { id: "fake-id2", role: "student" };
  const res = await updateStudent("fake-id2", { name: "abc", major: "Math" }, test_user);

  expect(res.ok).toBe(true);
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

  const test_user = { id: "fake-id1", role: "student" };
  const res = await updateStudent("fake-id2", { name: "abc", major: "CS" }, test_user);

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
