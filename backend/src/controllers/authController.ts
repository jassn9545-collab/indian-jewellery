import { Request, Response } from "express";

import { RESPONSE_CODES, USER_STATUS, USER_TYPE } from "../config/constants";
import { comparePassword } from "../services/authServices";
import { updateUserService, userDetail } from "../services/userServices";
import { RESPONSE } from "../interfaces/commonInterfaces";
import { generateToken, refreshToken } from "../utils/jwt";

// User login
export const authLogin = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    let response: RESPONSE;

    const userEmail: any = await userDetail(body);

    if (!userEmail.status) {
      response = {
        status: userEmail.status,
        status_code: RESPONSE_CODES.NOT_FOUND,
        message: userEmail.message,
      };
      return res.status(response.status_code).json(response);
    }

    const userInfo = userEmail.data;

    body.userPassword = userInfo?.password;
    body.id = userInfo?.id;
    body.name = userInfo?.name;
    body.type = userInfo?.type;

    response = await comparePassword(body);

    if (response.status) {
      delete userInfo.password;
      delete userInfo.refreshToken;

      if (userInfo.type == USER_TYPE.admin || (userInfo.type == USER_TYPE.user && userInfo.status == USER_STATUS.active)) {
        const access_Token = generateToken({
          email: userInfo.email,
          id: userInfo.id,
          name: userInfo.name,
        });

        const refresh_token = refreshToken({
          id: userInfo.id,
        });

        userInfo.access_Token = access_Token;
        userInfo.refresh_token = refresh_token;

        await updateUserService({ user_id: userInfo.id, type: "refresh_token", refreshToken: refresh_token });
      }

      response = {
        status: response.status,
        status_code: response.status_code,
        message: response.message,
        data: {
          id: userInfo.id,
          access_Token: userInfo.access_Token,
          refresh_token: userInfo.refresh_token,
          status: userInfo.status,
          type: userInfo.type,
        }
      };
    }

    return res.status(response.status_code).json(response);
  } catch (error) {
    return res.status(RESPONSE_CODES.ERROR).json({
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    });
  }
};
