import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { cpf } from 'cpf-cnpj-validator';

@ValidatorConstraint({ name: 'isCpf', async: false })
export class IsCpf implements ValidatorConstraintInterface {
  validate(
    cpfValue: string,
    validationArguments: ValidationArguments,
  ): Promise<boolean> | boolean {
    return cpf.isValid(cpfValue);
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return 'Invalid CPF. Please enter a valid CPF.';
  }
}
