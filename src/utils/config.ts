export const jwtSecret = process.env.JWT_SECRET;
export const env = process.env.ENVIRONMENT;

export const BASE_URL =
  env == 'production' ? 'https://iteespot.ikapo.fi' : 'http://localhost:3000';
