const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

console.log('MONGO_URI loaded:', process.env.MONGO_URI ? 'YES' : 'NO');
console.log('JWT_SECRET loaded:', process.env.JWT_SECRET ? 'YES' : 'NO');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error:', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/stats', require('./routes/stats'));

app.get('/', (req, res) => {
  res.json({ message: 'Food Waste Platform API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});