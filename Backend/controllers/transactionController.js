const admin = require('firebase-admin');
const connection = require('../config/db');
const fetchRecentStockPrice = require('../services/StockService'); // Correct import statement

const recordTransaction = async (req, res) => {
  const { firebaseIdToken, ticker, shares, type } = req.body;

  try {
    console.log('Received transaction request:', { firebaseIdToken, ticker, shares, type });

    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(firebaseIdToken);
    const firebaseId = decodedToken.uid;

    const stockPrice = await fetchRecentStockPrice(ticker);
    const totalCost = stockPrice * shares;

    // Ensure user exists in databasef
    connection.query(
      'INSERT IGNORE INTO users (firebase_id, balance) VALUES (?, 1000000.00)',
      [firebaseId],
      (error, results, fields) => {
        if (error) {
          console.error('Error inserting user:', error);
          return res.status(500).send('Error inserting user');
        }

        // Get user ID and balance from the database
        connection.query(
          'SELECT id, balance FROM users WHERE firebase_id = ?',
          [firebaseId],
          (error, userResults, fields) => {
            if (error) {
              console.error('Error fetching user ID:', error);
              return res.status(500).send('Error fetching user ID');
            }

            const userId = userResults[0].id;
            let currentBalance = userResults[0].balance;

            // Check if user already has shares of this stock
            connection.query(
              'SELECT shares FROM user_stocks WHERE user_id = ? AND ticker = ?',
              [userId, ticker],
              (error, stockResults, fields) => {
                if (error) {
                  console.error('Error fetching user shares:', error);
                  return res.status(500).send('Error fetching user shares');
                }

                let newShares = 0;
                if (stockResults.length > 0) {
                  newShares = stockResults[0].shares;
                }

                if (type === 'buy') {
                  newShares += shares;
                  currentBalance -= totalCost;
                  if (currentBalance < 0) {
                    return res.status(400).send('Insufficient balance to buy shares');
                  }
                } else if (type === 'sell') {
                  newShares -= shares;
                  currentBalance += totalCost;
                  if (newShares < 0) {
                    return res.status(400).send('Insufficient shares to sell');
                  }
                } else {
                  return res.status(400).send('Invalid transaction type');
                }

                // Update user's balance
                connection.query(
                  'UPDATE users SET balance = ? WHERE id = ?',
                  [currentBalance, userId],
                  (error, balanceResults, fields) => {
                    if (error) {
                      console.error('Error updating balance:', error);
                      return res.status(500).send('Error updating balance');
                    }

                    // Update or insert shares in the database
                    const query = stockResults.length > 0 ?
                      'UPDATE user_stocks SET shares = ? WHERE user_id = ? AND ticker = ?' :
                      'INSERT INTO user_stocks (user_id, ticker, shares) VALUES (?, ?, ?)';

                    const queryParams = stockResults.length > 0 ?
                      [newShares, userId, ticker] :
                      [userId, ticker, newShares];

                    connection.query(query, queryParams, (error, shareResults, fields) => {
                      if (error) {
                        console.error('Error updating/inserting shares:', error);
                        return res.status(500).send('Error updating/inserting shares');
                      }

                      res.status(200).send('Transaction recorded');
                    });
                  }
                );
              }
            );
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
  recordTransaction
};
