import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { z } from "zod";

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    await connectDB();

const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) {
        return NextResponse.json(
            { error: "Email already registered" },
            { status: 400 }
        );
        }

        const userCount = await User.countDocuments();

            const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            role: userCount === 0 ? "admin" : "viewer",
            isActive: true,
        });


    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Registration failed" },
      { status: 500 }
    );
  }
}
