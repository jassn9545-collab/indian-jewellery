// The user table shape now lives in prisma/schema.prisma (model User -> table "users").
// This file only re-exports the generated type plus the field selections the API uses,
// so a route never accidentally leaks `password` / `refreshToken`.
import { Prisma, User } from '@prisma/client';

export type { User };

/** Everything except the secrets — safe to return from an endpoint. */
export const USER_PUBLIC_SELECT = {
  id: true,
  name: true,
  email: true,
  number: true,
  dob: true,
  country: true,
  status: true,
  type: true,
  isVerified: true,
  isSubscribed: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export type UserPublic = Prisma.UserGetPayload<{ select: typeof USER_PUBLIC_SELECT }>;
