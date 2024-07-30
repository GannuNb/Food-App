const express = require('express');
const router = express.Router();
const Order = require('../models/Orders');

router.post('/OrderData', async (req, res) => {
    let data = req.body.order_data;
    await data.splice(0, 0, { order_date: req.body.order_date });

    try {
        let eId = await Order.findOne({ email: req.body.email });
        if (eId === null) {
            await Order.create({
                email: req.body.email,
                order_data: [data]
            });
        } else {
            await Order.findOneAndUpdate(
                { email: req.body.email },
                { $push: { order_data: data } }
            );
        }
        res.json({ success: true });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error");
    }
});

router.post('/myOrderData', async (req, res) => {
    try {
        let myData = await Order.findOne({ 'email': req.body.email });
        if (!myData) {
            console.log("Order not found for email:", req.body.email);
            return res.status(404).json({ error: "Order not found" });
        }
        console.log("Order data fetched for email:", req.body.email);
        res.json({ orderData: myData });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Server error", message: error.message });
    }
});

module.exports = router;

