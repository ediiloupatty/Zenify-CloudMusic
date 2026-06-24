import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Demo Login",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "demo" },
        password: { label: "Password", type: "password", placeholder: "demo" }
      },
      async authorize(credentials) {
        // For tracer bullet / demo purposes, allow any login with 'demo' / 'demo'
        if (credentials?.username === "demo" && credentials?.password === "demo") {
          return { id: "1", name: "Demo User", email: "demo@focus-stream.com" };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
});
