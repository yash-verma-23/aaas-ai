import { v4 as uuidV4 } from 'uuid';

/**
 * Generate a version 4 UUID
 */
export const uuid = () => {
  return uuidV4();
};
