const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');


const route = require('./routes/allRoute');
const { requireAuth, checkUser } = require('./middleware/middlewares');


const app = express();
dotenv.config();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());


// view engine
app.set('view engine', 'ejs');

// database connection
mongoose.connect(process.env.MONGO_CONNECTION, 
  { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex:true 
  })
  .then((result) => {
    console.log("Database Created");
  })
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser)
app.use('/', route);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));

app.listen(process.env.PORT, () => {
  console.log(`App is listening on ${process.env.PORT}`);
});