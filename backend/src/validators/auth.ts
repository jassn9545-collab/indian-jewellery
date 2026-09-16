import Joi from 'joi';

export const auth_login_schema = Joi.object({
  email: Joi.string().email().required().messages({ 'any.required': 'Email is required.', }),
  password: Joi.string().required().messages({ 'any.required': 'Password is required.' }),
});