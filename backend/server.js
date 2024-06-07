require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const citationRoutes = require('./routes/citations');
const userRoutes = require('./routes/user');
const favoriteRoutes = require('./routes/favorites');
const searchRoutes = require('./routes/search');
const cors = require('cors');

// express app
const app = express();

// middleware
app.use(express.json());
app.use(cors({
  origin: 'https://citationmanagerfrontend.onrender.com', 
}));

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use('/api/citations', citationRoutes);
app.use('/api/user', userRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/search', searchRoutes);

// start the server
const server = app.listen(process.env.PORT || 3000, () => {
  const port = server.address().port;
  console.log(`Server is running on port ${port}`);
});

// connect to db
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error);
  });

// handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
});