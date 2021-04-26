document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("new-app JS imported successfully!");
  },
  false
);

// -------------------
// edit notes DOM: see all users notes
const allReviewsLink = document.getElementById("filter-link");
allReviewsLink.addEventListener("click", 
() => {
  console.log("you clicked to see all reviews");
  const myReviews = document.getElementById("rating-view-user");
  const allReviews = document.getElementById("rating-view-all");
  backToMyReviews.style.display = "block"
  allReviewsLink.style.display = "none"
  myReviews.style.display = "none"
  allReviews.style.display = "block"
  
});
// edit notes DOM: back to only users notes 
const backToMyReviews = document.getElementById("back-to-my-reviews");
backToMyReviews.addEventListener("click", 
() => {
  console.log("you clicked to see just your reviews");
  const myReviews = document.getElementById("rating-view-user");
  const allReviews = document.getElementById("rating-view-all");
  allReviewsLink.style.display = "block"
  myReviews.style.display = "block"
  allReviews.style.display = "none"
  backToMyReviews.style.display = "none"
});
// ------------------

