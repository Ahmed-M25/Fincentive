const admin = require('firebase-admin');
const connection = require('../config/db');
const fetchRecentStockPrice = require('../services/StockService');

const getStockValue = async (req, res) => {
  const { firebaseIdToken } = req.body;

  try {
    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(firebaseIdToken);
    const firebaseId = decodedToken.uid;

    // Ensure user exists in database
    connection.query(
      'SELECT id FROM users WHERE firebase_id = ?',
      [firebaseId],
      async (error, userResults, fields) => {
        if (error) {
          console.error('Error fetching user ID:', error);
          return res.status(500).send('Error fetching user ID');
        }

        const userId = userResults[0].id;

        // Fetch all stocks and their quantities for the user
        connection.query(
          'SELECT ticker, shares FROM user_stocks WHERE user_id = ?',
          [userId],
          async (error, stockResults, fields) => {
            if (error) {
              console.error('Error fetching user stocks:', error);
              return res.status(500).send('Error fetching user stocks');
            }

            let totalStockValue = 0;

            // Fetch the current price for each stock and calculate the total value
            for (const stock of stockResults) {
              try {
                const currentPrice = await fetchRecentStockPrice(stock.ticker);
                totalStockValue += stock.shares * currentPrice;
              } catch (fetchError) {
                console.error(`Error fetching price for ${stock.ticker}:`, fetchError);
              }
            }

            res.status(200).json({ totalStockValue });
          }
        );
      }
    );
  } catch (error) {
    console.error('Firebase authentication error:', error);
    res.status(401).send('Unauthorized');
  }
};

module.exports = {
  getStockValue,
};
