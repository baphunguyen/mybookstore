const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const UserRouter = require('./router/user'); 
const ProductRouter = require('./router/product');
const CartRouter = require('./router/cart');
const OrtherRouter = require('./router/orther');
const CommentRouter = require('./router/comment');
const WebadminRouter = require('./router/webadmin');
const morgan = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);

const app = express();


const db = mongoose.connection;

mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb+srv://mybookstore:123@mybookstore-qahhm.azure.mongodb.net/mybookstore?retryWrites=true&w=majority', { useNewUrlParser: true }).then(() => console.log('DB Connected!'));
db.on('error', (err) => {
    console.log('DB connection error:', err.message);
})
mongoose.Promise = global.Promise;

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://mybookstore.online"); // update to match the domain you will make the request from
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use(session({
    secret: 'mySecretKey',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

app.use(morgan("dev"))
app.use(bodyParser());
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/user', UserRouter);
app.use('/product', ProductRouter);
app.use('/cart', CartRouter);
app.use('/orther', OrtherRouter);
app.use('/comment', CommentRouter);
app.use('/webadmin', WebadminRouter);

module.exports = app;