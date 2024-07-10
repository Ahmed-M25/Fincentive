const connection = require('../config/db');
const admin = require('firebase-admin');

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

const getUserBalance = async (req, res) => {
const { firebaseIdToken } = req.body;

try {
    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(firebaseIdToken);
    const firebaseId = decodedToken.uid;

    // Fetch user balance from the database
    connection.query(
    'SELECT balance FROM users WHERE firebase_id = ?',
    [firebaseId],
    (error, results, fields) => {
        if (error) {
        console.error('Error fetching user balance:', error);
        return res.status(500).send('Error fetching user balance');
        }

        if (results.length > 0) {
        res.status(200).json({ balance: results[0].balance });
        } else {
        res.status(404).send('User not found');
        }
    }
    );
} catch (error) {
    console.error('Firebase authentication error:', error);
    res.status(401).send('Unauthorized');
}
};

module.exports = {
createUser,
getUserBalance,
};