const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/expressError.js');
const { listingSchema } = require("../schema.js");
const {isLoggedIn,isOwner} = require("../middleware.js");
const ListingController = require("../controllers/listing.js")
const {storage} = require("../cloudConfig.js")
const multer  = require('multer')
const upload = multer({ storage })

const validateListings = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}



router
    .route("/")
    //Index Route
    .get(ListingController.index)
    //New Listing Route
    .post(isLoggedIn,upload.single('listing[image]'),validateListings,wrapAsync(ListingController.newListing))
    // .post(upload.single('listing[image]'),(req,res) => {
    //     res.send(req.file);
    // })


//New Route
router.get("/new",isLoggedIn, ListingController.renderNewListing);

//Show Route
router
    .route("/:id")
    .get(wrapAsync(ListingController.showListing))
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListings, wrapAsync(ListingController.updateListing))
    .delete(isLoggedIn,isOwner, wrapAsync(ListingController.destroyListing));


//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(ListingController.editListing));

module.exports = router;