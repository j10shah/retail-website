const { queryDatabase } = require('./db');

// Function to add new products
async function addProducts(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        const productData = JSON.parse(body);
        const { name, category, description, price, stock, images, sku } = productData;

        try {
            const query = `
                INSERT INTO Products (name, category, description, price, stock, images, sku)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const result = await queryDatabase(query, [name, category, description, price, stock, images, sku]);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                message: 'Product created successfully',
                productId: result.insertId,
                productDetails: productData
            }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    });
}

// Function to remove a product
async function removeProduct(req, res, productId) {
    try {
        const query = 'DELETE FROM Products WHERE id = ?';
        const result = await queryDatabase(query, [productId]);

        if (result.affectedRows > 0) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                message: `Product with ID ${productId} was removed successfully.`,
            }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Product not found' }));
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
    }
}

module.exports = {
    addProducts,
    removeProduct,
};