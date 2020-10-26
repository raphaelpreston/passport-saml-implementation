/* eslint-disable consistent-return */

/* import constants */
import constants from '../constants';

const passport = require('passport');
const Cryptr = require('cryptr'); // implementation of crypto aes
const cookieParser = require('cookie-parser');
const passportSaml = require('passport-saml');

/* object for encrypting cookies */
const cryptr = new Cryptr(constants.COOKIE_ENCRYPT_SECRET);

/**
 * Encrypt a cookie for saving
 * @param {*} cookie Cookie to encrypt
 */
const encryptCookie = (cookie) => cryptr.encrypt(JSON.stringify(cookie));
/**
 * Decrypt a cookie for parsing
 * @param {*} cookie Cookie to decrypt
 */
const decryptCookie = (cookie) => JSON.parse(cryptr.decrypt(cookie));

/**
 * Configure an Express app with WS1 SAML passport configurations
 * @param {Express} app Express app to configure
 */
const applyPassportAndPersistence = (app) => {
  /* configure app to persist user data using cookies */
  app.use(cookieParser(constants.COOKIE_SIGN_SECRET));

  /* configure passport */
  app.use(passport.initialize());

  passport.use(new passportSaml.Strategy(
    {
      issuer: constants.SAML_ENTITY_ID, // unique ID
      cert: constants.SAML_CERT,
      entryPoint: constants.SAML_SSO_URL,
      callbackUrl: constants.SAML_ACS_URL, // this must exist and match EXACTLY what's in WS1 configs
    },
    (profile, done) => done(null, profile),
  ));

  /* no need to serialize into anything other than the object itself */
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));
};

/**
 * Call this middleware before any route that should be innaccesible to someone
 * who is not logged in
 */
const verifyUser = (req, res, next) => {
  console.log('Checking user session');
  /* get cookie info from Express */
  const { signedCookies: cookies } = req;

  /* get config options in order to read cookie */
  const myCookie = cookies[constants.SAML_COOKIE_NAME];

  if (myCookie === undefined) {
    // if the cookie was tampered with, it will not show up under signed cookies
    console.log('Not logged in. Redirecting to IdP.');
    return res.status(302).redirect('/saml/login');
  } else {
    return next();
  }
};

/**
 * Call this middleware upon receipt of an authorized SAML request to in order
 * to persist the user's logged-in status.
 */
const setUserCookies = (req, res, next) => {
  /* fetch naming metadata from config */
  const {
    SAML_COOKIE_NAME,
    SAML_FIRST_NAME_KEY,
    SAML_LAST_NAME_KEY,
    SAML_EMAIL_KEY,
  } = constants;

  /* grab data from passport */
  const { user: passportUser } = req;
  const { sessionIndex } = passportUser;

  /* translate important information from SAML response into user cookie */
  const myCookie = {
    sessionIndex, // this will always be named sessionIndex
  };
  myCookie[SAML_FIRST_NAME_KEY] = passportUser[SAML_FIRST_NAME_KEY];
  myCookie[SAML_LAST_NAME_KEY] = passportUser[SAML_LAST_NAME_KEY];
  myCookie[SAML_EMAIL_KEY] = passportUser[SAML_EMAIL_KEY];

  res.cookie(SAML_COOKIE_NAME, encryptCookie(myCookie), {
    maxAge: 1000 * 60 * 15, // expire after 15 minutes
    httpOnly: true, // change this to be able to access cookie from client
    signed: true,
  }); // set a cookie
  return next();
};

module.exports = {
  applyPassportAndPersistence,
  verifyUser,
  setUserCookies,
  decryptCookie,
};
