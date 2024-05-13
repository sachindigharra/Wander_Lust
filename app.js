if(process.env.NODE_ENV!='production'){
    require('dotenv').config()
}
const express = require('express')
const app = express()
const mongoose=require('mongoose')
const port = 4000
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require('ejs-mate')
const ExpressError=require('./utils/ExpressError.js')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const passport=require('passport');
const localStrategy = require('passport-local')
const User=require('./model/user.js')
//<--- Connection eastblish with Database--->
//const mongoUrl='mongodb://127.0.0.1:27017/wanderlust'
const Db_URL = process.env.ATLASDB_URL;
async function main(){
    await mongoose.connect(Db_URL);
}
main()
.then((res)=>{
    console.log('connection sucessful')
})
.catch((err)=>console.log(err))
const Store=MongoStore.create({
    mongoUrl:Db_URL,
    secret:process.env.SECRET,
    touchAfter:24*3600 
})
Store.on('error',()=>{
    console.log("Error in Session Store",err)
})
const sessionOptions = {
    Store,
    secret:process.env.SECRET, 
    resave: false,saveUninitialized: true,
    cookie: { 
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true
    }
} 

const flash = require('connect-flash');  

//<--- sessions-->
app.use(express.static(path.join(__dirname,'/public')));
app.use(session(sessionOptions));
app.use(flash())
//<---- authentication middleware--->
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

//<---require router -->
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require('./routes/user.js');
const Listing = require('./model/listing.js')


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);

//<----- flash middleware-->
app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error =req.flash('error');
    res.locals.currUser=req.user;
    next()
})

//<--- router-->
app.use('/listings',listingRouter);
app.use('/listings/:id/reviews',reviewRouter);
app.use('/',userRouter)


//<----- Middle Ware for All Unused Api --->
app.all("*",(req,res,next)=>{
    throw new ExpressError(404,'Page Not found')
});


// <---- Middle Ware for through Custom Error with Rendering Error Ejs File ---->
app.use((err,req,res,next)=>{
    let{status=500,message='somethng went wrong'}=err;
   
    res.status(status).render('error.ejs',{err});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`)) 