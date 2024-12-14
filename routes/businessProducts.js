const { queryDatabase } = require('./db');

// Function to add new products
async function addProducts(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        const productData = JSON.parse(body);
        const { productName, description, price, stock, sku, imageUrl, category} = productData;
        try {
            // Ensure category exists or create it
            const categoryCheckQuery = `SELECT category_id FROM Categories WHERE category_name = ?`;
            const categoryResult = await queryDatabase(categoryCheckQuery, [category]);
            let categoryId;

            if (categoryResult.length === 0) {
                // Category does not exist, insert it
                const insertCategoryQuery = `INSERT INTO Categories (category_name) VALUES (?)`;
                const insertCategoryResult = await queryDatabase(insertCategoryQuery, [category]);
                categoryId = insertCategoryResult.insertId; // Get the new category ID
            } else {
                // Category exists, get the ID
                categoryId = categoryResult[0].category_id;
            }


            const query = `
                INSERT INTO Products (name, description, category_id, price, quantity, image_url, sku)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const result = await queryDatabase(query, [productName, description, categoryId, price, stock, imageUrl, sku]);

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