import { Transform, TransformFnParams } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

const tranformCsvToStringArray = ({ key, value }: TransformFnParams) => {
  if (typeof value !== 'string') {
    throw new BadRequestException(
      `${key} must be a string or a comma-separated string`,
    );
  }

  if (value.length === 0) {
    throw new BadRequestException(`${key} cannot be empty`);
  }

  return value.split(',');
};

/**
 * A custom decorator that transforms a comma-separated value (CSV) string to a string array.
 * Useful for transforming query parameters having multiple values.
 */
export const TranformToStringArray = () => {
  return Transform(tranformCsvToStringArray);
};
