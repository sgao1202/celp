const express = require('express');
const reviews = require('../data/reviews');
const restaurants = require('../data/restaurants')
const router = express.Router();

router.get('/', async(req, res) =>{
    const userData = req.session.user;
    const userReviews = await reviews.getAllReviewsOfUser(userData._id);

    //combine restaurants and reviews into one array for easier access
    let restaurantNames = [];
    for (let review of userReviews){
        let rest = await restaurants.getRestaurantById(review.restaurantId);
        restaurantNames.push(rest.name);
    }
    let reviewRest = []
    for (let i = 0; i < userReviews.length; i++){
        reviewRest.push({
            review: userReviews[i], 
            restaurant: restaurantNames[i]
        });
    }

    //get restaurant names of user's favorited restaurants
    let favRestaurants = [];
    for (let restaurantId of userData.favoritedRestaurants){
        let rest = await restaurants.getRestaurantById(restaurantId);
        favRestaurants.push(rest.name);
    }

    return res.render('users/info', {
        log: true,
        authenticated: true,
        partial: 'user-info-script',
        // user: userData,
        firstName: userData.firstName,
        lastName: userData.lastName,
        userName: userData.username,
        email: userData.email,
        age: userData.age,
        favRestaurants: favRestaurants,
        reviews: reviewRest
    });
});

module.exports = router;