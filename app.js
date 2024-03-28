if(process.env. NODE_ENV != "production"){
    require('dotenv').config(); 
}
console.log(process.env)

const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); //Ejs mate is for styling templates and layouts i.e to make styling easier
const ExpressError = require("./utils/ExpressError.js"); //Requiring Express Error use this in error handling middleware which is in last
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
//For login and auth
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");
const Review = require("./models/review.js");
const Listing = require("./models/listing");
const wrapAsync = require('./utils/wrapAsync.js');
const { isLoggedIn, isReviewAuthor } = require('./middleware.js');



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate); //After setting create layout folder in views foldee
app.use(express.static(path.join(__dirname,"/public"))); //This is to connect the css folder created in public static folder


const dburl = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl : dburl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24*3600,
});

store.on("error",()=>{
    console.log("Error in mongo session store",err);
})

const sessionOptions={
    store,
    secret : process.env.SECRET,
    resave:false,
    saveUninitialized : true, 
    cookie : {
        expires : Date.now()+7*24*60*60*1000,  //Days x hours x minutes x seconds x milliseconds
        maxAge : 7*24*60*60*1000,
        httpOnly : true,
    },
};





main()
.then(()=>{
    console.log("connectes to db");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dburl);
};


// app.get("/",(req,res)=>{
//     res.send("Root"); 
// });


app.use(session(sessionOptions));  //This is required for auth
app.use(flash()); //Write this after sessions bcz we generally use flash with help of routes so we need to define them before
//login
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())


//We are ccreating a middleware just b4 routes for flash
app.use((req,res,next)=>{
    res.locals.success = req.flash("success"); //Flashing it in boiler plate in inclued create new ejs file and it in body 
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; //Curr user info
    next();
});

// //Demo user
// app.get("/listing/demouser",async (req,res)=>{
//     let fakeuser = new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });
//     let registeredUser = await User.register(fakeuser,"hello");
//     res.send(registeredUser);
// })

//Parent routes and the one's in routes folde are child routes
app.use("/listing/:listingid/reviews",reviewsRouter)  //The cutted part in review.js
app.use("/listing",listingsRouter);
app.use("/",userRouter);






// After all routing i.e after la listings and reviews the below code runs

//If incomming req does not match with All prev routes below will get matched * represents all As it doesn't match with any route we send this error
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
});


//Will use required Expresserror and WrapAsync fucntion
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong"}=err; //Deconstructing Error messages
    res.status(statusCode).render("listings/error.ejs",{message});
    //res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log("listening on port 8080");
});




// Middle part
// //Index route
// app.get("/listing",wrapAsync(async (req,res)=>{
//     const allListings = await Listing.find({});
//     res.render('listings/index.ejs',{ allListings});
// }));

// //Get route
// app.get("/listing/new",(req,res)=>{
//     res.render('listings/new.ejs');
// })

// //Post route to add data and to complete get route
// app.post("/listing",validateListing, wrapAsync(async(req,res,next)=>{
//     //let {title,description,image,price,country,location} = req.body; instead of writing this big I can create a listing key value pair in new ejs and write the below code 
//     const newListing = new Listing(req.body.listing); //instance  
//     await newListing.save()
//     console.log(newListing)
//     res.redirect("/listing")
// }));


// //edit route
// app.get("/listing/:id/edit",wrapAsync(async (req,res)=>{
//     let {id} = req.params;
//     const listing = await Listing.findById(id); 
//     res.render('listings/edit.ejs',{listing}); //I am sending the details of listing also
// }));

// //Update route continuation of edit route
//    // if(!req.body.listing){
//     //     throw new ExpressError(400,"Send Vaild data !");  //This is to prevent listing validation error that is if req is sent with no Proper data
//     // }  Instead of creating so many diff if for diff title desc price etc simply use   
// app.put("/listing/:id",validateListing,wrapAsync(async (req,res)=>{
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.listing}); //We r deconstructing and sending individual js data to database
//     res.redirect("/listing");
// }));

// //SHOW ROUTE
// app.get("/listing/:id",wrapAsync(async (req,res)=>{
//     let {id} = req.params;
//     const listing = await Listing.findById(id).populate("reviews");  //populate to get Extract Details from object
//     res.render('listings/show.ejs',{listing}); 
// }));

// //DELETE ROUTe
// app.delete("/listing/:id",wrapAsync(async (req,res)=>{
//     let {id} = req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     res.redirect("/listing");
// }));




//Test to see if data got inserted
// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title : "My home",
//         desciption : "Near beach",
//         price : 1200,
//         location : "Goa",
//         country : "India",
//     });
//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Success");
// });