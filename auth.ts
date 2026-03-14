import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      // Hint the Google picker to show @wix.com accounts first.
      // Security enforcement is done in the signIn callback below.
      authorization: { params: { hd: "wix.com" } },
    }),
  ],
  callbacks: {
    signIn({ account, profile }) {
      if (account?.provider === "google" && profile) {
        return (
          profile.email_verified === true &&
          typeof profile.email === "string" &&
          profile.email.endsWith("@wix.com")
        )
      }
      return false
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
})
