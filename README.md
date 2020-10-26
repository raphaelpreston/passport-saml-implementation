## Babel-Node & React SAML SSO Implementation
See corresponding tutorial [here]().

### Requirements
- `node.js` (I used v13.14.1)
- `yarn` or `npm`

### Deployment Instructions
1. Register your app with an IdP
2. Fill in the following constants in `./server/src/constants.js` in order to point to your IdP
   - `SAML_SSO_URL`
   - `SAML_ACS_URL`
   - `SAML_CERT`
3. Navigate to `./dashboard`
4. Run `yarn install` to install necessary packages for React rendering
5. Run `yarn start` and navigate to [`http://localhost:8080/`](http://localhost:8080/) to test the client-side app. User data should fail to fetch.
6. Run `yarn build` to bundle the app using Webpack. This will create the folder `./server/public`.
7. Deploy the server package (`./server`) somewhere that will give you a publicly accessible URL.

### Implementation Notes
- I chose to use the server to access the user's cookies instead of letting the client. This is safer because it helps protect against XSS attacks.
