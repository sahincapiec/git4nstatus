import ISanitizer from "./sanitizer.interface";

export default class Sanitizer implements ISanitizer {
    sanitizeKeys = <T, U>(object: T) => {
        const result: any = {};
        for (const key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                const sanitizedKey = key.replace(/[.]/g, "_");
                if (typeof object[key] === 'object') {
                    result[sanitizedKey] = this.sanitizeKeys(object[key]);
                } else {
                    result[sanitizedKey] = object[key];
                }
            }
        }
        return result as U;
    };
}