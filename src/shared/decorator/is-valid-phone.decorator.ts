import { registerDecorator, ValidationOptions } from "class-validator";
import { PhoneNumberUtil } from "google-libphonenumber";

const phoneUtil = PhoneNumberUtil.getInstance();

export function IsValidPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isValidPhoneNumber",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value) {
          if (typeof value !== "string") return false;

          try {
            const phoneNumber = phoneUtil.parse(value);
            return phoneUtil.isValidNumber(phoneNumber);
          } catch (e) {
            return false;
          }
        },
        defaultMessage() {
          return "Le numéro de téléphone doit être un numéro valide.";
        },
      },
    });
  };
}
