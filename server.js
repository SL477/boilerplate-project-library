'use strict';

import express from 'express';
import pkg from 'body-parser';
const { json, urlencoded } = pkg;
import cors from 'cors';
import { config } from 'dotenv';
import apiRoutes from './routes/api.js';
import fccTestingRoutes from './routes/fcctesting.js';
import runner from './test-runner.js';
import helmet, { hidePoweredBy } from 'helmet';

config();
const app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({ origin: '*' })); //USED FOR FCC TESTING PURPOSES ONLY!

app.use(json());
app.use(urlencoded({ extended: true }));

// Helmet
app.use(helmet({ contentSecurityPolicy: false }));
app.use(hidePoweredBy({ setTo: 'PHP 4.2.0' }));
// app.use(noCache());

// Index page (static HTML)
app.route('/').get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
apiRoutes(app);

//404 Not Found Middleware
// eslint-disable-next-line no-unused-vars
app.use(function (req, res, next) {
    res.status(404).type('text').send('Not Found');
});

//Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, function () {
    console.log('Listening on port ' + listener.address().port);
    if (process.env.NODE_ENV === 'test') {
        console.log('Running Tests...');
        setTimeout(function () {
            try {
                runner.run();
                console.log('Run tests');
            } catch (e) {
                var error = e;
                console.log('Tests are not valid:');
                console.log(error);
            }
        }, 1500);
    }
});

export default app; //for unit/functional testing
