export default interface ISanitizer {
    sanitizeKeys: <T, U>(object: T) => U,
}