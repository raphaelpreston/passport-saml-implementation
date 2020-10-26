/* eslint-disable max-len */
const constants = {
  SAML_COOKIE_NAME: 'myCookie',
  COOKIE_ENCRYPT_SECRET: 'my-encrypt-secret',
  COOKIE_SIGN_SECRET: 'my-sign-secret',
  SAML_ENTITY_ID: 'my-entity-ID',
  SAML_SSO_URL: 'my-saml-entry-point',
  SAML_ACS_URL: 'my-acs-url', // must match your IdP registration
  SAML_CERT: 'my-saml-cert', // must match your IdP registration
  SAML_FIRST_NAME_KEY: 'firstname', // must match your IdP registration
  SAML_LAST_NAME_KEY: 'lastname', // must match your IdP registration
  SAML_EMAIL_KEY: 'nameID', // must match your IdP registration
};

export default constants;
