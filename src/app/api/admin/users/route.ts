import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  const session = await auth();
  
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  
  const users = await User.find().select("-password").sort({ createdAt: -1 }).lean();
  
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const session = await auth();
  
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  
  const { name, email, password, role } = await request.json();
  
  const existing = await User.findOne({ email: email.toLowerCase() });
  
  if (existing) {
    return NextResponse.json({ error: "Email already exists" }, { status: 400 });
  }
  
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role,
    isActive: true,
  });
  
  return NextResponse.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
  }, { status: 201 });
}
