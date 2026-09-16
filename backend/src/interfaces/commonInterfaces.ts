import { Request } from 'express';

export interface RESPONSE {
    status?: number,
    status_code?: number,
    message?: string,
    token?: string,
    type?: number,
    data?: any,
    isAbleToProceed?: boolean
}

export interface CustomRequest extends Request {
    user?: any;
    file?: any;
    files?: any;
}

export interface Pagination {
    page: number;
    limit: number
}

export interface getAllListingPayload {
    name: string,
    type: string,
    _id: string,
    page: number,
    limit: string,
    search: string
}