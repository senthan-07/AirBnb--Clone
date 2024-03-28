const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const user = require("./user.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename:{
      type:String,
    },
    url : {
      type: String,
  }},
  price: Number,
  location: String,
  country: String,
  category : String,
  reviews : [
    {
      type : Schema.Types.ObjectId,
      ref : "Review"      
    },
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },  
});

//After callind findbyid and delete in reviews this post middleware gets called
listingSchema.post("findOneAndDelete",async (listing)=>{
  if(listing){
    await Review.deleteMany({reviews : {_id : {$in : listing.reviews}}});  //id _id are part of listing.reviews then they are deleted

  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;