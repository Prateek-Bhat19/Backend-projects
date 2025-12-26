import { Schema, model, Document } from "mongoose";
import { Role } from "../types/role";

export interface IUser extends Document {
  email: string;
  password: string;
  role: Role;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);