const http = require('http');
const fs = require('fs');
const path = require('path');
const { parse } = require('querystring');
const { handleLogin, serveStaticFile } = require('./routes/auth');
const { fetchProducts, fetchProductDetails } = require('./routes/products');

const server = http.createServer((req, res) => {
    if (req.url === '/' && req.method === 'GET') {
        serveStaticFile(res, path.join(__dirname, 'views', 'index.html'));
    } else if (req.url === '/login' && req.method === 'POST') {
        handleLogin(req, res);
    } else if (req.url === '/catalog' && req.method === 'GET') {
        fetchProducts(res);
    } else if (req.url.startsWith('/product') && req.method === 'GET') {
        const id = req.url.split('/')[2];
        fetchProductDetails(res, id);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
    }
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));