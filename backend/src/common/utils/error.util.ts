/**
 * Creates an object with a message and errors.
 * Useful for cases when more details are needed in the error response.
 */
export const createError = (message: string, errorDetails: unknown) => {
  return {
    message,
    errorDetails,
  };
};
