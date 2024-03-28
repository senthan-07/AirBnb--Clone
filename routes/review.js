const express = require("express");
const router = express.Router({mergeParams : true});//This is to transport req body of form to route folder
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js"); //Requiring Express Error use this in error handling middleware which is in last
const {listingSchema , reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js"); 
const {validateReview, isLoggedIn ,isReviewAuthor } = require("../middleware.js");


const reviewController = require("../controllers/review.js");


//Cut the common part i.e /listing/:id



//Review route post route
//We don't find review seperately so we don't need to create seperate index and create routres
router.post("/",validateReview,isLoggedIn,wrapAsync(reviewController.createReview));

//Review Deletion Route
//Pull operator removes from an existing array all instances of a value that match a specified condition

router.delete("/:reviewid",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;