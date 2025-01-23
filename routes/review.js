const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/expressError.js');
const { reviewSchema } = require("../schema.js");
const { isLoggedIn ,isAuthor} = require("../middleware.js")
const ReviewController = require("../controllers/review.js")


const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// Reviews
// POST Route 
router.post("/",validateReview, wrapAsync(ReviewController.newReview));

// DELETE Route 
router.delete("/:reviewId",isLoggedIn,isAuthor, wrapAsync(ReviewController.deleteReview));

module.exports = router;