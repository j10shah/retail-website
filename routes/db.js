const mysql = require('mysql2/promise');

// Database connection configuration
const dbConfig = {
    host: 'localhost',    // Update with your DB host
    user: 'root',         // Update with your DB username
    password: '',         // Update with your DB password
    database: 'retail_site_db',
};

// Create a connection pool for better performance and scalability
const pool = mysql.createPool(dbConfig);

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Database connected successfully');
        connection.release(); // Release the connection back to the pool
    }
});


// Utility function to query the database
async function queryDatabase(query, params = []) {
    try {
        const [results] = await pool.execute(query, params);
        return results;
    } catch (error) {
        console.error('Database query error:', error.message);
        throw error;
    }
}

// Example function: Fetch a user by username
async function getUserByUsername(username) {
    const query = 'SELECT * FROM Users WHERE username = ?';
    const results = await queryDatabase(query, [username]);
    return results[0]; // Return the first match (or undefined if not found)
}
// Example function: Fetch a user by email
async function getUserByEmail(email) {
    const query = 'SELECT * FROM Users WHERE email = ?';
    const results = await queryDatabase(query, [email]);
    return results[0];  // Return the first match (or undefined if not found)
}

async function getBusinessUserByEmail(email) {
    const query = 'SELECT * FROM BusinessUsers WHERE email = ?';
    const results = await queryDatabase(query, [email]);
    return results[0];  // Return the first match (or undefined if not found)
}

// Example function: Create a new user
async function createUser(username, email, passwordHash) {
    const query = `
        INSERT INTO Users (username, email, password_hash)
        VALUES (?, ?, ?)
    `;
    
    try {
        const results = await queryDatabase(query, [username, email, passwordHash]);
        console.log('User created:', results); // Log the result for debugging
        return results.insertId; // Return the newly created user's ID
    } catch (error) {
        console.error('Error creating user:', error.message); // Log the error if it happens
        throw error; // Rethrow the error to be caught by the calling function
    }
}

async function createBusinessUser(email, passwordHash) {
    const query = `
        INSERT INTO BusinessUsers (email, password_hash)
        VALUES (?, ?)
    `;
    
    try {
        const results = await queryDatabase(query, [email, passwordHash]);
        console.log('Business User created:', results); // Log the result for debugging
        return results.insertId; // Return the newly created user's ID
    } catch (error) {
        console.error('Error creating user:', error.message); // Log the error if it happens
        throw error; // Rethrow the error to be caught by the calling function
    }
}

// Export the pool and utility functions
module.exports = {
    queryDatabase,
    getUserByUsername,
    createUser,
    createBusinessUser,
    getBusinessUserByEmail,
    pool,
    getUserByEmail
};
