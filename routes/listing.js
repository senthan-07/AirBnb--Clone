const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema , reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js"); //Requiring Express Error use this in error handling middleware which is in last
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner ,validateListing ,isReviewAuthor } = require("../middleware.js");

//requiring asnyc call backs from controllers
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudconfig.js")
const upload = multer({storage});   //Temporary folder to save files

router.route("/")
.get(wrapAsync(listingController.index))  //Index route
.post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.CreateListing));  //create routr


//Icons
router.get("/hot",wrapAsync(listingController.hot));
router.get("/iconic",wrapAsync(listingController.iconic));
router.get("/mountains",wrapAsync(listingController.mountains));
router.get("/castles",wrapAsync(listingController.castles));
router.get("/camping",wrapAsync(listingController.camping));
router.get("/farms",wrapAsync(listingController.farms));
router.get("/dome",wrapAsync(listingController.dome));
router.get("/house",wrapAsync(listingController.house));
router.get("/beach",wrapAsync(listingController.beach));
//Get route  if we keep after :id then new will be considered as id and get searched
router.get("/new",isLoggedIn,listingController.renderNewForm);
//search routr
router.get("/search-results",wrapAsync(listingController.searchform))


router.route("/:id")
.get(wrapAsync(listingController.showListing)) //SHOW ROUTE
.put(upload.single('listing[image]'),validateListing,isLoggedIn,isOwner,wrapAsync(listingController.updateListing)) //update route
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing)); //DELETE ROUTe




// //Index route
// router.get("/",wrapAsync(listingController.index));



//SHOW ROUTE
// router.get("/:id",wrapAsync(listingController.showListing));

// //Create
// router.post("/",isLoggedIn,wrapAsync(listingController.CreateListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

//update route
// router.put("/:id",validateListing,isLoggedIn,isOwner,wrapAsync(listingController.updateListing));

//DELETE ROUTe
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

module.exports = router;