export default class BaseValidator {
  public messages = {
    minLength: '{{ field }} must be at least {{ options.minLength }} characters long',
    maxLength: '{{ field }} must be less then {{ options.maxLength }} characters long',
    required: '{{ field }} is required',
    unique: '{{ field }} must be unique, and this value is already taken',
    email: '{{ field }} is not a valid email',
  }
}
