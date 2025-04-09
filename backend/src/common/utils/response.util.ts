import { Pagination } from './pagination.util';

/** Returns a general API response */
export const generalResponse = (message: string, data?: object) => {
  return {
    message,
    data,
  };
};

/** Returns an API response based on the provided data and optional pagination metadata. */
export const getResponse = <T>(data: T, meta?: Pagination) => {
  return {
    message: 'success',
    data,
    meta,
  };
};
