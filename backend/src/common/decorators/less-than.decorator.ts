import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'lessThan', async: false })
class LessThanValidator implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    // Validate if a number is strictly less than a given maxValue
    const [maxValue] = args.constraints;
    return (
      typeof value === 'number' &&
      typeof maxValue === 'number' &&
      value < maxValue
    );
  }

  defaultMessage({ constraints, property }: ValidationArguments) {
    const [maxValue] = constraints;
    return `${property} should be less than ${maxValue}.`;
  }
}

/** Custom decorator to validate if a number is strictly less than a given maxValue */
export const LessThan =
  (maxValue: number, validationOptions?: ValidationOptions) =>
  (obj: object, propertyName: string) => {
    registerDecorator({
      target: obj.constructor,
      propertyName,
      options: validationOptions,
      constraints: [maxValue],
      validator: LessThanValidator,
    });
  };
