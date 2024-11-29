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

// Example function: Create a new user
async function createUser(username, email, passwordHash) {
    const query = `
        INSERT INTO Users (username, email, password_hash)
        VALUES (?, ?, ?)
    `;
    const results = await queryDatabase(query, [username, email, passwordHash]);
    return results.insertId; // Return the newly created user's ID
}

// Export the pool and utility functions
module.exports = {
    queryDatabase,
    getUserByUsername,
    createUser,
};
