import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: false })
export class ValidadorEmail implements ValidatorConstraintInterface {
    validate(email: string) {
        return /@(gmail\.com|outlook\.com|hotmail\.com|yahoo\.com)$/i.test(email);
    }

    defaultMessage() {
        return 'El email debe ser de Gmail, Outlook, Yahoo o Hotmail';
    }
}