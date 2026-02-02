import { DefaultSession } from "next-auth";

type AppUserRole = "USER" | "ADMIN" | "ANALYST";
type AppUserStatus = "ACTIVE" | "INACTIVE";

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      role?: AppUserRole;
      status?: AppUserStatus;
    };
  }

  interface User {
    role?: AppUserRole;
    status?: AppUserStatus;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: AppUserRole;
    status?: AppUserStatus;
  }
}
