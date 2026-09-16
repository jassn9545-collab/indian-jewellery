export const RESPONSE_CODES = {
    GET: 200,
    PUT: 204,
    POST: 201,
    DELETE: 204,
    NOT_FOUND: 404,
    ERROR: 500,
    UNAUTHORIZED: 401,
    BAD_REQUEST: 400,
    ALREADY_EXIST: 409,
    SSO_ALREADY_EXIST: 408,
    FORBIDDEN: 403,
    INVALID_ACCOUNT_STATUS: 402,
    UNPROCESSABLE_ENTITY: 422
} as const;


// Postgres table names (the Prisma models they map to are in prisma/schema.prisma).
export const Tables = {
    userTableName: "users",
} as const;

export const expireOtpInMilliseconds = parseInt(process.env.OTP_EXPIRE_TIME) || 6000;

export const otp = function otp() {
    return Math.floor(1000 + Math.random() * 9000)
}

export const TEMPLATE_TYPE = {
    forgotPassword: 1,
    emailVerification: 2
} as const;

export const USER_TYPE = {
    admin: 1,
    user: 2,
} as const;

export const USER_STATUS = {
    inactive: 0,
    active: 1,
} as const;

export const FLAG = {
    no: 0,
    yes: 1,
} as const;