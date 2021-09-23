const b2cPolicies = {
    names: {
        signUpSignIn: "B2C_1A_EMBEDDEDSIGNIN_SIGNUP_SIGNIN",
        resetPassword: "B2C_1A_EMBEDDEDSIGNIN_PASSWORDRESET",
        editprofile: "B2C_1A_EMBEDDEDSIGNIN_PROFILEEDIT",
    },
    authorities: {
        signUpSignIn: {
            authority: "https://<custom-domain-name>/<domain-name>/B2C_1A_EMBEDDEDSIGNIN_SIGNUP_SIGNIN",
        },
        resetPassword: {
            authority: "https://<custom-domain-name>/<domain-name>/B2C_1A_EMBEDDEDSIGNIN_PASSWORDRESET",
        },
        editprofile: {
            authority: "https://<custom-domain-name>/<domain-name>/B2C_1A_EMBEDDEDSIGNIN_PROFILEEDIT",
        },
    },
    authorityDomain: "<custom-domain-name>",
    destroySessionUrl: "https://<custom-domain-name>/<domain-name>/oauth2/v2.0/logout?p=B2C_1A_EMBEDDEDSIGNIN_SIGNUP_SIGNIN" + "&post_logout_redirect_uri=https://<domain-name>/"
}

module.exports = b2cPolicies;