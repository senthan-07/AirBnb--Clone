const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.createReview =async (req,res)=>{
    //I can't find listing id 
    let listing = await Listing.findById(req.params.listingid);
    let newReview = new Review(req.body.review);  //In form I made review[name] so everything can sent in form of object and we require that object here
    newReview.author = req.user._id;  //While logged in
   // console.log(newReview);
    listing.reviews.push(newReview);  // I am pushing new review object in my listing  which a has a array of review details
    await newReview.save();
    await listing.save();
    req.flash("success","New Review added");
    res.redirect(`/listing/${listing._id}`);
};

module.exports.deleteReview = async (req, res) => {
    console.log("Hiii");
    let { listingid, reviewid } = req.params; // Corrected parameter names
    console.log(req.params);
    await Review.findById(reviewid);
    await Listing.findByIdAndUpdate(listingid, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);
    req.flash("success", "Review deleted");
    res.redirect(`/listing/${listingid}`);
}