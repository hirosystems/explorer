export const withApiServer = (apiServer: string) => (path?: string) =>
  path ? apiServer + path : apiServer;

export const IS_DEV = process.env.NODE_ENV !== 'production';
export const IS_STAGING = process.env.STAGING === 'enabled';
