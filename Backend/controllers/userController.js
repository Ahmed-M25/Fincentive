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
  
  module.exports = {
    createUser
  };