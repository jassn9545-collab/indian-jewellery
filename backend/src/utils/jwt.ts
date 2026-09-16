import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { CustomRequest } from '../interfaces/commonInterfaces';
import { RESPONSE_CODES } from '../config/constants';
import { RESPONSE_MESSAGES } from './responseMessage';

/** Claims we put into the access token. `id` is the users.id primary key (int). */
interface User {
  id?: number;
  email?: string;
  name?: string;
  [key: string]: any;
}
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "your-access-secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret";

const generateToken = (user: User): string => {

  return jwt.sign(user, ACCESS_TOKEN_SECRET as string, { expiresIn: '1h' });
};

const refreshToken = (user: User): string => {
  return jwt.sign({ user }, REFRESH_TOKEN_SECRET as string, { expiresIn: '7d' });
};

const verifyAccessToken = (req: CustomRequest): User | null => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const verifyAccessToken = jwt.verify(token, ACCESS_TOKEN_SECRET as string);
      if (verifyAccessToken) {
        req.user = verifyAccessToken;
        return {
          status: 1,
          status_code: RESPONSE_CODES.GET,
          message: RESPONSE_MESSAGES.tokenVerified,
          data: verifyAccessToken
        };
      };
    };
    return null;
  } catch (error) {
    return {
      status: 0,
      status_code: RESPONSE_CODES.UNAUTHORIZED,
      message: RESPONSE_MESSAGES.invalidToken
    }
  }
};

const verifyRefreshToken = (req: CustomRequest): User | null => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const verifyRefreshToken = jwt.verify(token, REFRESH_TOKEN_SECRET as string);
      if (verifyRefreshToken) {
        req.user = verifyRefreshToken;
        return {
          status: 1,
          status_code: RESPONSE_CODES.GET,
          message: RESPONSE_MESSAGES.tokenVerified,
          data: verifyRefreshToken
        };
      };
    };
    return null;
  } catch (error) {
    return {
      status: 0,
      status_code: RESPONSE_CODES.UNAUTHORIZED,
      message: RESPONSE_MESSAGES.invalidToken
    }
  }
};

const generateHash = async (text: string): Promise<string> => {
  const hash = await bcrypt.hash(text, 10);
  return hash;
};

export {
  verifyAccessToken,
  generateToken,
  refreshToken,
  generateHash
};
