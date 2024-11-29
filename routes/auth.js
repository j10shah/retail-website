const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET_KEY = 'your_secret_key'; // Replace with a secure key

// Mock user data (replace with a database query in a real app)
const users = [
    { id: 1, username: 'admin', password: '$2b$10$kpoSn/abc123hash/secretPwd' }, // password: admin123
    { id: 2, username: 'user', password: '$2b$10$gVrOPwEtcFakehash/secretPwd' },  // password: user123
];

// Function to handle login
function handleLogin(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        const { username, password } = JSON.parse(body);

        // Find user
        const user = users.find(u => u.username === username);
        if (!user) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid username or password' }));
            return;
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid username or password' }));
            return;
        }

        // Generate token
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Login successful', token }));
    });
}

// Middleware to verify the token
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Authorization header missing' }));
        return;
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid or expired token' }));
            return;
        }

        req.user = user;
        next();
    });
}

// Export functions
module.exports = {
    handleLogin,
    verifyToken,
};
