export const jwtSecret = process.env.JWT_SECRET;
export const env = process.env.ENVIRONMENT;


export const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

export const githubClient = process.env.GITHUB_CLIENT_ID;
export const githubSecret = process.env.GITHUB_CLIENT_SECRET;
export const githubCallBackUrl = process.env.GITHUB_CALLBACK_URL;
export const frontendUrl = process.env.FRONTEND_URL;
export const cookieDomain = process.env.COOKIE_DOMAIN;

export const r2Account = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
export const r2BucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;
export const r2PublicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL;
export const r2Secret = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
export const r2Client = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;

export const livekitApiKey = process.env.LIVEKIT_API_KEY || 'devkey';
export const livekitApiSecret = process.env.LIVEKIT_API_SECRET || 'secretsecretsecretsecretsecret32';
export const livekitUrl = process.env.LIVEKIT_URL || 'http://localhost:7880';

export const resendApiKey = process.env.RESEND_API_KEY;
export const fromAddress = process.env.MAIL_FROM ?? "App Name <onboarding@resend.dev>";