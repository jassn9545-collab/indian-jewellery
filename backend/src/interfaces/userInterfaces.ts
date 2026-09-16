export interface userDetailServicePayload {
    /** Primary key of the user row (Postgres autoincrement int). */
    id?: number | string,
    email?: string,
    number?: string,
    /** Which lookup to run: "id" | "number" | anything else falls back to email. */
    type?: string,
    redirectionType?: number,
    /** Same as `id`; kept because the JWT payload and older callers use this name. */
    user_id?: number | string,
    linkHash?: number | string
};

export interface userRegisterPayload {
    name: string,
    email: string,
    password: string,
    number?: string,
    DOB?: string,
    country?: string,
};

export interface userUpdatePayload {
    id?: number | string,
    user_id?: number | string,
    type?: string,
    refreshToken?: string,
};
