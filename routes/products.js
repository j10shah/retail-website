const pool = require('./db'); // Adjust path to your DB connection module

// Fetch all products
async function fetchProducts(res) {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.rows));
    } catch (err) {
        console.error('Error fetching products:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Server Error' }));
    }
}

// Fetch product details by ID
async function fetchProductDetails(res, id) {
    try {
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Product not found' }));
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.rows[0]));
    } catch (err) {
        console.error(`Error fetching product with ID ${id}:`, err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Server Error' }));
    }
}

module.exports = {
    fetchProducts,
    fetchProductDetails,
};
