/* import libraries */
const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');
const morgan = require('morgan');

/* import modules */
const auth = require('./modules/auth.js');

/* import routes */
const samlRoutes = require('./routes/saml');
const dashboardRoutes = require('./routes/dashboard');
const userRoutes = require('./routes/user');

/* initialize express */
const app = express();
app.use(cors()); // enable/disable cross origin resource sharing if necessary
app.use(morgan('dev')); // enable/disable http request logging
// enable creation of nested objects from a query string
app.use(express.urlencoded({ extended: true }));
// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* configure passport (and ability to persist user data) with server */
auth.applyPassportAndPersistence(app);

/* declare routes */
app.get('/', (req, res) => { // default route redirects to dashboard
  return res.redirect(302, '/dashboard');
});

app.use('/dashboard', dashboardRoutes); // single-page react app
app.use('/saml', samlRoutes); // saml stuff
app.use('/user', userRoutes); // user information to be fetched by apps

/* start the server */
const port = process.env.PORT || 9090;
app.listen(port);
console.log(`--------------listening on: ${port}-----------------`);
