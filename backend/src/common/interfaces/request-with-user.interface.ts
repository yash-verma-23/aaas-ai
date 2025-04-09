import { Request } from 'express';
import { JwtPayload } from './jwt-payload.interface';

/** HTTP request object with user */
export interface RequestWithUser extends Request {
  user?: JwtPayload;
  rawBody?: string;
}
