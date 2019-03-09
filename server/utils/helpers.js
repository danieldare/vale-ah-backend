import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import env from '../config/env-config';
import db from '../models';

const { SECRET, UI_CLIENT_HOST, HEROKU_APP_NAME } = env;

const API_SERVER_HOST = HEROKU_APP_NAME
  ? `https://${HEROKU_APP_NAME}.herokuapp.com`
  : env.API_SERVER_HOST;

/**
 * Synchronously sign the given payload into a JSON Web Token string
 * @param {string | number | Buffer} payload payload to sign
 * @param {string | number} expiresIn expressed in seconds or a string describing a
 * time span. Eg: 60, "2 days", "10h", "7d"
 * @returns {string} JWT token
 */
export const generateToken = (payload, expiresIn = '7d') =>
  jwt.sign(payload, SECRET, { expiresIn });

/**
 * Synchronously verify given JWT token
 * @param {string} token JWT token
 * @returns {string | object} decoded JWT payload
 */
export const verifyToken = token => jwt.verify(token, SECRET);

/**
 * Sends a success response to the client
 * @param {Response} res Response object
 * @param {object} data data to send
 * @param {number} statusCode status code
 * @returns {Response} success response
 */
export const successResponse = (res, data, statusCode = 200) =>
  res.status(statusCode).json(data);

/**
 * Sends an error response to the client
 * @param {Response} res Response object
 * @param {Array} errors error messages
 * @param {number} statusCode status code
 * @returns {Response} error response
 */
export const errorResponse = (
  res,
  errors = ['An error ocurred'],
  statusCode = 500
) =>
  res
    .status(statusCode)
    .json({ errors: errors instanceof Array ? errors : [errors] });

/**
 * Sends a validation error response to the user
 * @param {Response} res Response object
 * @param {Array} errorDetails array of error details
 * @returns {undefined}
 */
export const validationErrorResponse = (res, errorDetails = []) => {
  const errors = errorDetails.reduce((acc, e) => {
    const { key } = e.context;
    if (acc[key]) {
      acc[key].push(e.message.replace(`"${key}" `, ''));
    } else {
      acc[key] = [e.message.replace(`"${key}" `, '')];
    }
    return acc;
  }, {});
  res.status(400).json({ errors });
};

/**
 * Hashes a password
 * @param {string} password password to encrypt
 * @returns {string} encrypted password
 */
export const hashPassword = password => bcrypt.hashSync(password, 10);

/**
 * Compares a password with a given hash
 * @param {string} password
 * @param {string} hash
 * @returns {boolean} match?
 */
export const comparePassword = (password, hash) =>
  bcrypt.compareSync(hash, password);

/**
 * Validates a value using the given Joi schema
 * @param {object} value
 * @param {Joi.SchemaLike} schema
 * @returns {Promise} Validation result
 */
export const validate = (value, schema) =>
  Joi.validate(value, schema, { abortEarly: false, allowUnknown: true });

/**
 * Generate a user account verification link
 * @param {string} token Verification token
 * @returns {URL} Verification url
 */
export const generateVerificationLink = token =>
  UI_CLIENT_HOST
    ? `${UI_CLIENT_HOST}/users/verify/?token=${token}`
    : `${API_SERVER_HOST}/api/users/verify/?token=${token}`;
