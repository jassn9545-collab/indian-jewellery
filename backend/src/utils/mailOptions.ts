import { sendmail } from "../utils/sendmail";
import { mailOptions, mailOptionPayload } from "../interfaces/sendMailInterface";
import { TEMPLATE_TYPE } from "../config/constants";

const createEmailOptionsForSendMail = async (payload: mailOptionPayload) => {
    try {

        let mailOptions: mailOptions;
        payload.name = payload.name ? payload.name : "";
        const { template_type } = payload;
        switch (template_type) {
            case TEMPLATE_TYPE.forgotPassword:
                mailOptions = {
                    to: payload.email,
                    subject: `Forgot password link`,
                    template: 'email_template',
                    context: {
                        dynamic_content: `                
                       <p style="font-size: 14px; line-height: 140%; padding-bottom:10px;"><span style="font-size: 18px; line-height: 25.2px; color: #666666;">Hello ${payload.name},</span></p>
                       <p style="font-size: 14px; line-height: 140%; padding-bottom:10px;"><span style="font-size: 18px; line-height: 25.2px; color: #666666;">We've received a request to reset your password for Apify Morgan.</span></p>
                       <p style="font-size: 14px; line-height: 140%; padding-bottom:10px;"><span style="font-size: 18px; line-height: 25.2px; color: #666666;">Click on the button below to reset your password:</span></p>


                        <a href="${process.env.FrontendUrl}/${payload.id}?linkHash=${payload.otp}" class="v-button" style="box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #217346; border-radius: 1px;-webkit-border-radius: 1px; -moz-border-radius: 1px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 14px;">
                        <span style="display:block;padding:15px 40px;line-height:120%;"><span style="font-size: 18px; line-height: 21.6px;">Reset Password</span></span>
                      </a>`,
                        title: 'Password Reset Confirmation'

                    },
                };
                break;
            case TEMPLATE_TYPE.emailVerification:
                mailOptions = {
                    to: payload.email,
                    subject: `Email Confirmation Required`,
                    template: 'email_template',
                    context: {
                        dynamic_content: `
                            <p style="font-size: 14px; line-height: 140%; padding-bottom:10px;"><span style="font-size: 18px; line-height: 25.2px; color: #666666;">Hello ${payload.name},</span></p>
                            <p style="font-size: 14px; line-height: 140%; padding-bottom:10px;"><span style="font-size: 18px; line-height: 25.2px; color: #666666;">Thank you for registering with Apify Morgan.</span></p>
                            <p style="font-size: 14px; line-height: 140%; padding-bottom:10px;"><span style="font-size: 18px; line-height: 25.2px; color: #666666;">To complete your registration, please confirm your email address using the OTP provided below:</span></p>
                
                            <p style="font-size: 14px; line-height: 140%; padding-bottom:10px;"><span style="font-size: 18px; line-height: 25.2px; color: #666666;">Your OTP is: <strong>${payload.otp}</strong></span></p>`,
                        title: 'Email Confirmation Required'
                    },
                };
                
                break;

            default:
                console.log("Invalid template type");
                return;
        }
        

        await sendmail(mailOptions);

    } catch (error) {
        console.log(error, "Email Sent error");
    }
}

export default createEmailOptionsForSendMail;