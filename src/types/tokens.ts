export interface SignedAccessToken {
  username: string;
  id: string;
  displayName: string | null;
}

export interface SignedRefreshToken {
  sessionId: string;
  userId: string;
  jti: string;
}
