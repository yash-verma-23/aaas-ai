import { Transform, TransformFnParams } from 'class-transformer';
import { applyDecorators, BadRequestException } from '@nestjs/common';
import { IsBoolean } from 'class-validator';

const handleTranformToBoolean = ({ key, value }: TransformFnParams) => {
  if (value === 'true' || value === '1') {
    return true;
  }
  if (value === 'false' || value === '0') {
    return false;
  }
  throw new BadRequestException(`${key} must be a boolean string`);
};

/**
 * A custom decorator that transforms a string value to boolean.
 * Throws a BadRequestException if the value is not 'true', 'false', '1' or '0'.
 */
export const TransformToBoolean = () => {
  return applyDecorators(Transform(handleTranformToBoolean), IsBoolean());
};
