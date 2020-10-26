/* used to retreive information about the currently authenticated user */

import constants from '../constants';

const express = require('express');
const auth = require('../modules/auth');

const router = express.Router();

/**
 * Get required information about the current user from Passport. Accessed by
 * React apps.
 */
router.get('/', (req, res) => {
  /* get constants in order to read passport user info */
  const {
    SAML_COOKIE_NAME,
    SAML_FIRST_NAME_KEY,
    SAML_LAST_NAME_KEY,
    SAML_EMAIL_KEY,
  } = constants;

  /* if user object is defined, passport is storing their active session */
  const { signedCookies: cookies } = req;
  const myCookie = auth.decryptCookie(cookies[SAML_COOKIE_NAME]);
  console.log('Found user info:');
  console.log(myCookie);

  /* build response */
  const userInfo = {};
  if (myCookie !== undefined) {
    userInfo[SAML_FIRST_NAME_KEY] = myCookie[SAML_FIRST_NAME_KEY];
    userInfo[SAML_LAST_NAME_KEY] = myCookie[SAML_LAST_NAME_KEY];
    userInfo[SAML_EMAIL_KEY] = myCookie[SAML_EMAIL_KEY];
  }

  return res.status(200).json(userInfo);
});

module.exports = router;
