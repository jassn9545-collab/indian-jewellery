export interface comparePasswordPayload {
  id?: number,
  /** Plain-text password from the request body. */
  password: string,
  /** Hashed password read from the users table. */
  userPassword: string,
  email?: string,
  name?: string,
  type?: number,
};
