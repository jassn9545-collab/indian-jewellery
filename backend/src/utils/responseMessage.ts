export const RESPONSE_MESSAGES = {

    // Error message
    missingAuthToken: 'Authorization token is missing!',
    invalidToken: 'Invalid Token!',
    invalidRequest: "Invalid Request!",
    invalidId: "Invalid id!",
    noDataFound: "No data found!",
    emailNotFound: "Email not found!",
    clickOnForgotPassword: "To reset your password.First you have to forgot password!",
    emailAlreadyExist: "Email already exist!",
    inactiveUser: "Your account has been in-activate by admin.To active again contact Admin!",
    unauthorized: "unauthorized",

    // Auth success
    tokenVerified: 'Token verified.',
    passwordUpdated: "Password updated successfully",
    loginSuccess: "Logged In Successfully.",
    forgotPasswordSuccess: "Forgot password link sent on your email",
    userExist: "User exist on our portal",

    // Auth failure
    wrongPassword: "Password does not match!",

    // User success
    userDetailListing: "User detail listing.",
    registrationCompleted: "User registered successfully.",
    registration2Completed: "Registration step-2 completed.",
    registration3Completed: "Registration step-3 completed.",
    userStatusActive: "User status active.",
    userStatusInActive: "User status in-active.",
    usersAll: "Users listing.",
    preferencesAdded: "User preferences added.",

    // User failure
    alreadyCompleteStep2: "You have already completed registration step-2",
    alreadyCompleteStep3: "You have already completed registration step-3",


} as const;