const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserByUsername, createUser, getUserByEmail } = require('./db'); // Import the db functions
const SECRET_KEY = 'your_secret_key'; // Replace with a secure key

// Handle user login
async function handleLogin(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        const { email, password } = JSON.parse(body);  // Expecting email instead of username

        try {
            // Fetch user by email instead of username
            const user = await getUserByEmail(email);  // Updated function to fetch by email

            if (!user) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid email or password' }));
                return;
            }

            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            console.log('Password match result:', isPasswordValid);

            if (!isPasswordValid) {
                console.log('Entered password:', password);
                console.log('Stored password hash:', user.password_hash);
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid email or password' }));
                return;
            }

            const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Login successful', token }));

        } catch (error) {
            console.error('Error during login:', error.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal server error' }));
        }
    });
}


async function registerUser(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const { username, email, password, confirmPassword } = JSON.parse(body);
            if (password !== confirmPassword) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Passwords do not match.' }));
                return;
            }

            const passwordHash = await bcrypt.hash(password, 10);
            const userId = await createUser(username, email, passwordHash); // Use createUser to insert into DB
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User registered successfully', userId }));
        } catch (error) {
            console.error('Error during registration:', error.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Failed to register user', error: error.message }));
        }
    });
}



module.exports = {
    handleLogin,
    registerUser,
};
