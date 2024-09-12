const express = require("express");
const app = express();
const expressLayouts = require('express-ejs-layouts');
const PORT = process.env.PORT || 4000;
const dbConnect = require('./server/config/db');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const { isActiveRoute } = require('./server/helpers/routeHelpers')

app.use(express.static('public'));
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');
dbConnect();
// =========================================
// --------------- Dependencies ------------
// =========================================
app.use(express.static('public'));
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
dbConnect();
app.locals.isActiveRoute = isActiveRoute;
// =========================================
// =========================================
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUnitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.DATABASE_URL,
    })
}))


// --------------- ROUTES ----------------
// =======================================
app.use(require('./server/routers/main'));
app.use('/admin', require('./server/routers/admin', { layout: './layouts/admin' }));
app.listen(PORT, () => [
    console.log(`Server is listning on Port ${PORT}`)
])
