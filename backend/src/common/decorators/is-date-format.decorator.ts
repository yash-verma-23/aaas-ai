import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

@ValidatorConstraint({ name: 'isDateFormat', async: false })
class IsDateFormatValidator implements ValidatorConstraintInterface {
  validate(value: string) {
    // Validate if a string is a valid date in 'YYYY-MM-DD' format
    return dayjs(value, 'YYYY-MM-DD', true).isValid();
  }

  defaultMessage({ property }: ValidationArguments) {
    return `Invalid date format. ${property} should be in YYYY-MM-DD format.`;
  }
}

/**
 * Custom decorator to validate if a string is a valid date in 'YYYY-MM-DD' format.
 * Prefer this over `@IsDateString()` from `class-validator` as it cannot ensure 'YYYY-MM-DD' format.
 */
export const IsDateFormat =
  (validationOptions?: ValidationOptions) =>
  (obj: object, propertyName: string) => {
    registerDecorator({
      target: obj.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDateFormatValidator,
    });
  };
