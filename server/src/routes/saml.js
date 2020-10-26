const express = require('express');
const passport = require('passport');
const auth = require('../modules/auth');

const router = express.Router();

/**
 * This Route Authenticates req with IdP
 */
router.get('/login',
  (req, res, next) => {
    console.log('Received login request...');
    next();
  },
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  (req, res) => {
    console.log('Completed login request.');
  });

/**
 * This is the callback URL that consumes SAML POST requests.
 */
router.post('/auth',
  // automatically login the user and save session with passport
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  auth.setUserCookies, // persist the user's info and logged-in status
  (req, res) => {
    console.log('Completed auth req. User is:');
    console.log(req.user);
    return res.redirect(302, '/');
  });

module.exports = router;
