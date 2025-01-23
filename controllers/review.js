const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const newReview = async(req,res) => {
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;
    console.log(newReview)
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${req.params.id}`);
};

const deleteReview = async (req,res) => {
    let { id, reviewId} = req.params;

    Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
};

module.exports = { newReview,deleteReview }