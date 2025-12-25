import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: "admin" | "editor" | "viewer";
  isActive: boolean;
  githubId?: string;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "editor", "viewer"],
    default: "viewer",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  githubId: {
    type: String,
    sparse: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


UserSchema.pre<IUser>("save", async function (this: IUser) {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
