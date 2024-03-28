//MVC : Existing framework to write our code better 3 components model (Databse) view (frontend /rendering ) and controller(Backend core functionality)

//We will paste async call back

const Listing = require("../models/listing");

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render('listings/index.ejs',{ allListings});
};


module.exports.renderNewForm = (req,res)=>{
    res.render('listings/new.ejs');  
};

module.exports.showListing =async (req,res)=>{
    let {id} = req.params;  //We r using nested populate to populate review to populate to for each author 
    const listing = await Listing.findById(id).populate({path:"reviews",populate : {path:"author",},}).populate("owner");  //populate to get Extract Details from object also to add review name to the author
    if(!listing){
        req.flash("error","Listing u requested does not exist");
        res.redirect("/listing");
    }
   // console.log(listing)
    res.render('listings/show.ejs',{listing}); 
};


module.exports.CreateListing = async (req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url ,"...", filename);
    const newListing = new Listing(req.body.listing);
    console.log(newListing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","New Listing created");
    res.redirect("/listing");
}

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id); 
    if(!listing){
        req.flash("error","Listing u requested does not exist");
        res.redirect("/listing")
    }

    let ogimgurl = listing.image.url;
    console.log(ogimgurl);
    ogimgurl=ogimgurl.replace("/upload","/upload/h_300,w_250");
    console.log(ogimgurl);
    res.render('listings/edit.ejs',{listing,ogimgurl}); //I am sending the details of listing also
};

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;    
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing}); //We r deconstructing and sending individual js data to database
    
    if(typeof req.file != "undefined"){
        let filename = req.file.filename;
        listing.image = {url , filename};
    }    
    await listing.save();
    req.flash("success","Listing Updated");
    res.redirect(`/listing/${id}`);
};

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    console.log(id);
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Liating Deleted");
    res.redirect("/listing");
};

module.exports.searchform= async(req,res)=>{    
    let Name =  req.query.country;;
    if (Name == ""){
        req.flash("error","Enter a vaild country name");
        res.redirect("/listing");       
    }
    let allListings = await Listing.find({ $or: [{ country: Name }, { location: Name }] });
    if(allListings.length === 0){
        req.flash("error",`We have no places in ${Name} right now`);
        res.redirect("/listing")
    }
    res.render('listings/index.ejs',{allListings});
}

module.exports.hot = async(req,res)=>{
    let allListings = await Listing.find({ $or: [{category : "hot-spots"}] });
    if(allListings.length === 0){
        req.flash("error",`We have no places in hot-spots right now`);
        res.redirect("/listing")
    }
    res.render('listings/index.ejs',{allListings});
}

module.exports.iconic = async(req,res)=>{
    let allListings = await Listing.find({ $or: [{category : "iconic-cities"}] });
    if(allListings.length === 0){
        req.flash("error",`We have no places in iconic right now`);
        res.redirect("/listing")
    }
    res.render('listings/index.ejs',{allListings});
}

module.exports.mountains = async(req,res)=>{
    let allListings = await Listing.find({ $or: [{category : "mountain"}] });
    if(allListings.length === 0){
        req.flash("error",`We have no places in mountains right now`);
        res.redirect("/listing")
    }
    res.render('listings/index.ejs',{allListings});
}

module.exports.castles = async(req,res)=>{
    let allListings = await Listing.find({ $or: [{category :"castles" }] });
    if(allListings.length === 0){
        req.flash("error",`We have no places in castles right now`);
        res.redirect("/listing")
    }
    res.render('listings/index.ejs',{allListings});
}

module.exports.farms = async(req,res)=>{
    let allListings = await Listing.find({ $or: [{category : "farms"}] });
    if(allListings.length === 0){
        req.flash("error",`We have no places in farms right now`);
        res.redirect("/listing")
    }
    res.render('listings/index.ejs',{allListings});
}

module.exports.dome = async(req,res)=>{
    let allListings = await Listing.find({ $or: [{category : "dome"}] });
    if(allListings.length === 0){
        req.flash("error",`We have no places in dome right now`);
        res.redirect("/listing")
    }
    res.render('listings/index.ejs',{allListings});
}

module.exports.house= async(req,res)=>{
    let allListings = await Listing.find({ $or: [{category :" house-boats"}] });
    if(allListings.length === 0){
        req.flash("error",`We have no places in house-boats right now`);
        res.redirect("/listing")
    }
    res.render('listings/index.ejs',{allListings});
}

module.exports.beach= async(req,res)=>{
    let allListings = await Listing.find({ $or: [{category :"beach"}] });
    if(allListings.length === 0){
        req.flash("error",`We have no places in the beach right now`);
        res.redirect("/listing")
    }
    res.render('listings/index.ejs',{allListings});
}

module.exports.camping= async(req,res)=>{
    let allListings = await Listing.find({ $or: [{category : "camping"}] });
    if(allListings.length === 0){
        req.flash("error",`We have no places in the creative right now`);
        res.redirect("/listing")
    }
    res.render('listings/index.ejs',{allListings});
}