import Joi from 'joi';



export const user_register_schema = Joi.object({
  name: Joi.string().required().messages({ 'any.required': 'Name is required.' }),
  number: Joi.string().required().messages({ 'any.required': 'Number is required.' }),
  country: Joi.string().required().messages({ 'any.required': 'Country is required.' }),
  DOB: Joi.string().required().messages({ 'any.required': 'DOB is required.' }),
  email: Joi.string().email().required().messages({ 'any.required': 'Email is required.' }),
  password: Joi.string().min(8)
    .pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()-=_+:;"'{}|[\]<>/?.,`~]).*$/)
    .messages({
      'string.base': 'Password must be a string',
      'string.empty': 'Password cannot be empty',
      'string.min': 'Password must be at least {#limit} characters long',
      'string.max': 'Password cannot be longer than {#limit} characters',
      'string.pattern.base': 'Password must include at least one letter, one digit, and one special character',
    }).required(),
});