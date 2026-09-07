import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Database Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
          include: { organization: true },
        });

        if (!user) {
          throw new Error("Invalid email or password.");
        }

        // Plain text comparison per user request: "dont hash password for now"
        if (user.password !== credentials.password) {
          throw new Error("Invalid email or password.");
        }

        if (user.status === "INACTIVE" || user.status === "OFFBOARDED") {
          throw new Error("Account has been deactivated. Contact your HR administrator.");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          organizationId: user.organizationId,
          department: user.department,
          designation: user.designation,
          avatar: user.avatar,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as unknown as { role: string }).role;
        token.organizationId = (user as unknown as { organizationId: string }).organizationId;
        token.department = (user as unknown as { department: string }).department;
        token.designation = (user as unknown as { designation: string }).designation;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const customUser = session.user as unknown as {
          id: string;
          role: string;
          organizationId: string;
          department: string;
          designation: string;
        };
        customUser.id = token.id as string;
        customUser.role = token.role as string;
        customUser.organizationId = token.organizationId as string;
        customUser.department = token.department as string;
        customUser.designation = token.designation as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "crewsync_enterprise_jwt_secret_2026_secure_key",
};
