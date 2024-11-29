const { queryDatabase } = require('./db');

// Create an order
async function createOrder(userId, items, totalAmount, paymentStatus = 'Pending') {
    try {
        // Insert the order into the Orders table
        const orderQuery = `
            INSERT INTO Orders (user_id, total_amount, payment_status)
            VALUES (?, ?, ?)
        `;
        const result = await queryDatabase(orderQuery, [userId, totalAmount, paymentStatus]);
        const orderId = result.insertId;

        // Insert each item into the OrderItems table
        const itemQuery = `
            INSERT INTO OrderItems (order_id, product_id, quantity, price)
            VALUES (?, ?, ?, ?)
        `;
        for (const item of items) {
            await queryDatabase(itemQuery, [orderId, item.productId, item.quantity, item.price]);
        }

        return { orderId, message: 'Order created successfully' };
    } catch (error) {
        console.error('Error creating order:', error.message);
        throw error;
    }
}

// Fetch order details
async function fetchOrderDetails(orderId) {
    try {
        // Fetch order information
        const orderQuery = `
            SELECT * FROM Orders WHERE id = ?
        `;
        const order = await queryDatabase(orderQuery, [orderId]);

        if (!order.length) {
            throw new Error('Order not found');
        }

        // Fetch order items
        const itemsQuery = `
            SELECT * FROM OrderItems WHERE order_id = ?
        `;
        const items = await queryDatabase(itemsQuery, [orderId]);

        return { order: order[0], items };
    } catch (error) {
        console.error('Error fetching order details:', error.message);
        throw error;
    }
}

// Update payment status
async function updatePaymentStatus(orderId, status) {
    try {
        const query = `
            UPDATE Orders SET payment_status = ? WHERE id = ?
        `;
        const result = await queryDatabase(query, [status, orderId]);

        if (result.affectedRows === 0) {
            throw new Error('Order not found');
        }

        return { message: 'Payment status updated successfully' };
    } catch (error) {
        console.error('Error updating payment status:', error.message);
        throw error;
    }
}

module.exports = {
    createOrder,
    fetchOrderDetails,
    updatePaymentStatus,
};
