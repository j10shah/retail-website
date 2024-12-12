const http = require('http');
const fs = require('fs');
const path = require('path');
const { parse } = require('querystring');
const { handleLogin, registerUser } = require('./routes/auth');
const { fetchProducts, fetchProductDetails } = require('./routes/products');
const { addProducts, removeProduct } = require('./routes/businessProducts');

const PORT = 3000;

const mimeType = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
};
  

const serveStaticFile = (res, filePath, contentType) => {
    fs.readFile(filePath, (err, data) => {
        if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 - Internal Server Error');
        } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
        }
    });
};


const server = http.createServer((req, res) => {
    const { method, url } = req;
  
    if (method === 'GET') {
      if (url === '/') {
        serveStaticFile(res, path.join(__dirname, 'views', 'index.html'), 'text/html');
      } else if (url.startsWith('/public')) {
        const filePath = path.join(__dirname, url);
        const ext = path.extname(filePath);
        serveStaticFile(res, filePath, mimeType[ext] || 'text/plain');
      } else if (url === '/login.html') {
        serveStaticFile(res, path.join(__dirname, 'views', 'login.html'), 'text/html');
      } else if (url === '/catalog.html') {
        serveStaticFile(res, path.join(__dirname, 'views', 'catalog.html'), 'text/html');
      } else if (url === '/register.html') {
        serveStaticFile(res, path.join(__dirname, 'views', 'register.html'), 'text/html');
      } else if (url === '/cart.html') {
        serveStaticFile(res, path.join(__dirname, 'views', 'cart.html'), 'text/html'); 
      } else if (url === '/business.html') {
        serveStaticFile(res, path.join(__dirname, 'views', 'business.html'), 'text/html'); 
      } else if (url === '/products.html') {
        fetchProducts(res);
      } else if (url.startsWith('/products/')) {
        const productId = url.split('/')[2];
        fetchProductDetails(res, productId);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - Not Found');
      }
    }
  
    if (method === 'POST') {
      if (url === '/login') {
        handleLogin(req, res);
      } else if (url == '/register') {
        registerUser(req, res);
      } else if (url == '/add-product') {
        addProducts(req, res);
      } else if (url === '/orders') {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString();
        });
        req.on('end', async () => {
          const { userId, items, totalAmount } = JSON.parse(body);
          try {
            const result = await createOrder(userId, items, totalAmount);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
          } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
          }
        });
      }
    }
  });
  
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});







/*
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
*/