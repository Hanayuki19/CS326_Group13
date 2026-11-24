import "dotenv/config";
import mongoose from "mongoose";
import { readFile, writeFile } from "node:fs/promises";
import bcrypt from "bcrypt";
import { Member } from "./repositories/mainRepository.js";
import Credentials from "./models/credentialModel.js";
import { Student } from "./repositories/StudentRepository.js";
// import { None } from "./result.js";

const raw_members = await readFile("./member.json", "utf8");
const members = JSON.parse(raw_members);

const raw_credentials = await readFile("./credentials.json", "utf8");
const credentials = JSON.parse(raw_credentials);

const raw_students = await readFile("./student.json", "utf8");
const students = JSON.parse(raw_students);

const run = async () => {
  const CONNECT_MONGO = process.env.MONGODB_URI;
  if (!CONNECT_MONGO) {
    console.log("MONGO_URI is missing.");
    process.exit(1);
  }

  await mongoose.connect(
    CONNECT_MONGO
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
      const { Username, FullName, Major, role } = credentials[i];
      let Password;
      if (role === "admin") Password = process.env.Admin_password;
      else Password = process.env.Student_password;
      const passwordHash = await bcrypt.hash(Password, 10);
      const new_credential = {
        Username,
        passwordHash,
        FullName,
        Major,
        role,
        _id: id,
      };

      await Credentials.create(new_credential);
    }
    if (i < students.length) {
      await Student.create({ ...students[i], _id: id });
    }
  }
  console.log(`Seeded ${count} credentials and students.`);
  await mongoose.disconnect();
};

run();
