import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

import prisma from "../database/prisma";
import { RESPONSE_CODES } from "../config/constants";
import { comparePasswordPayload } from "../interfaces/authInterfaces";
import { RESPONSE } from "../interfaces/commonInterfaces";
import { RESPONSE_MESSAGES } from "../utils/responseMessage";
import { userDetailServicePayload } from "../interfaces/userInterfaces";

// Compare user password
export const comparePassword = async (userInfo: comparePasswordPayload) => {
  try {
    let response: RESPONSE;

    if (userInfo.userPassword && bcrypt.compareSync(userInfo.password, userInfo.userPassword)) {
      response = {
        status: 1,
        status_code: RESPONSE_CODES.GET,
        message: RESPONSE_MESSAGES.loginSuccess,
      };
    } else {
      response = {
        status: 0,
        status_code: RESPONSE_CODES.NOT_FOUND,
        message: RESPONSE_MESSAGES.wrongPassword,
      };
    }

    return response;
  } catch (error) {
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    };
  }
};

// Get user profile
export const userProfile = async (payload: userDetailServicePayload) => {
  try {
    let response: RESPONSE;
    let where: Prisma.UserWhereInput;

    if (payload.type == "email") {
      where = {
        email: payload.email?.toLowerCase(),
        isDeleted: false
      };
    } else {
      const id = Number(payload.user_id ?? payload.id);

      if (!Number.isInteger(id) || id <= 0) {
        return {
          status: 0,
          status_code: RESPONSE_CODES.NOT_FOUND,
          message: RESPONSE_MESSAGES.invalidId
        };
      }

      where = {
        id,
        linkHash: payload.linkHash != null ? Number(payload.linkHash) : undefined,
        isDeleted: false
      };
    }

    const user_details = await prisma.user.findFirst({
      where,
      select: { id: true, email: true }
    });

    if (user_details) {
      response = {
        status: 1,
        status_code: RESPONSE_CODES.GET,
        message: RESPONSE_MESSAGES.userExist,
        data: user_details
      };
    } else {
      response = {
        status: 0,
        status_code: RESPONSE_CODES.NOT_FOUND,
        message: RESPONSE_MESSAGES.noDataFound
      };
    }

    return response;
  } catch (error) {
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message
    };
  }
};
