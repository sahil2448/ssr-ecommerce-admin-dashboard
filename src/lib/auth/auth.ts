import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { z } from "zod";
import { authConfig } from "./config";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "admin" | "editor" | "viewer";
    } & DefaultSession["user"];
  }
  
  interface User {
    role: "admin" | "editor" | "viewer";
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = loginSchema.parse(credentials);
          
          await connectDB();
          
          const user = await User.findOne({ email }).select("+password");
          
          if (!user) {
            throw new Error("Invalid credentials");
          }
          
          if (!user.isActive) {
            throw new Error("Account is disabled");
          }
          
          const isPasswordValid = await user.comparePassword(password);
          
          if (!isPasswordValid) {
            throw new Error("Invalid credentials");
          }
          
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
          
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
    
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      if (account?.provider === "github") {
        try {
          await connectDB();
          
          const existingUser = await User.findOne({ email: user.email });
          
          if (existingUser) {
            user.id = existingUser._id.toString();
            user.role = existingUser.role;
            return true;
          }
          
          const userCount = await User.countDocuments();
          
          const newUser = await User.create({
            name: user.name || profile?.name || "GitHub User",
            email: user.email,
            password: Math.random().toString(36).slice(-12),
            role: userCount === 0 ? "admin" : "viewer",
            isActive: true,
            githubId: profile?.id,
          });
          
          user.id = newUser._id.toString();
          user.role = newUser.role;
          
          return true;
        } catch (error) {
          console.error("GitHub sign-in error:", error);
          return false;
        }
      }
      return true;
    },
  },
});
