const express = require('express');
const { createUser } = require('../controllers/userController');
const { recordTransaction } = require('../controllers/transactionController');

const router = express.Router();

router.post('/createUser', createUser);
router.post('/transaction', recordTransaction);

module.exports = router;
