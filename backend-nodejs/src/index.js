const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use('/images', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')));

require('./controllers/authController')(app);
require('./controllers/habitController')(app);
require('./controllers/userController')(app);

app.listen(8080);
