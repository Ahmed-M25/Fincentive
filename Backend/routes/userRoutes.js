const express = require('express');
const { createUser, getUserBalance } = require('../controllers/userController');
const { recordTransaction } = require('../controllers/transactionController');
const { getStockValue } = require('../controllers/StockValue');

const router = express.Router();

router.post('/createUser', createUser);
router.post('/transaction', recordTransaction);
router.post('/balance', getUserBalance);
router.post('/stock-value', getStockValue);

module.exports = router;
