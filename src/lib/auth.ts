import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

export const authConfig = {
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/admin/login"
  },
  session: {
    strategy: "jwt"
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");

        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email }
        });

        if (!user || !verifyPassword(password, user.passwordHash)) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.email
        };
      }
    })
  ],
  callbacks: {
    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;

      if (pathname.startsWith("/admin/login")) {
        return true;
      }

      if (pathname.startsWith("/admin")) {
        return Boolean(auth?.user);
      }

      return true;
    }
  }
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
