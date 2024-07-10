const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const serviceAccount = require('./firebase-config.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', userRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});