const express = require('express');
const { createUser, recordTransaction } = require('../controllers/userController');

const router = express.Router();

router.post('/createUser', createUser);
router.post('/transaction', recordTransaction);

module.exports = router;
