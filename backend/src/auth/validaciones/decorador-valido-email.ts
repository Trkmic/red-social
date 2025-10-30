import { registerDecorator, ValidationOptions } from 'class-validator';
import { ValidadorEmail } from './valida-email';

export function DecoradorValidoEmail(opcionesValidacion?: ValidationOptions) {
    return function (objeto: Object, nombrePropiedad: string) {
        registerDecorator({
        target: objeto.constructor,
        propertyName: nombrePropiedad,
        options: opcionesValidacion,
        constraints: [],
        validator: ValidadorEmail,
        });
    };
}
