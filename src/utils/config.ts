export const jwtSecret = process.env.JWT_SECRET;
export const env = process.env.ENVIRONMENT;

export const BASE_URL =
  env == 'production' ? 'https://iteespot.ikapo.fi' : 'http://localhost:3000';

export const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

export const githubClient = process.env.GITHUB_CLIENT_ID;
export const githubSecret = process.env.GITHUB_CLIENT_SECRET;
export const githubCallBackUrl = process.env.GITHUB_CALLBACK_URL;
export const frontendUrl = process.env.FRONTEND_URL;
