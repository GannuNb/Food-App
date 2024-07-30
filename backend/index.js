const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log("MongoDB connected successfully");

        try {
            const fetchedData = await mongoose.connection.db.collection("food_items").find({}).toArray();
            const foodCategory = await mongoose.connection.db.collection("foodCategory").find({}).toArray();

            global.food_items = fetchedData;
            global.foodCategory = foodCategory;
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

// Routes
app.use('/api/auth', require('./Routes/OrderData')); 
app.use('/api', require('./Routes/CreateUser'));
app.use('/api', require('./Routes/DisplayData'));
// app.use('/api', require('./Routes/OrderData'));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
