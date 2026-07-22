export const jwtSecret = process.env.JWT_SECRET;
export const env = process.env.ENVIRONMENT;

export const BASE_URL =
  env == 'production' ? 'https://iteespot.ikapo.fi' : 'http://localhost:3000';

export const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

export const githubClient = process.env.GITHUB_CLIENT_ID;
export const githubSecret = process.env.GITHUB_CLIENT_SECRET;
export const githubCallBackUrl = process.env.GITHUB_CALLBACK_URL;
export const frontendUrl = process.env.FRONTEND_URL;

export const r2Account = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
export const r2BucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
export const r2PublicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL;
export const r2Secret = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
export const r2Client = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;