const mysql = require('mysql');
const admin = require('firebase-admin');


const serviceAccount = require('./firebase-config.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id', connection.threadId);
});



app.post('/transaction', async (req, res) => {
    const { firebaseIdToken, ticker, shares, type } = req.body;

    try {
      if (!firebaseIdToken) {
        throw new Error("Firebase ID token is missing");
      }
  
      console.log('Received Firebase ID token:', firebaseIdToken);

      // Verify Firebase ID token
      const decodedToken = await admin.auth().verifyIdToken(firebaseIdToken);
      const firebaseId = decodedToken.uid;
  
      // Ensure user exists in database
      connection.query(
        'INSERT IGNORE INTO users (firebase_id) VALUES (?)',
        [firebaseId],
        (error, results, fields) => {
          if (error) {
            console.error(error);
            return res.status(500).send('Error inserting user');
          }
          
          // Get user ID from the database
          connection.query(
            'SELECT id FROM users WHERE firebase_id = ?',
            [firebaseId],
            (error, results, fields) => {
              if (error) {
                console.error(error);
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
});

