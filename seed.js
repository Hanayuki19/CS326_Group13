import mongoose from "mongoose";
import { readFile, writeFile } from "node:fs/promises";
import bcrypt from 'bcrypt';
import { Member, Credentials } from "./repositories/mainRepository.js";
import { Student } from "./repositories/StudentRepository.js";

const raw_members = await readFile("./member.json", "utf8");
const members = JSON.parse(raw_members);

const raw_credentials = await readFile("./credentials.json", "utf8");
const credentials = JSON.parse(raw_credentials);

const raw_students = await readFile("./student.json", "utf8");
const students = JSON.parse(raw_students);

const run = async () => {
  await mongoose.connect(
    process.env.MONGODB_URI ||
    "mongodb://dev:devpassword@mongo:27017/devdb?authSource=admin",
  );

  await Member.deleteMany({});
  await Member.insertMany(members);

  console.log(`Seeded ${members.length} members.`);

  await Credentials.deleteMany({});
  await Student.deleteMany({});

  const count = Math.max(credentials.length, students.length);
  for (let i = 0; i < count; i++) {
    const id = new mongoose.Types.ObjectId();

    if (i < credentials.length) {
      const { Username, Password, FullName, Major, role } = credentials[i];
      const passwordHash = await bcrypt.hash(Password, 10);
      const new_credential = {
        Username,
        passwordHash,
        FullName,
        Major,
        role,
        _id: id
      };

      await Credentials.create(new_credential);
    }
    if (i < students.length) {
      await Student.create({ ...students[i], _id: id });
    }
  }
  console.log(
    `Seeded ${count} credentials and students.`,
  );
  await mongoose.disconnect();
};

run();
