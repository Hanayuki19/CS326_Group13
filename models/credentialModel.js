import mongoose from "mongoose";

const credentialSchema = new mongoose.Schema(
  {
    Username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    FullName: { type: String, required: true },
    Major: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
  },
  { timestamps: true }
);

export default mongoose.model("Credentials", credentialSchema);
