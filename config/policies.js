const b2cPolicies = {
    names: {
        signUpSignIn: "B2C_1A_EMBEDDEDSIGNIN_SIGNUP_SIGNIN",
        resetPassword: "B2C_1A_EMBEDDEDSIGNIN_PASSWORDRESET",
        editprofile: "B2C_1A_EMBEDDEDSIGNIN_PROFILEEDIT",
    },
    authorities: {
        signUpSignIn: {
            authority: "https://login.thegamesstore.in/thegamesstore.in/B2C_1A_EMBEDDEDSIGNIN_SIGNUP_SIGNIN",
        },
        resetPassword: {
            authority: "https://login.thegamesstore.in/thegamesstore.in/B2C_1A_EMBEDDEDSIGNIN_PASSWORDRESET",
        },
        editprofile: {
            authority: "https://login.thegamesstore.in/thegamesstore.in/B2C_1A_EMBEDDEDSIGNIN_PROFILEEDIT",
        },
    },
    authorityDomain: "login.thegamesstore.in",
    destroySessionUrl: "https://login.thegamesstore.in/thegamesstore.in/oauth2/v2.0/logout?p=B2C_1A_EMBEDDEDSIGNIN_SIGNUP_SIGNIN" + "&post_logout_redirect_uri=https://app3.thegamesstore.in/"
}

module.exports = b2cPolicies;