import { Request } from 'express';

/** Extracts the Bearer token from the Authorization header of an HTTP request */
export const extractTokenFromHeader = (
  request: Request,
): string | undefined => {
  const [type, token] = request.headers['authorization']?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
};
