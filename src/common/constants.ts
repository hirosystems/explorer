export const API_SERVER = process.env.API_SERVER || 'http://localhost:3999';

export const withApiServer = (path?: string) => (path ? API_SERVER + path : API_SERVER);
