const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const msal = require('@azure/msal-node');

//Load Config
dotenv.config({path: './config/.env'});
const policies = require('./config/policies');
const { render } = require('ejs');

const app = express();
const PORT = process.env.PORT;

/** MSAL Config */
const confidentialClientConfig = {
    auth: {
        clientId: "9cecd5f5-e0a0-4fd4-9d32-6ceceb941472",
        authority: policies.authorities.signUpSignIn.authority,
        clientSecret: "zYMQyDJBV_~J819g27B.f.r1q38-mAZ1co",
        knownAuthorities: [policies.authorityDomain],
        //redirectUri: "https://app3.thegamesstore.in/redirect",
        redirectUri: "http://localhost:5001/redirect",
        postLogoutRedirectUri: 'https://localhost:5001/'
    },
    cache: {
		cacheLocation: 'localStorage',
		storeAuthStateInCookie: false,
	},
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Verbose,
        }
    }
};

const SCOPES = {
    oidc: ["openid", "profile"],
    graph: ["user.read"],
};

const APP_STATES = {
    login: "login",
    call_api: "call_api",
    password_reset: "password_reset",
}

const authCodeRequest = {
    redirectUri: confidentialClientConfig.auth.redirectUri,
};

const tokenRequest = {
    redirectUri: confidentialClientConfig.auth.redirectUri,
};

// Initialize MSAL Node.
const confidentialClientApp = new msal.ConfidentialClientApplication(confidentialClientConfig);
console.log(confidentialClientApp);

app.locals.accessToken = null;

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));


app.set('view engine', 'ejs');

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'secretSession',
}));

/** Initializing Static Folder */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * This method is used to generate an auth code request
 * @param {string} authority: the authority to request the auth code from 
 * @param {array} scopes: scopes to request the auth code for 
 * @param {string} state: state of the application
 * @param {object} res: express middleware response object
 */
const getAuthCode = (authority, scopes, state, res) => {

    // prepare the request
    authCodeRequest.authority = authority;
    authCodeRequest.scopes = scopes;
    authCodeRequest.state = state;

    tokenRequest.authority = authority;

    // request an authorization code to exchange for a token
    return confidentialClientApp.getAuthCodeUrl(authCodeRequest)
        .then((response) => {
            res.redirect(response);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
}


/** App Routes */
app.get('/', (req, res) => {
    const templateParams = { showSignInButton: true , username: null};
    res.render('index', templateParams);
});

//Initiates the auth code grant flow for login
app.get('/login', (req, res, next) => {
    if(authCodeRequest.state === APP_STATES.password_reset) {
        //if coming from password reset, set the authority to password reset.
        getAuthCode(policies.authorities.resetPassword.authority, SCOPES.oidc, APP_STATES.password_reset, res);
    } else {
        // else, usual login
        getAuthCode(policies.authorities.signUpSignIn.authority, SCOPES.oidc, APP_STATES.login, res);
    }  (req, res, next); 
});

//Initiates the auth code grant for editProfile
app.get('/profileEdit', (req, res) => {
    getAuthCode(policies.authorities.editprofile.authority, SCOPES.oidc, APP_STATES.login, res);
});

//Initiates the auth code grant for editProfile
app.get('/resetPassword', (req, res) => {
    getAuthCode(policies.authorities.resetPassword.authority, SCOPES.oidc, APP_STATES.login, res);
});


app.get('/redirect', (req, res) => {
    if(req.query.state === APP_STATES.login) {
        //Prepare request for authentication
        tokenRequest.scopes = SCOPES.oidc; 
        tokenRequest.code = req.query.code;

        confidentialClientApp.acquireTokenByCode(tokenRequest)
            .then((response) => {
                const templateParams = { showSignInButton: false, username: response.account.name, profile: true, idToken: response.account.idTokenClaims };
                console.log(`TemplateParams: ${JSON.stringify(templateParams)}`);
                res.render('index', templateParams);
            }).catch((error) => {
                if(req.query.error) {
                    /**
                     * When the user selects "forgot my password" on the sign-in page, B2C service will throw an error.
                     * We are to catch this error and redirect the user to login again with the resetPassword authority.
                     * For more information, visit: https://docs.microsoft.com/azure/active-directory-b2c/user-flow-overview#linking-user-flows
                    */
                   if(JSON.stringify(req.query.error_description).includes("AADB2C90118")) {
                       authCodeRequest.authority = policies.authorities.resetPassword;
                       authCodeRequest.state = APP_STATES.password_reset;
                       return res.redirect('/login');
                   } 
                }
                res.status(500).send(error);
            });
    } 
});


/**
 * A logout operation will contain multiple steps:

    - Removing the account and the tokens from the msal application cache.
    - Redirecting to the AAD logout endpoint so the user logs out and AAD cookies are deleted.
    - If your webapp has a session, invalidating it.
 */

app.get('/logout', (req, res) => {
    
});


//Listening to the server
app.listen(PORT, () => { 
    console.log(`Server running on http://localhost:${PORT}`);
});