import { Response, Request, NextFunction } from 'express';
import { RESPONSE_CODES } from '../config/constants';
import { verifyAccessToken } from '../utils/jwt';
import { initLogger, logError, logInfo } from './logger';
import { CustomRequest } from '../interfaces/commonInterfaces';
import { RESPONSE_MESSAGES } from '../utils/responseMessage';
import { userDetail } from '../services/userServices';

interface LogObject {
  ip: string;
  headers: string | string[];
  method: string;
  url: string;
  timestamp: number;
  user?: any; // Adjust the type based on your user object structure
}

export const authMiddleWare = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await initLogger();
    const apiPrefix = '/api_v1';
    const ignorePaths = [`${apiPrefix}/auth/login`, `${apiPrefix}/country/all`, `${apiPrefix}/auth/forgot-password`, `${apiPrefix}/auth/check-email`, `${apiPrefix}/auth/send-otp`, `${apiPrefix}/auth/verify-otp`, `${apiPrefix}/auth/profile`, `${apiPrefix}/auth/reset-password`, `${apiPrefix}/user/register`, `${apiPrefix}/user/addJobPreferences`, `${apiPrefix}/stripe/webhook`, `${apiPrefix}/categories/all`, `${apiPrefix}/categories/add`, `${apiPrefix}/company/all`, `${apiPrefix}/technology/add`, `${apiPrefix}/technology/all`,];
    const { method, headers, originalUrl } = req;


    const ip: string = Array.isArray(req.headers['x-forwarded-for'])
      ? req.headers['x-forwarded-for'][0]
      : req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';

    const headersValue: string | string[] = (req.headers as unknown) as string | string[] || '';


    const logObj: LogObject = {
      ip,
      headers: headersValue,
      method: req.method,
      url: req.originalUrl,
      timestamp: Date.now(),
    };
    
    const ignoreIndex = ignorePaths.findIndex((item) =>  originalUrl.split('?')[0].includes(item));
        
    if (ignoreIndex > -1) {
      return next();
    }

    if (!headers.authorization) {
      res.status(RESPONSE_CODES.UNAUTHORIZED).json({ error: RESPONSE_MESSAGES.missingAuthToken });
      return;
    }

    const userInfo: any = await verifyAccessToken(req);
    if (userInfo.status) {

      userInfo.data.type = "id";
      const checkUser = await userDetail(userInfo.data);

      if (checkUser?.data?.status) {
        logInfo('Activity Log: ', logObj);
        return next();
      } else {
        if (checkUser.status) {
          const responsePayload = {
            status: 0,
            status_code: RESPONSE_CODES.UNAUTHORIZED,
            message: RESPONSE_MESSAGES.inactiveUser,
          };
          res.status(responsePayload.status_code).json(responsePayload);
          return
        } else{
          checkUser.message = RESPONSE_MESSAGES.unauthorized;
          checkUser.status_code= RESPONSE_CODES.UNAUTHORIZED;
          res.status(RESPONSE_CODES.UNAUTHORIZED).json(checkUser);
          return
        }
      }



    } else {
      res.status(userInfo.status_code).json(userInfo);
      return
    }

  } catch (error) {
    logError('Error in authMiddleware: ', error as Record<string, any>);
    res.status(RESPONSE_CODES.UNAUTHORIZED).json({ error });
    return
  }
};
