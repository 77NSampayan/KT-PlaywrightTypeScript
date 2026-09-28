export const TextConstants = {
    SauceDemoLoginPage: {
        loginButton: "Login",
        lockedOutError: "Epic sadface: Sorry, this user has been locked out.",
        invalidCredentialsError: "Epic sadface: Username and password do not match any user in this service",
        missingUsernameError: "Epic sadface: Username is required",
        missingPasswordError: "Epic sadface: Password is required"
    },

    SauceDemoInventoryPage: {
        title: "Products"
    },

    SauceDemoCheckoutPage: {
        missingFirstNameError: "Error: First Name is required",
        missingLastNameError: "Error: Last Name is required",
        missingPostalCodeError: "Error: Postal Code is required"
    },

    SauceDemoCheckoutCompletePage: {
        header: "Thank you for your order!"
    }
} as const