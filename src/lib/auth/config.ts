import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      
      if (trigger === "update" && session) {
        token.role = session.role;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "admin" | "editor" | "viewer";
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [], 
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;
