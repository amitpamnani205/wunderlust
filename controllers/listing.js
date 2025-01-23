const Listing = require("../models/listing.js");



const index = async (req,res) => {
    let allListings = await Listing.find();
    res.render("index.ejs", { allListings });
};

const renderNewListing = (req,res) => {
    res.render("new.ejs")
};

const showListing = async (req,res) => {
    let { id } = req.params;
    // console.log(id);

    let listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
   
    if(!listing){
        req.flash("error", "No Listing found");
        res.redirect("/listings");
    }
   
    // console.log(listing)
    res.render("show.ejs", { listing });
};

const newListing = async (req,res,next) => {

    let { title, description, image, price, location, country } = req.body.listing;
    let url = req.file.path;
    let filename = req.file.filename;
        // console.log(title, description, image, price, location, country);
        let newListing = new Listing({
            title: title,
            description: description,
            image: image,
            price: price,
            location: location,
            country: country
    
        });
        newListing.owner = req.user._id;
        newListing.image = { url,filename }
        console.log(newListing)
        await newListing.save();
    
        req.flash("success", "New Listing Created");
        res.redirect("/listings");

   
};

const editListing = async (req,res) => {
    let { id } = req.params;
    let priviousDetails = await Listing.findById(id);
    if(!priviousDetails){
        req.flash("error", "No Listing found");
        res.redirect("/listings");
    }

    
    res.render("edit.ejs", { priviousDetails });

};

const updateListing = async (req, res) => {
    let { id } = req.params;
    let updatedListing = req.body.listing;

    let listing = await Listing.findByIdAndUpdate(id, updatedListing);

    if (req.file) {
        // If a new file is uploaded, update the image
        listing.image = { 
            url: req.file.path, 
            filename: req.file.filename 
        };
        await listing.save();
    }
      
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};


const destroyListing = async (req,res) => {
    let { id } = req.params;

    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};

module.exports = { index,renderNewListing,showListing,newListing,editListing,updateListing,destroyListing };