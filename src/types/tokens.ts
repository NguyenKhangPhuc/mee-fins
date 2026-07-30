import { USER_ROLE } from "src/generated/prisma/enums";

export interface SignedAccessToken {
  username: string;
  id: string;
  displayName: string | null;
  role: USER_ROLE;
}

export interface SignedRefreshToken {
  sessionId: string;
  userId: string;
  jti: string;
}
