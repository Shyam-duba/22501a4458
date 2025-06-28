const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const urlRoutes = require('./services/UrlShortner/routes/urlroutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect('mongodb+srv://shyam:22501a4458@cluster0.eyjmi6k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/', urlRoutes);
// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'URL Shortener Service is running' });
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
