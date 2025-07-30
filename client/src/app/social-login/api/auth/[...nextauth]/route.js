import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
          
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.NEXT_FACEBOOK_CLIENT_ID,
      clientSecret: process.env.NEXT_FACEBOOK_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "email", // Request email permission
        },
      },
      profile(profile) {
        console.log("Facebook Profile:", profile); // Log the profile object
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email || null, // Handle cases where email might be null
          image: profile.picture.data.url, // Adjust based on the response structure
        };
      },
    }),
    // Auth0({
    //   async profile(profile) {
    //     console.log("Auth0 Profile:", profile);
    //     return {
    //       id: profile.sub,
    //       name: profile.nickname,
    //       email: profile.email,
    //       image: profile.picture,
    //     };
    //   },
    // }),
  ],

  callbacks: {
    async jwt({ token, user, account, profile }) {
      console.log("JWT Callback - token:", token);
      console.log("JWT Callback - user:", user);
      console.log("JWT Callback - account:", account);
      console.log("JWT Callback - profile:", profile);

      if (account) {
        token.provider = account.provider; // e.g., 'google' or 'facebook'
        token.id = user.id; // User ID from the profile

        // If the provider is Facebook, fetch the email using the Graph API
        if (account.provider === 'facebook') {
          const res = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${account.accessToken}`);
          const fbProfile = await res.json();
          token.email = fbProfile.email || null; // Set email from Graph API
        } else {
          token.email = profile.email || null; // Set email from profile if available
        }

        token.name = profile.name || user.name; // Use user.name as a fallback
      }

      return token;
    },
    async session({ session, token }) {
      console.log("Session Callback - session:", session);
      console.log("Session Callback - token:", token);

      session.user.id = token.id; // Add user ID to session
      session.user.email = token.email; // Add user email to session
      session.user.name = token.name; // Add user name to session
      session.user.provider = token.provider; // Add provider to session
      return session;
    },
  },
  debug: true,
});

// Export the handler for GET and POST requests
export { handler as GET, handler as POST };
