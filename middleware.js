const Listing = require("./models/listing");
const Review = require("./models/review.js");
const {listingSchema , reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js"); //Requiring Express Error use this in error handling middleware which is in last


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){  //req.isUnauthenticated() Allows only logged in user to create or do smtg 
        req.session.redirectUrl = req.originalUrl;  //Req.original url has lastest url weher login was needed 
        req.flash("error","You must be logged in to create listing");
        res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner =  ( async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id); //We r getting id and data frm dbs to check if its owner and will update later
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to edit");
        return res.redirect(`/listing/${id}`);
    }
    next();
});

//Validation for listing server side
module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);  //Req.body gives listing object which gets validatity checked by our defined schema
    if(error){
        console.log(error)
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

//Validation for Review server side
module.exports.validateReview = (req,res,next)=>{
    let { error } = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};


//For review author

module.exports.isReviewAuthor = this.isLoggedIn, ( async (req,res,next)=>{
    let {listingid,reviewid} = req.params;
    let review = await Review.findById(reviewid); //We r getting id and data frm dbs to check if its owner and will update later
    if(!review.author.equals(res.locals.currUser.listingid)){
        req.flash("error","You did not create this review");
        return res.redirect(`/listing/${listingid}`);
    }
    next();
});
