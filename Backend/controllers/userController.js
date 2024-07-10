const admin = require('firebase-admin');
const connection = require('../config/db');

const createUser = async (req, res) => {
  const { firebaseId, email } = req.body;

  try {
    connection.query(
      'INSERT INTO users (firebase_id, email, balance) VALUES (?, ?, 1000000.00)',
      [firebaseId, email],
      (error, results, fields) => {
        if (error) {
          console.error('Error inserting user:', error);
          return res.status(500).send('Error inserting user');
        }
        res.status(200).send('User created with initial balance');
      }
    );
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
};

const recordTransaction = async (req, res) => {
  const { firebaseIdToken, ticker, shares, type } = req.body;

  try {
    console.log('Received transaction request:', { firebaseIdToken, ticker, shares, type });
    
    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(firebaseIdToken);
    const firebaseId = decodedToken.uid;

    // Ensure user exists in database
    connection.query(
      'INSERT IGNORE INTO users (firebase_id) VALUES (?)',
      [firebaseId],
      (error, results, fields) => {
        if (error) {
          console.error('Error inserting user:', error);
          return res.status(500).send('Error inserting user');
        }

        // Get user ID from the database
        connection.query(
          'SELECT id FROM users WHERE firebase_id = ?',
          [firebaseId],
          (error, results, fields) => {
            if (error) {
              console.error('Error fetching user ID:', error);
              return res.status(500).send('Error fetching user ID');
            }

            const userId = results[0].id;

            // Check if user already has shares of this stock
            connection.query(
              'SELECT shares FROM user_stocks WHERE user_id = ? AND ticker = ?',
              [userId, ticker],
              (error, results, fields) => {
                if (error) {
                  console.error('Error fetching user shares:', error);
                  return res.status(500).send('Error fetching user shares');
                }

                if (results.length > 0) {
                  // User already has shares of this stock
                  let newShares;
                  if (type === 'buy') {
                    newShares = results[0].shares + shares;
                  } else if (type === 'sell') {
                    newShares = results[0].shares - shares;
                    if (newShares < 0) {
                      return res.status(400).send('Insufficient shares to sell');
                    }
                  } else {
                    return res.status(400).send('Invalid transaction type');
                  }

                  // Update shares in the database
                  connection.query(
                    'UPDATE user_stocks SET shares = ? WHERE user_id = ? AND ticker = ?',
                    [newShares, userId, ticker],
                    (error, results, fields) => {
                      if (error) {
                        console.error('Error updating shares:', error);
                        return res.status(500).send('Error updating shares');
                      }

                      res.status(200).send('Transaction recorded');
                    }
                  );
                } else {
                  // User does not have shares of this stock
                  if (type === 'sell') {
                    return res.status(400).send('No shares to sell');
                  }

                  // Insert new stock holding
                  connection.query(
                    'INSERT INTO user_stocks (user_id, ticker, shares) VALUES (?, ?, ?)',
                    [userId, ticker, shares],
                    (error, results, fields) => {
                      if (error) {
                        console.error('Error inserting new stock:', error);
                        return res.status(500).send('Error inserting new stock');
                      }

                      res.status(200).send('Transaction recorded');
                    }
                  );
                }
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
  createUser,
  recordTransaction
};
