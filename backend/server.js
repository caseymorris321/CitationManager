require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const citationRoutes = require('./routes/citations')
const userRoutes = require('./routes/user')
const favoriteRoutes = require('./routes/favorites');
const searchRoutes = require('./routes/search');
const cors = require('cors');

// express app
const app = express()

// middleware
app.use(express.json())
app.use(cors());

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next();
})

// routes
app.use('/api/citations', citationRoutes)
app.use('/api/user', userRoutes)
app.use('/api/favorites', favoriteRoutes); 
app.use('/api/search', searchRoutes);

// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log('connected to db & listening on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })