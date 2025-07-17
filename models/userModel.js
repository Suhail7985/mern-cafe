import mongoose from "mongoose";
const userSchema = mongoose.Schema(
  {
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    status   : { type: String, enum: ["active", "inactive"], default: "active" },
    role: { type: String, default: "user" },
    phoneNo: { type: String },
    
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);