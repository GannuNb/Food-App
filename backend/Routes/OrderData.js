const express = require('express');
const router = express.Router();
const Order = require('../models/Orders');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');

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
        console.log("Order Data before sending email: ", data); // Debugging line
        await sendOrderEmail(req.body.email, req.body.order_data, req.body.total_price, req.body.gst, req.body.final_price); // Pass the entire order_data
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

async function sendOrderEmail(email, orderData, totalPrice, gst, finalPrice) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    let doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
        let pdfData = Buffer.concat(buffers);
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Order Details',
            text: 'Please find attached your order details.',
            attachments: [{
                filename: 'order-details.pdf',
                content: pdfData
            }]
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log('Error sending email: ', error);
            }
            console.log('Email sent: ' + info.response);
        });
    });

    // Add company details
    doc.fontSize(22).fillColor('blue').text('Company Details', { align: 'center' });
    doc.fontSize(16).fillColor('black').text('Name: Vikah Ecotech');
    doc.moveDown();

    // Add order details
    doc.fontSize(22).fillColor('green').text('Order Details', { align: 'center' });
    doc.moveDown();

    // Add each item in a card-like style
    orderData.forEach((item) => {
        if (item.name && item.qty && item.price && item.size) { // Ensure each item has necessary properties
            doc.rect(50, doc.y, 500, 100).stroke(); // Draw border box around each item
          
            doc.moveDown(0.5);
            doc.fontSize(14).fillColor('black').text(`Name: ${item.name}`);
            doc.text(`Quantity: ${item.qty}`);
            doc.text(`Size: ${item.size}`);
            doc.text(`Price: ${item.price}`);
            doc.moveDown();
        }
    });

    // Add order summary heading
    doc.moveDown();
    doc.fontSize(22).fillColor('purple').text('Order Summary', { align: 'center' });

    // Add order summary details
    doc.moveDown();
    if (totalPrice !== undefined && gst !== undefined && finalPrice !== undefined) {
        doc.font('Helvetica').fontSize(18).text(`Total Amount: Rs.${totalPrice.toFixed(2)}`);
        doc.text(`GST (18%): Rs.${gst.toFixed(2)}`);
        doc.text(`Final Amount: Rs.${finalPrice.toFixed(2)}`);
    } else {
        doc.font('Helvetica').fontSize(18).text('Order summary details are missing.');
    }
    
    doc.moveDown();
    doc.text(`Booking Date & Time: ${new Date().toLocaleString()}`);
    doc.moveDown(1);

    // Add social media links
    doc.moveDown();
    doc.fontSize(25).fillColor('purple').text('Follow Us On', { align: 'center' });
    doc.moveDown();
    doc.fontSize(18).fillColor('blue').text('Facebook     Twitter     YouTube     Instagram', { align: 'center' });

    doc.end();
}

module.exports = router;
