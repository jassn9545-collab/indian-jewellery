import { Prisma } from '@prisma/client';

import prisma from '../database/prisma';
import { RESPONSE_CODES, USER_STATUS, USER_TYPE } from '../config/constants';
import { USER_PUBLIC_SELECT } from '../models/user';
import { userDetailServicePayload, userRegisterPayload, userUpdatePayload } from '../interfaces/userInterfaces';
import { RESPONSE } from '../interfaces/commonInterfaces';
import { generateHash } from '../utils/jwt';
import { RESPONSE_MESSAGES } from '../utils/responseMessage';

/** Postgres ids are ints — reject anything that is not one instead of querying with NaN. */
const toId = (value: number | string | undefined): number | null => {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
};

// Get user detail
export const userDetail = async (payload: userDetailServicePayload) => {
    try {
        let response: RESPONSE;
        let where: Prisma.UserWhereInput;

        // Only the id lookup hides the password — the email lookup feeds the login check.
        let select: Prisma.UserSelect | undefined;

        if (payload.type === 'id' || payload.type === 'userId') {
            const id = toId(payload.id ?? payload.user_id);

            if (id === null) {
                return {
                    status: 0,
                    status_code: RESPONSE_CODES.NOT_FOUND,
                    message: RESPONSE_MESSAGES.invalidId
                };
            }

            where = { id, isDeleted: false };
            select = USER_PUBLIC_SELECT;
        } else if (payload.type === 'number') {
            where = { number: payload.number, isDeleted: false };
        } else {
            where = { email: payload.email?.toLowerCase(), isDeleted: false };
        }

        const user_details = await prisma.user.findFirst({ where, select });

        if (user_details) {
            response = {
                status: 1,
                status_code: RESPONSE_CODES.GET,
                message: RESPONSE_MESSAGES.userDetailListing,
                data: user_details
            };
        } else {
            response = {
                status: 0,
                status_code: RESPONSE_CODES.NOT_FOUND,
                message: payload.type ? RESPONSE_MESSAGES.noDataFound : RESPONSE_MESSAGES.emailNotFound
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

//User register
export const userRegisterService = async (payload: userRegisterPayload) => {
    try {
        const hashPassword = await generateHash(`${payload.password}`);

        const user = await prisma.user.create({
            data: {
                name: `${payload.name}`,
                email: payload.email.toLowerCase(),
                password: hashPassword,
                number: payload.number ?? '',
                dob: payload.DOB ?? null,
                country: payload.country ?? null,
                status: USER_STATUS.active,
                type: USER_TYPE.user,
                linkHash: null,
                isVerified: 0,
                isSubscribed: 0
            },
            select: { id: true }
            // createdAt / updatedAt are filled in by Postgres (@default(now()) / @updatedAt)
        });

        return {
            status: 1,
            status_code: RESPONSE_CODES.POST,
            message: RESPONSE_MESSAGES.registrationCompleted,
            data: {
                id: user.id
            }
        };
    } catch (error) {
        // Unique constraint on email — the controller pre-checks, this covers the race.
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return {
                status: 0,
                status_code: RESPONSE_CODES.ALREADY_EXIST,
                message: RESPONSE_MESSAGES.emailAlreadyExist
            };
        }

        throw {
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message
        };
    }
};

// Update user profile
export const updateUserService = async (payload: userUpdatePayload) => {
    try {
        const id = toId(payload.id ?? payload.user_id);

        if (id === null) {
            return false;
        }

        const data: Prisma.UserUpdateInput = {};

        if (payload.type === 'refresh_token') {
            data.refreshToken = payload.refreshToken;
        }

        // updatedAt is maintained by Prisma's @updatedAt.
        await prisma.user.updateMany({
            where: { id, isDeleted: false },
            data
        });

        return true;
    } catch (error) {
        throw {
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message
        };
    }
};
