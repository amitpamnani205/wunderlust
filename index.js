if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express(); 
const port = 8080;
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);

const ExpressError = require('./utils/expressError.js');

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");





app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(methodOverride('_method'))

app.use(express.static(path.join(__dirname,"/public")))

const dburl = process.env.ATLASDB;

main().then(() => {console.log("connection successfull")})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect(dburl);

};

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SECRET,
      },
    touchAfter: 24 * 3600,
});

store.on("error", ()=>{
    console.log("ERROR IN SEESION STORE", err);
});

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 1000 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());




app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});




app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);






//Root directory
app.get("/", (req,res) => {
    res.send("Hey! i am root :)")
});

app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
});

app.all("*", (req,res,next) =>{
    next(new ExpressError(404,"Page not found"));
});


app.use((err,req,res,next) => {
    let { statusCode=500, message="something went wrong" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", { message });
});
