import { Response } from 'express';

import { RESPONSE_CODES } from '../config/constants';
import {  userDetail, userRegisterService } from '../services/userServices';
import { RESPONSE, CustomRequest } from '../interfaces/commonInterfaces';
import { RESPONSE_MESSAGES } from '../utils/responseMessage';


// User registration
export const userRegisterController = async (req: CustomRequest, res: Response) => {
  try {
    const body: any = req.body;
    let response: RESPONSE;

    const userEmail: any = await userDetail(body);
    if (userEmail.status) {
      response = {
        status: 0,
        status_code: RESPONSE_CODES.ALREADY_EXIST,
        message: RESPONSE_MESSAGES.emailAlreadyExist,
      };
      return res.status(response.status_code).json(response);
    }

    response = await userRegisterService(body);

    return res.status(response.status_code).json(response);
  } catch (error) {
    return res.status(RESPONSE_CODES.ERROR).json({
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    });
  }
};