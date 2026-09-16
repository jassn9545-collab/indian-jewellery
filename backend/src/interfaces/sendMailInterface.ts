// Shapes used by src/utils/mailOptions.ts + src/utils/sendmail.ts.
// (This file was imported but missing, so `tsc` could not build the project.)

export interface mailOptions {
    from?: string;
    to: string;
    subject: string;
    /** Handlebars template name in src/templates (without the extension). */
    template: string;
    context: {
        dynamic_content: string;
        title: string;
        [key: string]: any;
    };
}

export interface mailOptionPayload {
    email: string;
    name?: string;
    /** One of TEMPLATE_TYPE in src/config/constants.ts */
    template_type: number;
    /** users.id — used to build the reset-password link. */
    id?: number | string;
    otp?: number | string;
}
