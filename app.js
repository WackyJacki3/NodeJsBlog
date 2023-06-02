import dotenv from "dotenv";
import express from "express";
import expressLayout from "express-ejs-layouts";
import methodOverride from "method-override";
import mainRoutes from "./server/routes/main.js";
import adminRoutes from "./server/routes/admin.js";
import connectDB from "./server/config/db.js"
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import session from "express-session";

dotenv.config();
const app = express();
const PORT = 5000 || process.env.PORT;

//Connect to DB
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
}));

app.use(express.static('public'));


// Templating Engine / EJS
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', mainRoutes);
app.use('/', adminRoutes);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});